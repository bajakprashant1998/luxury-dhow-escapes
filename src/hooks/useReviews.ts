import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Review {
  id: string;
  tour_id: string | null;
  booking_id: string | null;
  customer_name: string;
  customer_email: string | null;
  rating: number;
  review_text: string | null;
  status: string;
  created_at: string;
}

export interface ReviewFormData {
  tour_id: string;
  customer_name: string;
  customer_email?: string;
  rating: number;
  review_text?: string;
  status?: string;
}

// Fetch reviews for a specific tour
export const useTourReviews = (tourId: string | undefined) => {
  return useQuery({
    queryKey: ["tour-reviews", tourId],
    queryFn: async () => {
      if (!tourId) return [];
      
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("tour_id", tourId)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!tourId,
  });
};

// Fetch all reviews for a tour (admin - includes pending)
export const useAdminTourReviews = (tourId: string | undefined) => {
  return useQuery({
    queryKey: ["admin-tour-reviews", tourId],
    queryFn: async () => {
      if (!tourId) return [];
      
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("tour_id", tourId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!tourId,
  });
};

// Create a new review
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (reviewData: ReviewFormData) => {
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          tour_id: reviewData.tour_id,
          customer_name: reviewData.customer_name,
          customer_email: reviewData.customer_email || null,
          rating: reviewData.rating,
          review_text: reviewData.review_text || null,
          status: reviewData.status || "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tour-reviews", variables.tour_id] });
      queryClient.invalidateQueries({ queryKey: ["admin-tour-reviews", variables.tour_id] });
      toast({
        title: "Review added",
        description: "The review has been added successfully.",
      });
    },
    onError: (error) => {
      console.error("Error creating review:", error);
      toast({
        title: "Error",
        description: "Failed to add review. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Update an existing review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...reviewData }: Partial<Review> & { id: string }) => {
      const { data, error } = await supabase
        .from("reviews")
        .update(reviewData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tour-reviews", data.tour_id] });
      queryClient.invalidateQueries({ queryKey: ["admin-tour-reviews", data.tour_id] });
      toast({
        title: "Review updated",
        description: "The review has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating review:", error);
      toast({
        title: "Error",
        description: "Failed to update review. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Delete a review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, tourId }: { id: string; tourId: string }) => {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { id, tourId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tour-reviews", data.tourId] });
      queryClient.invalidateQueries({ queryKey: ["admin-tour-reviews", data.tourId] });
      toast({
        title: "Review deleted",
        description: "The review has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Check if current user is admin
export const useIsAdmin = () => {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }
      
      return !!data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
