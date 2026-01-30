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

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
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
      resolve(isJpeg || isPng);
    };
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, 4));
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
      return "Only JPG, JPEG, and PNG images are allowed";
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB";
    }

    // Validate magic bytes
    const isValidType = await validateFileType(file);
    if (!isValidType) {
      return "Invalid file format. Only JPG/PNG images are allowed";
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
            originalSize: file.size,
            webpSize: file.size,
            savedPercent: 0,
            dimensions: { width: 0, height: 0 },
          };
        }

        // Convert to WebP via edge function
        setProgress(20);
        onProgress?.(20);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        formData.append("quality", webpQuality.toString());
        formData.append("maxWidth", maxWidth.toString());

        setProgress(40);
        onProgress?.(40);

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/convert-image-webp`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: formData,
          }
        );

        setProgress(80);
        onProgress?.(80);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const result = await response.json();

        setProgress(100);
        onProgress?.(100);

        if (showToast) {
          if (result.savedPercent > 0) {
            toast.success(
              `Image converted to WebP! Saved ${result.savedPercent}% (${formatBytes(result.savedBytes)})`
            );
          } else {
            toast.success("Image uploaded successfully");
          }
        }

        return result as UploadResult;
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
