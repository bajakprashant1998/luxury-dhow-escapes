import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { testimonials as staticTestimonials } from "@/data/testimonials";

export interface Testimonial {
  id: string;
  name: string;
  location?: string;
  rating: number;
  date: string;
  title?: string;
  content: string;
  avatar?: string;
  tourName?: string;
}

// Map database reviews to testimonial format
function mapReviewToTestimonial(review: {
  id: string;
  customer_name: string;
  customer_email: string | null;
  rating: number;
  review_text: string | null;
  created_at: string | null;
  tour_id: string | null;
}): Testimonial {
  const createdAt = review.created_at ? new Date(review.created_at) : new Date();
  const monthYear = createdAt.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return {
    id: review.id,
    name: review.customer_name,
    rating: review.rating,
    date: monthYear,
    content: review.review_text || "",
    // Extract location from email domain or use default
    location: "Verified Guest",
  };
}

export function useTestimonials(limit: number = 6) {
  return useQuery({
    queryKey: ["testimonials", limit],
    queryFn: async (): Promise<Testimonial[]> => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }

      // If no reviews in database, fall back to static testimonials
      if (!data || data.length === 0) {
        return staticTestimonials.slice(0, limit);
      }

      return data.map(mapReviewToTestimonial);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get average rating from approved reviews
export function useAverageRating() {
  return useQuery({
    queryKey: ["average-rating"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("status", "approved");

      if (error) {
        console.error("Error fetching ratings:", error);
        return { average: 4.9, count: 0 };
      }

      if (!data || data.length === 0) {
        return { average: 4.9, count: staticTestimonials.length };
      }

      const total = data.reduce((sum, r) => sum + r.rating, 0);
      const average = Math.round((total / data.length) * 10) / 10;

      return { average, count: data.length };
    },
    staleTime: 5 * 60 * 1000,
  });
}
