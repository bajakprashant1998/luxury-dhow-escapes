import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { withTimeout } from "@/lib/withTimeout";

export interface CannedResponse {
  id: string;
  title: string;
  content: string;
  category: string;
  shortcut: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function useCannedResponses() {
  const [responses, setResponses] = useState<CannedResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchResponses = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await withTimeout(
        supabase
          .from("canned_responses")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        5000,
        "Failed to load canned responses"
      );

      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error("Error fetching canned responses:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createResponse = useCallback(
    async (response: Omit<CannedResponse, "id" | "created_at" | "updated_at">) => {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from("canned_responses")
            .insert(response)
            .select()
            .single(),
          5000,
          "Failed to create canned response"
        );

        if (error) throw error;

        setResponses((prev) => [...prev, data]);
        toast({ title: "Success", description: "Canned response created." });
        return data;
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to create response.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [toast]
  );

  const updateResponse = useCallback(
    async (id: string, updates: Partial<CannedResponse>) => {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from("canned_responses")
            .update(updates)
            .eq("id", id)
            .select()
            .single(),
          5000,
          "Failed to update canned response"
        );

        if (error) throw error;

        setResponses((prev) => prev.map((r) => (r.id === id ? data : r)));
        toast({ title: "Success", description: "Canned response updated." });
        return data;
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to update response.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [toast]
  );

  const deleteResponse = useCallback(
    async (id: string) => {
      try {
        const { error } = await withTimeout(
          supabase
            .from("canned_responses")
            .delete()
            .eq("id", id),
          5000,
          "Failed to delete canned response"
        );

        if (error) throw error;

        setResponses((prev) => prev.filter((r) => r.id !== id));
        toast({ title: "Success", description: "Canned response deleted." });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete response.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [toast]
  );

  const getByShortcut = useCallback(
    (shortcut: string) => {
      return responses.find((r) => r.shortcut === shortcut);
    },
    [responses]
  );

  const getCategories = useCallback(() => {
    return [...new Set(responses.map((r) => r.category))];
  }, [responses]);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  return {
    responses,
    isLoading,
    createResponse,
    updateResponse,
    deleteResponse,
    getByShortcut,
    getCategories,
    refresh: fetchResponses,
  };
}
