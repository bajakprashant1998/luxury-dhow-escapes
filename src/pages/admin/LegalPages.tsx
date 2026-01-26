import { useState } from "react";
import { useForm } from "react-hook-form";
import { Shield, Scale, XCircle, Save, Eye } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSiteSetting, useUpdateSiteSetting, SiteSettingsValue } from "@/hooks/useSiteSettings";

interface LegalFormData {
  lastUpdated: string;
  contactEmail: string;
}

const LegalPages = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("privacy");

  const { data: privacyData, isLoading: privacyLoading } = useSiteSetting("legal_privacy");
  const { data: termsData, isLoading: termsLoading } = useSiteSetting("legal_terms");
  const { data: cancellationData, isLoading: cancellationLoading } = useSiteSetting("legal_cancellation");

  const updateSetting = useUpdateSiteSetting();

  const privacyContent = privacyData || { lastUpdated: "January 2026", contactEmail: "privacy@rentalyachtdubai.com" };
  const termsContent = termsData || { lastUpdated: "January 2026", contactEmail: "legal@rentalyachtdubai.com" };
  const cancellationContent = cancellationData || { lastUpdated: "January 2026", contactEmail: "bookings@rentalyachtdubai.com" };

  const { register: registerPrivacy, handleSubmit: handlePrivacy } = useForm<LegalFormData>({
    defaultValues: {
      lastUpdated: (privacyContent.lastUpdated as string) || "January 2026",
      contactEmail: (privacyContent.contactEmail as string) || "privacy@rentalyachtdubai.com",
    },
  });

  const { register: registerTerms, handleSubmit: handleTerms } = useForm<LegalFormData>({
    defaultValues: {
      lastUpdated: (termsContent.lastUpdated as string) || "January 2026",
      contactEmail: (termsContent.contactEmail as string) || "legal@rentalyachtdubai.com",
    },
  });

  const { register: registerCancellation, handleSubmit: handleCancellation } = useForm<LegalFormData>({
    defaultValues: {
      lastUpdated: (cancellationContent.lastUpdated as string) || "January 2026",
      contactEmail: (cancellationContent.contactEmail as string) || "bookings@rentalyachtdubai.com",
    },
  });

  const onSavePrivacy = async (data: LegalFormData) => {
    await updateSetting.mutateAsync({
      key: "legal_privacy",
      value: { ...privacyContent, ...data } as SiteSettingsValue,
    });
    toast({
      title: "Privacy Policy Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const onSaveTerms = async (data: LegalFormData) => {
    await updateSetting.mutateAsync({
      key: "legal_terms",
      value: { ...termsContent, ...data } as SiteSettingsValue,
    });
    toast({
      title: "Terms of Service Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const onSaveCancellation = async (data: LegalFormData) => {
    await updateSetting.mutateAsync({
      key: "legal_cancellation",
      value: { ...cancellationContent, ...data } as SiteSettingsValue,
    });
    toast({
      title: "Cancellation Policy Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const isLoading = privacyLoading || termsLoading || cancellationLoading;

  const pages = [
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: Shield,
      description: "Manage your privacy policy content",
      previewUrl: "/privacy-policy",
      form: registerPrivacy,
      onSubmit: handlePrivacy(onSavePrivacy),
    },
    {
      id: "terms",
      title: "Terms of Service",
      icon: Scale,
      description: "Manage your terms of service content",
      previewUrl: "/terms-of-service",
      form: registerTerms,
      onSubmit: handleTerms(onSaveTerms),
    },
    {
      id: "cancellation",
      title: "Cancellation Policy",
      icon: XCircle,
      description: "Manage your cancellation policy content",
      previewUrl: "/cancellation-policy",
      form: registerCancellation,
      onSubmit: handleCancellation(onSaveCancellation),
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Legal Pages
          </h1>
          <p className="text-muted-foreground">
            Manage Privacy Policy, Terms of Service, and Cancellation Policy
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            {pages.map((page) => (
              <TabsTrigger
                key={page.id}
                value={page.id}
                className="flex items-center gap-2"
              >
                <page.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{page.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {pages.map((page) => (
            <TabsContent key={page.id} value={page.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <page.icon className="w-5 h-5 text-secondary" />
                        {page.title}
                      </CardTitle>
                      <CardDescription>{page.description}</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(page.previewUrl, "_blank")}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={page.onSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`${page.id}-lastUpdated`}>
                          Last Updated Date
                        </Label>
                        <Input
                          id={`${page.id}-lastUpdated`}
                          placeholder="e.g., January 2026"
                          {...page.form("lastUpdated")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${page.id}-contactEmail`}>
                          Contact Email
                        </Label>
                        <Input
                          id={`${page.id}-contactEmail`}
                          type="email"
                          placeholder="e.g., legal@company.com"
                          {...page.form("contactEmail")}
                        />
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> The main content sections for this page are pre-configured. 
                        To make more detailed changes to the policy content, please contact your development team.
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={updateSetting.isPending}>
                        <Save className="w-4 h-4 mr-2" />
                        {updateSetting.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default LegalPages;
