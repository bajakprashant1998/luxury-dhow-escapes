import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Discount {
  id: string;
  code: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  applicable_tour_ids: string[] | null;
  created_at: string;
  updated_at: string;
}

export type DiscountInsert = Omit<Discount, "id" | "created_at" | "updated_at" | "used_count">;
export type DiscountUpdate = Partial<DiscountInsert>;

// Fetch all discounts (admin)
export function useDiscounts() {
  return useQuery({
    queryKey: ["discounts"],
    queryFn: async (): Promise<Discount[]> => {
      const { data, error } = await supabase
        .from("discounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as Discount[];
    },
  });
}

// Fetch only active, valid discounts (public)
export function useActiveDiscounts() {
  return useQuery({
    queryKey: ["discounts", "active"],
    queryFn: async (): Promise<Discount[]> => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("discounts")
        .select("*")
        .eq("is_active", true)
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .or(`starts_at.is.null,starts_at.lte.${now}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as Discount[];
    },
  });
}

// Validate a discount code
export function useValidateDiscount() {
  return useMutation({
    mutationFn: async ({
      code,
      orderAmount,
      tourId,
    }: {
      code: string;
      orderAmount: number;
      tourId?: string;
    }): Promise<Discount | null> => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("discounts")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const discount = data as Discount;

      // Check expiry
      if (discount.expires_at && new Date(discount.expires_at) < new Date()) {
        throw new Error("This discount code has expired");
      }

      // Check start date
      if (discount.starts_at && new Date(discount.starts_at) > new Date()) {
        throw new Error("This discount code is not yet active");
      }

      // Check usage limit
      if (discount.max_uses !== null && discount.used_count >= discount.max_uses) {
        throw new Error("This discount code has reached its usage limit");
      }

      // Check minimum order amount
      if (discount.min_order_amount && orderAmount < discount.min_order_amount) {
        throw new Error(`Minimum order amount is AED ${discount.min_order_amount}`);
      }

      // Check applicable tours
      if (discount.applicable_tour_ids && tourId) {
        if (!discount.applicable_tour_ids.includes(tourId)) {
          throw new Error("This discount code is not valid for this tour");
        }
      }

      return discount;
    },
  });
}

// Create discount
export function useCreateDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (discount: DiscountInsert) => {
      const { data, error } = await supabase
        .from("discounts")
        .insert({
          ...discount,
          code: discount.code.toUpperCase(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      toast.success("Discount created successfully");
    },
    onError: (error: Error) => {
      console.error("Error creating discount:", error);
      if (error.message.includes("duplicate")) {
        toast.error("A discount with this code already exists");
      } else {
        toast.error("Failed to create discount");
      }
    },
  });
}

// Update discount
export function useUpdateDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...update }: DiscountUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("discounts")
        .update({
          ...update,
          code: update.code?.toUpperCase(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      toast.success("Discount updated successfully");
    },
    onError: (error) => {
      console.error("Error updating discount:", error);
      toast.error("Failed to update discount");
    },
  });
}

// Delete discount
export function useDeleteDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("discounts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      toast.success("Discount deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting discount:", error);
      toast.error("Failed to delete discount");
    },
  });
}

// Increment used count (call after successful booking with discount)
export function useIncrementDiscountUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: current, error: fetchError } = await supabase
        .from("discounts")
        .select("used_count")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from("discounts")
        .update({ used_count: (current?.used_count || 0) + 1 })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
}

// Toggle discount active status
export function useToggleDiscountStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("discounts")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      toast.success(`Discount ${variables.is_active ? "activated" : "deactivated"}`);
    },
    onError: (error) => {
      console.error("Error toggling discount:", error);
      toast.error("Failed to update discount status");
    },
  });
}
