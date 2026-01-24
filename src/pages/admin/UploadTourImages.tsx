import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Upload, CheckCircle, XCircle } from "lucide-react";

// Import all tour images
import catamaranBurjAlArab from "@/assets/tours/catamaran-burj-al-arab.jpg";
import dhowCruiseMarina from "@/assets/tours/dhow-cruise-marina.jpg";
import megayachtBurjKhalifa from "@/assets/tours/megayacht-burj-khalifa.jpg";
import privateYacht100ft from "@/assets/tours/private-yacht-100ft.jpg";
import privateYacht33ft from "@/assets/tours/private-yacht-33ft.jpg";
import privateYacht55ft from "@/assets/tours/private-yacht-55ft.jpg";
import privateYacht80ft from "@/assets/tours/private-yacht-80ft.jpg";
import yachtBbqExperience from "@/assets/tours/yacht-bbq-experience.jpg";
import yachtLunchDaytime from "@/assets/tours/yacht-lunch-daytime.jpg";
import yachtMoonlight from "@/assets/tours/yacht-moonlight.jpg";
import yachtSunsetTour from "@/assets/tours/yacht-sunset-tour.jpg";
import yachtSwimming from "@/assets/tours/yacht-swimming.jpg";

interface ImageMapping {
  localPath: string;
  importedUrl: string;
  storagePath: string;
  status: "pending" | "uploading" | "success" | "error";
  storageUrl?: string;
}

const IMAGE_MAPPINGS: ImageMapping[] = [
  { localPath: "/assets/tours/catamaran-burj-al-arab.jpg", importedUrl: catamaranBurjAlArab, storagePath: "main/catamaran-burj-al-arab.jpg", status: "pending" },
  { localPath: "/assets/tours/dhow-cruise-marina.jpg", importedUrl: dhowCruiseMarina, storagePath: "main/dhow-cruise-marina.jpg", status: "pending" },
  { localPath: "/assets/tours/megayacht-burj-khalifa.jpg", importedUrl: megayachtBurjKhalifa, storagePath: "main/megayacht-burj-khalifa.jpg", status: "pending" },
  { localPath: "/assets/tours/private-yacht-100ft.jpg", importedUrl: privateYacht100ft, storagePath: "main/private-yacht-100ft.jpg", status: "pending" },
  { localPath: "/assets/tours/private-yacht-33ft.jpg", importedUrl: privateYacht33ft, storagePath: "main/private-yacht-33ft.jpg", status: "pending" },
  { localPath: "/assets/tours/private-yacht-55ft.jpg", importedUrl: privateYacht55ft, storagePath: "main/private-yacht-55ft.jpg", status: "pending" },
  { localPath: "/assets/tours/private-yacht-80ft.jpg", importedUrl: privateYacht80ft, storagePath: "main/private-yacht-80ft.jpg", status: "pending" },
  { localPath: "/assets/tours/yacht-bbq-experience.jpg", importedUrl: yachtBbqExperience, storagePath: "main/yacht-bbq-experience.jpg", status: "pending" },
  { localPath: "/assets/tours/yacht-lunch-daytime.jpg", importedUrl: yachtLunchDaytime, storagePath: "main/yacht-lunch-daytime.jpg", status: "pending" },
  { localPath: "/assets/tours/yacht-moonlight.jpg", importedUrl: yachtMoonlight, storagePath: "main/yacht-moonlight.jpg", status: "pending" },
  { localPath: "/assets/tours/yacht-sunset-tour.jpg", importedUrl: yachtSunsetTour, storagePath: "main/yacht-sunset-tour.jpg", status: "pending" },
  { localPath: "/assets/tours/yacht-swimming.jpg", importedUrl: yachtSwimming, storagePath: "main/yacht-swimming.jpg", status: "pending" },
];

export default function UploadTourImages() {
  const [images, setImages] = useState<ImageMapping[]>(IMAGE_MAPPINGS);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingDb, setIsUpdatingDb] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const uploadImageToStorage = async (mapping: ImageMapping): Promise<string | null> => {
    try {
      // Fetch the image from the imported URL
      const response = await fetch(mapping.importedUrl);
      const blob = await response.blob();
      
      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("tour-images")
        .upload(mapping.storagePath, blob, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("tour-images")
        .getPublicUrl(mapping.storagePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleUploadAll = async () => {
    setIsUploading(true);
    const updatedImages = [...images];

    for (let i = 0; i < updatedImages.length; i++) {
      updatedImages[i] = { ...updatedImages[i], status: "uploading" };
      setImages([...updatedImages]);

      const storageUrl = await uploadImageToStorage(updatedImages[i]);
      
      if (storageUrl) {
        updatedImages[i] = { ...updatedImages[i], status: "success", storageUrl };
      } else {
        updatedImages[i] = { ...updatedImages[i], status: "error" };
      }
      setImages([...updatedImages]);
    }

    setIsUploading(false);
    setUploadComplete(true);
    toast.success("All images uploaded to storage!");
  };

  const handleUpdateDatabase = async () => {
    setIsUpdatingDb(true);
    
    const urlMappings: Record<string, string> = {};
    images.forEach((img) => {
      if (img.storageUrl) {
        urlMappings[img.localPath] = img.storageUrl;
      }
    });

    // Get all tours and update their image_url
    const { data: tours, error: fetchError } = await supabase
      .from("tours")
      .select("id, image_url, gallery");

    if (fetchError) {
      toast.error("Failed to fetch tours");
      setIsUpdatingDb(false);
      return;
    }

    let updatedCount = 0;
    for (const tour of tours || []) {
      const newImageUrl = urlMappings[tour.image_url] || tour.image_url;
      const newGallery = (tour.gallery || []).map((url: string) => urlMappings[url] || url);

      if (newImageUrl !== tour.image_url || JSON.stringify(newGallery) !== JSON.stringify(tour.gallery)) {
        const { error: updateError } = await supabase
          .from("tours")
          .update({ image_url: newImageUrl, gallery: newGallery })
          .eq("id", tour.id);

        if (!updateError) {
          updatedCount++;
        }
      }
    }

    setIsUpdatingDb(false);
    toast.success(`Updated ${updatedCount} tours with new image URLs!`);
  };

  const successCount = images.filter((img) => img.status === "success").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upload Tour Images</h1>
          <p className="text-muted-foreground">
            Upload local tour images to cloud storage for better performance
          </p>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={handleUploadAll} 
            disabled={isUploading || uploadComplete}
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload All Images
              </>
            )}
          </Button>

          {uploadComplete && (
            <Button 
              onClick={handleUpdateDatabase}
              disabled={isUpdatingDb}
              size="lg"
              variant="secondary"
            >
              {isUpdatingDb ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Database...
                </>
              ) : (
                "Update Database URLs"
              )}
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Images ({successCount}/{images.length} uploaded)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="border rounded-lg overflow-hidden bg-card"
                >
                  <div className="aspect-video relative">
                    <img
                      src={img.importedUrl}
                      alt={img.storagePath}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {img.status === "uploading" && (
                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      )}
                      {img.status === "success" && (
                        <div className="bg-accent text-accent-foreground rounded-full p-1">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      )}
                      {img.status === "error" && (
                        <div className="bg-destructive text-destructive-foreground rounded-full p-1">
                          <XCircle className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{img.storagePath}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {img.localPath}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
