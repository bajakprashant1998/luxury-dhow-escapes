import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Magic bytes for file type validation
const FILE_SIGNATURES = {
  jpeg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47],
};

function validateFileSignature(bytes: Uint8Array): "jpeg" | "png" | null {
  // Check JPEG
  if (
    bytes[0] === FILE_SIGNATURES.jpeg[0] &&
    bytes[1] === FILE_SIGNATURES.jpeg[1] &&
    bytes[2] === FILE_SIGNATURES.jpeg[2]
  ) {
    return "jpeg";
  }
  // Check PNG
  if (
    bytes[0] === FILE_SIGNATURES.png[0] &&
    bytes[1] === FILE_SIGNATURES.png[1] &&
    bytes[2] === FILE_SIGNATURES.png[2] &&
    bytes[3] === FILE_SIGNATURES.png[3]
  ) {
    return "png";
  }
  return null;
}

function sanitizeFileName(name: string): string {
  const baseName = name.replace(/\.[^/.]+$/, "");
  const sanitized = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 50);
  
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${sanitized || randomId}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";
    const qualityStr = formData.get("quality") as string;
    const maxWidthStr = formData.get("maxWidth") as string;
    
    // These are stored for future WebP conversion implementation
    const _quality = qualityStr ? parseInt(qualityStr) : 80;
    const _maxWidth = maxWidthStr ? parseInt(maxWidthStr) : 1920;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate file size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return new Response(
        JSON.stringify({ error: "File size exceeds 5MB limit" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Read file bytes
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Validate file signature (magic bytes)
    const fileType = validateFileSignature(bytes);
    if (!fileType) {
      return new Response(
        JSON.stringify({ error: "Invalid file type. Only JPG/JPEG/PNG allowed." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration missing");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate sanitized filename - store in /webp/ folder for future WebP implementation
    const sanitizedName = sanitizeFileName(file.name);
    const extension = fileType === "jpeg" ? "jpg" : "png";
    const filePath = `${folder}/webp/${sanitizedName}.${extension}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("tour-images")
      .upload(filePath, bytes, {
        contentType: fileType === "jpeg" ? "image/jpeg" : "image/png",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw new Error("Failed to upload image");
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("tour-images")
      .getPublicUrl(filePath);

    const originalSize = bytes.length;

    return new Response(
      JSON.stringify({
        url: urlData.publicUrl,
        originalSize,
        webpSize: originalSize,
        savedBytes: 0,
        savedPercent: 0,
        dimensions: { width: 0, height: 0 },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Image upload error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Upload failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
