import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmailTemplate {
  id: string;
  template_key: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string | null;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type EmailTemplateUpdate = Partial<
  Pick<EmailTemplate, "name" | "subject" | "body_html" | "body_text" | "is_active">
>;

// Fetch all email templates
export function useEmailTemplates() {
  return useQuery({
    queryKey: ["email-templates"],
    queryFn: async (): Promise<EmailTemplate[]> => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .order("template_key");

      if (error) throw error;
      return (data || []) as EmailTemplate[];
    },
  });
}

// Fetch a specific template by key
export function useEmailTemplate(templateKey: string) {
  return useQuery({
    queryKey: ["email-templates", templateKey],
    queryFn: async (): Promise<EmailTemplate | null> => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .eq("template_key", templateKey)
        .maybeSingle();

      if (error) throw error;
      return data as EmailTemplate | null;
    },
    enabled: !!templateKey,
  });
}

// Update email template
export function useUpdateEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...update
    }: EmailTemplateUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("email_templates")
        .update(update)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      toast.success("Email template saved successfully");
    },
    onError: (error) => {
      console.error("Error updating template:", error);
      toast.error("Failed to save email template");
    },
  });
}

// Toggle template active status
export function useToggleEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("email_templates")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      toast.success(`Template ${variables.is_active ? "enabled" : "disabled"}`);
    },
    onError: (error) => {
      console.error("Error toggling template:", error);
      toast.error("Failed to update template status");
    },
  });
}

// Render template with variables
export function renderTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let rendered = template;
  Object.entries(variables).forEach(([key, value]) => {
    rendered = rendered.replace(new RegExp(`{{${key}}}`, "g"), value);
  });
  return rendered;
}
