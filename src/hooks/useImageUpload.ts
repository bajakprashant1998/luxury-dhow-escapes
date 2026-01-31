import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSiteSetting } from "@/hooks/useSiteSettings";

interface ImageSettings {
  webpQuality?: number;
  maxWidth?: number;
  enableWebp?: boolean;
}

interface UploadResult {
  url: string;
  originalSize: number;
  webpSize: number;
  savedPercent: number;
  dimensions: { width: number; height: number };
}

interface UseImageUploadOptions {
  folder?: string;
  onProgress?: (progress: number) => void;
  showToast?: boolean;
}

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Validate file type by checking magic bytes
function validateFileType(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arr = new Uint8Array(reader.result as ArrayBuffer);
      // Check JPEG signature: FF D8 FF
      const isJpeg = arr[0] === 0xff && arr[1] === 0xd8 && arr[2] === 0xff;
      // Check PNG signature: 89 50 4E 47
      const isPng = arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4e && arr[3] === 0x47;
      // Check WebP signature: RIFF....WEBP
      const isWebp =
        arr[0] === 0x52 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x46 &&
        arr[8] === 0x57 && arr[9] === 0x45 && arr[10] === 0x42 && arr[11] === 0x50;

      resolve(isJpeg || isPng || isWebp);
    };
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, 12));
  });
}

// Convert image to WebP using Canvas API (client-side conversion)
function convertToWebP(file: File, quality: number, maxWidth: number): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calculate dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      // Create canvas and draw resized image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to WebP blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, width, height });
          } else {
            reject(new Error('Failed to convert image to WebP'));
          }
        },
        'image/webp',
        quality / 100 // Canvas expects 0-1 range
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for conversion'));
    };

    img.src = url;
  });
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const { folder = "uploads", onProgress, showToast = true } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get image settings from database
  const { data: imageSettings } = useSiteSetting("image_settings");
  const settings: ImageSettings = (imageSettings as ImageSettings) || {};

  const webpQuality = settings.webpQuality ?? 80;
  const maxWidth = settings.maxWidth ?? 1920;
  const enableWebp = settings.enableWebp ?? true;

  const validateFile = useCallback(async (file: File): Promise<string | null> => {
    // Check MIME type
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      return "Only JPG, PNG, and WebP images are allowed";
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB";
    }

    // Validate magic bytes
    const isValidType = await validateFileType(file);
    if (!isValidType) {
      return "Invalid file format. Only JPG/PNG/WebP images are allowed";
    }

    return null;
  }, []);

  const createPreview = useCallback((file: File): string => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    return url;
  }, []);

  const clearPreview = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  }, [preview]);

  const uploadWithWebpConversion = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      setIsUploading(true);
      setProgress(0);
      setError(null);

      try {
        // Validate file
        const validationError = await validateFile(file);
        if (validationError) {
          setError(validationError);
          if (showToast) toast.error(validationError);
          return null;
        }

        // Create preview
        createPreview(file);
        setProgress(10);
        onProgress?.(10);

        const originalSize = file.size;

        if (!enableWebp) {
          // Fallback: upload directly without conversion
          setProgress(30);
          onProgress?.(30);

          const fileExt = file.name.split(".").pop();
          const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("tour-images")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          setProgress(90);
          onProgress?.(90);

          const { data: urlData } = supabase.storage
            .from("tour-images")
            .getPublicUrl(fileName);

          setProgress(100);
          onProgress?.(100);

          if (showToast) toast.success("Image uploaded successfully");

          return {
            url: urlData.publicUrl,
            originalSize,
            webpSize: originalSize,
            savedPercent: 0,
            dimensions: { width: 0, height: 0 },
          };
        }

        // Convert to WebP client-side using Canvas API
        setProgress(20);
        onProgress?.(20);

        const { blob: webpBlob, width, height } = await convertToWebP(file, webpQuality, maxWidth);

        setProgress(50);
        onProgress?.(50);

        // Generate sanitized filename
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        const sanitizedName = baseName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/(^-|-$)/g, "")
          .slice(0, 50);

        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 8);
        const fileName = `${folder}/webp/${timestamp}-${sanitizedName || randomId}.webp`;

        setProgress(60);
        onProgress?.(60);

        // Upload WebP blob directly to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("tour-images")
          .upload(fileName, webpBlob, {
            contentType: "image/webp",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        setProgress(90);
        onProgress?.(90);

        const { data: urlData } = supabase.storage
          .from("tour-images")
          .getPublicUrl(fileName);

        const webpSize = webpBlob.size;
        const savedBytes = originalSize - webpSize;
        const savedPercent = Math.round((savedBytes / originalSize) * 100);

        setProgress(100);
        onProgress?.(100);

        if (showToast) {
          if (savedPercent > 0) {
            toast.success(
              `Image converted to WebP! Saved ${savedPercent}% (${formatBytes(savedBytes)})`
            );
          } else {
            toast.success("Image uploaded as WebP");
          }
        }

        return {
          url: urlData.publicUrl,
          originalSize,
          webpSize,
          savedPercent,
          dimensions: { width, height },
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        if (showToast) toast.error(message);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [folder, webpQuality, maxWidth, enableWebp, validateFile, createPreview, onProgress, showToast]
  );

  const uploadMultiple = useCallback(
    async (files: File[]): Promise<(UploadResult | null)[]> => {
      const results: (UploadResult | null)[] = [];
      for (let i = 0; i < files.length; i++) {
        const result = await uploadWithWebpConversion(files[i]);
        results.push(result);
      }
      return results;
    },
    [uploadWithWebpConversion]
  );

  const reset = useCallback(() => {
    clearPreview();
    setIsUploading(false);
    setProgress(0);
    setError(null);
  }, [clearPreview]);

  return {
    upload: uploadWithWebpConversion,
    uploadMultiple,
    isUploading,
    progress,
    preview,
    error,
    clearPreview,
    reset,
    validateFile,
    settings: { webpQuality, maxWidth, enableWebp },
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export type { UploadResult, UseImageUploadOptions };
