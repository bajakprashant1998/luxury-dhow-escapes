import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GalleryImage, GalleryImageDisplay, mapGalleryImage } from "@/lib/galleryTypes";

export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: async (): Promise<GalleryImageDisplay[]> => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching gallery:", error);
        throw error;
      }

      return (data as GalleryImage[]).map(mapGalleryImage);
    },
  });
}

export function useGalleryCategories() {
  return useQuery({
    queryKey: ["gallery-categories"],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from("gallery")
        .select("category")
        .not("category", "is", null);

      if (error) {
        console.error("Error fetching gallery categories:", error);
        throw error;
      }

      // Get unique categories
      const categories = [...new Set(data.map((item) => item.category as string))];
      return categories.sort();
    },
  });
}
