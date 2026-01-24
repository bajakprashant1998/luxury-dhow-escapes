import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SiteSettingsValue {
  [key: string]: string | number | boolean | null;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: SiteSettingsValue;
  updated_at: string;
}

// Fetch all site settings
export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async (): Promise<SiteSetting[]> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .order("key");

      if (error) throw error;
      return (data || []) as SiteSetting[];
    },
  });
}

// Fetch a specific setting by key
export function useSiteSetting(key: string) {
  return useQuery({
    queryKey: ["site-settings", key],
    queryFn: async (): Promise<SiteSettingsValue | null> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", key)
        .maybeSingle();

      if (error) throw error;
      return data ? (data.value as SiteSettingsValue) : null;
    },
    enabled: !!key,
  });
}

// Upsert a setting
export function useUpdateSiteSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      key,
      value,
    }: {
      key: string;
      value: SiteSettingsValue;
    }) => {
      const { data, error } = await supabase
        .from("site_settings")
        .upsert({ key, value }, { onConflict: "key" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings", variables.key] });
    },
    onError: (error) => {
      console.error("Error updating setting:", error);
      toast.error("Failed to save setting");
    },
  });
}

// Batch update multiple settings
export function useBatchUpdateSiteSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: { key: string; value: SiteSettingsValue }[]) => {
      const { data, error } = await supabase
        .from("site_settings")
        .upsert(settings, { onConflict: "key" })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Settings saved successfully");
    },
    onError: (error) => {
      console.error("Error updating settings:", error);
      toast.error("Failed to save settings");
    },
  });
}

// Helper to get settings as a typed object
export function useSettingsObject<T extends Record<string, SiteSettingsValue>>(
  keys: string[]
): { data: Partial<T>; isLoading: boolean } {
  const { data: settings, isLoading } = useSiteSettings();

  const settingsObject: Partial<T> = {};
  if (settings) {
    keys.forEach((key) => {
      const setting = settings.find((s) => s.key === key);
      if (setting) {
        settingsObject[key as keyof T] = setting.value as T[keyof T];
      }
    });
  }

  return { data: settingsObject, isLoading };
}
