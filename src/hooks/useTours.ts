import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapDbTourToTour, mapDbToursToTours, Tour } from "@/lib/tourMapper";

// Fetch all active tours
export function useTours() {
  return useQuery({
    queryKey: ["tours"],
    queryFn: async (): Promise<Tour[]> => {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return mapDbToursToTours(data || []);
    },
  });
}

// Fetch a single tour by slug or seo_slug
export function useTour(slug: string) {
  return useQuery({
    queryKey: ["tour", slug],
    queryFn: async (): Promise<Tour | null> => {
      // First try to find by regular slug
      let { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("slug", slug)
        .eq("status", "active")
        .maybeSingle();

      if (error) throw error;
      
      // If not found by slug, try to find by seo_slug
      if (!data) {
        const seoResult = await supabase
          .from("tours")
          .select("*")
          .eq("seo_slug", slug)
          .eq("status", "active")
          .maybeSingle();
          
        if (seoResult.error) throw seoResult.error;
        data = seoResult.data;
      }

      return data ? mapDbTourToTour(data) : null;
    },
    enabled: !!slug,
  });
}

// Fetch featured tours
export function useFeaturedTours() {
  return useQuery({
    queryKey: ["tours", "featured"],
    queryFn: async (): Promise<Tour[]> => {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("status", "active")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) throw error;
      return mapDbToursToTours(data || []);
    },
  });
}

// Fetch related tours by category (excluding current tour)
export function useRelatedTours(category: string, excludeId: string) {
  return useQuery({
    queryKey: ["tours", "related", category, excludeId],
    queryFn: async (): Promise<Tour[]> => {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("status", "active")
        .eq("category", category)
        .neq("id", excludeId)
        .limit(3);

      if (error) throw error;
      return mapDbToursToTours(data || []);
    },
    enabled: !!category && !!excludeId,
  });
}

// Note: Categories are now managed via useCategories hook from useCategories.ts
// The hardcoded categories array has been removed - use useActiveCategories() instead
