import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Globe, Home, Mail, FileText, Loader2 } from "lucide-react";
import {
  useSiteSettings,
  useBatchUpdateSiteSettings,
  SiteSettingsValue,
} from "@/hooks/useSiteSettings";
import {
  useEmailTemplates,
  useUpdateEmailTemplate,
  useToggleEmailTemplate,
} from "@/hooks/useEmailTemplates";
import EmailTemplateEditor from "@/components/admin/EmailTemplateEditor";

type SettingsTab = "site" | "homepage" | "footer" | "email";

const VALID_TABS: SettingsTab[] = ["site", "homepage", "footer", "email"];

function getTabFromPath(pathname: string): SettingsTab {
  const parts = pathname.split("/").filter(Boolean);
  const settingsIndex = parts.indexOf("settings");
  const candidate = settingsIndex >= 0 ? parts[settingsIndex + 1] : undefined;

  if (candidate && (VALID_TABS as string[]).includes(candidate)) {
    return candidate as SettingsTab;
  }
  return "site";
}

// Default values for settings
const DEFAULT_SITE = {
  siteName: "BetterView Tourism",
  siteDescription: "Premium Dhow Cruise & Yacht Experiences in Dubai",
  contactEmail: "info@betterviewtourism.com",
  contactPhone: "+971 50 123 4567",
  whatsappNumber: "+971501234567",
  address: "Dubai Marina, Dubai, UAE",
};

const DEFAULT_HOMEPAGE = {
  heroTitle: "Experience Dubai's Finest Dhow Cruises",
  heroSubtitle: "Luxury yacht experiences in the heart of Dubai Marina",
  featuredToursCount: "6",
};

const DEFAULT_FOOTER = {
  copyrightText: "© 2024 BetterView Tourism. All rights reserved.",
  facebookUrl: "https://facebook.com/betterviewtourism",
  instagramUrl: "https://instagram.com/betterviewtourism",
  twitterUrl: "https://twitter.com/betterviewtour",
};

const AdminSettings = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch settings from database
  const { data: allSettings, isLoading: isLoadingSettings } = useSiteSettings();
  const batchUpdate = useBatchUpdateSiteSettings();

  // Email templates
  const { data: emailTemplates = [], isLoading: isLoadingTemplates } = useEmailTemplates();
  const updateTemplate = useUpdateEmailTemplate();
  const toggleTemplate = useToggleEmailTemplate();

  // Local state for form editing
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SITE);
  const [homepageSettings, setHomepageSettings] = useState(DEFAULT_HOMEPAGE);
  const [footerSettings, setFooterSettings] = useState(DEFAULT_FOOTER);

  const tabFromUrl = useMemo(() => getTabFromPath(location.pathname), [location.pathname]);
  const [activeTab, setActiveTab] = useState<SettingsTab>(tabFromUrl);

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  // Load settings from database when data arrives
  useEffect(() => {
    if (allSettings) {
      const siteData = allSettings.find((s) => s.key === "site");
      const homepageData = allSettings.find((s) => s.key === "homepage");
      const footerData = allSettings.find((s) => s.key === "footer");

      if (siteData?.value) {
        setSiteSettings({ ...DEFAULT_SITE, ...(siteData.value as typeof DEFAULT_SITE) });
      }
      if (homepageData?.value) {
        setHomepageSettings({ ...DEFAULT_HOMEPAGE, ...(homepageData.value as typeof DEFAULT_HOMEPAGE) });
      }
      if (footerData?.value) {
        setFooterSettings({ ...DEFAULT_FOOTER, ...(footerData.value as typeof DEFAULT_FOOTER) });
      }
    }
  }, [allSettings]);

  const handleSaveSiteSettings = async () => {
    batchUpdate.mutate([{ key: "site", value: siteSettings as unknown as SiteSettingsValue }]);
  };

  const handleSaveHomepageSettings = async () => {
    batchUpdate.mutate([{ key: "homepage", value: homepageSettings as unknown as SiteSettingsValue }]);
  };

  const handleSaveFooterSettings = async () => {
    batchUpdate.mutate([{ key: "footer", value: footerSettings as unknown as SiteSettingsValue }]);
  };

  const isLoading = batchUpdate.isPending;

  if (isLoadingSettings) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Configure your website settings and preferences
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            const next = (VALID_TABS as string[]).includes(value) ? (value as SettingsTab) : "site";
            setActiveTab(next);
            navigate(`/admin/settings/${next}`);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="site" className="gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Site</span>
            </TabsTrigger>
            <TabsTrigger value="homepage" className="gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Homepage</span>
            </TabsTrigger>
            <TabsTrigger value="footer" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Footer</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
          </TabsList>

          {/* Site Settings */}
          <TabsContent value="site">
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  General Settings
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={siteSettings.siteName}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, siteName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={siteSettings.contactEmail}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, contactEmail: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={siteSettings.contactPhone}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, contactPhone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Input
                      id="whatsappNumber"
                      value={siteSettings.whatsappNumber}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea
                      id="siteDescription"
                      value={siteSettings.siteDescription}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, siteDescription: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={siteSettings.address}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, address: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveSiteSettings} disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Homepage Settings */}
          <TabsContent value="homepage">
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Homepage Content
                </h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heroTitle">Hero Title</Label>
                    <Input
                      id="heroTitle"
                      value={homepageSettings.heroTitle}
                      onChange={(e) =>
                        setHomepageSettings({ ...homepageSettings, heroTitle: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                    <Textarea
                      id="heroSubtitle"
                      value={homepageSettings.heroSubtitle}
                      onChange={(e) =>
                        setHomepageSettings({ ...homepageSettings, heroSubtitle: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="featuredToursCount">Featured Tours Count</Label>
                    <Input
                      id="featuredToursCount"
                      type="number"
                      value={homepageSettings.featuredToursCount}
                      onChange={(e) =>
                        setHomepageSettings({
                          ...homepageSettings,
                          featuredToursCount: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveHomepageSettings} disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Footer Settings */}
          <TabsContent value="footer">
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Footer Content
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="copyrightText">Copyright Text</Label>
                    <Input
                      id="copyrightText"
                      value={footerSettings.copyrightText}
                      onChange={(e) =>
                        setFooterSettings({ ...footerSettings, copyrightText: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebookUrl">Facebook URL</Label>
                    <Input
                      id="facebookUrl"
                      value={footerSettings.facebookUrl}
                      onChange={(e) =>
                        setFooterSettings({ ...footerSettings, facebookUrl: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagramUrl">Instagram URL</Label>
                    <Input
                      id="instagramUrl"
                      value={footerSettings.instagramUrl}
                      onChange={(e) =>
                        setFooterSettings({ ...footerSettings, instagramUrl: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitterUrl">Twitter URL</Label>
                    <Input
                      id="twitterUrl"
                      value={footerSettings.twitterUrl}
                      onChange={(e) =>
                        setFooterSettings({ ...footerSettings, twitterUrl: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveFooterSettings} disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email">
            {isLoadingTemplates ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <EmailTemplateEditor
                templates={emailTemplates}
                onSave={(id, data) => updateTemplate.mutate({ id, ...data })}
                onToggle={(id, is_active) => toggleTemplate.mutate({ id, is_active })}
                isSaving={updateTemplate.isPending}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
