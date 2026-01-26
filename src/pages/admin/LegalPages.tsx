import { useState, useEffect } from "react";
import { Shield, Scale, XCircle, Save, Eye, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSiteSetting, useUpdateSiteSetting, SiteSettingsValue } from "@/hooks/useSiteSettings";
import LegalSectionEditor, { LegalSection } from "@/components/admin/LegalSectionEditor";
import RefundTiersEditor, { RefundTier } from "@/components/admin/RefundTiersEditor";

// Default content for each page
const defaultPrivacySections: LegalSection[] = [
  {
    icon: "FileText",
    title: "Information We Collect",
    content: [
      "Personal identification information (Name, email address, phone number)",
      "Booking and transaction details",
      "Payment information (processed securely through our payment partners)",
      "Communication preferences and correspondence",
      "Device and browser information for website optimization",
    ],
  },
  {
    icon: "Eye",
    title: "How We Use Your Information",
    content: [
      "To process and confirm your bookings",
      "To communicate with you about your reservations",
      "To send promotional offers (with your consent)",
      "To improve our services and website experience",
      "To comply with legal obligations",
    ],
  },
  {
    icon: "Lock",
    title: "Data Protection",
    content: [
      "All data is encrypted using industry-standard SSL technology",
      "Payment information is processed through PCI-compliant partners",
      "Access to personal data is restricted to authorized personnel only",
      "Regular security audits and updates are conducted",
      "Data is stored on secure servers with backup systems",
    ],
  },
  {
    icon: "Users",
    title: "Data Sharing",
    content: [
      "We do not sell your personal information to third parties",
      "Data may be shared with service providers essential to your booking",
      "Legal requirements may necessitate disclosure to authorities",
      "Partners are bound by strict confidentiality agreements",
    ],
  },
  {
    icon: "Globe",
    title: "Cookies & Tracking",
    content: [
      "We use cookies to enhance your browsing experience",
      "Analytics cookies help us understand website usage",
      "You can manage cookie preferences in your browser settings",
      "Third-party cookies may be used for marketing purposes",
    ],
  },
];

const defaultTermsSections: LegalSection[] = [
  {
    icon: "FileCheck",
    title: "Acceptance of Terms",
    content: [
      "By accessing and using our services, you agree to be bound by these Terms of Service.",
      "These terms apply to all visitors, users, and customers of our services.",
      "If you disagree with any part of these terms, you may not use our services.",
      "We reserve the right to update these terms at any time with notice.",
    ],
  },
  {
    icon: "Anchor",
    title: "Booking & Reservations",
    content: [
      "All bookings are subject to availability and confirmation.",
      "Accurate personal information must be provided during booking.",
      "Booking confirmation will be sent via email within 24 hours.",
      "Group bookings may require additional verification.",
      "Special requests are subject to availability and cannot be guaranteed.",
    ],
  },
  {
    icon: "CreditCard",
    title: "Payment Terms",
    content: [
      "Full payment is required at the time of booking unless otherwise specified.",
      "We accept major credit cards, debit cards, and bank transfers.",
      "Prices are quoted in AED and include applicable taxes.",
      "Additional services requested on board will be charged separately.",
      "Payment information is processed securely through our payment partners.",
    ],
  },
  {
    icon: "Clock",
    title: "Service Delivery",
    content: [
      "Guests should arrive at the departure point 15 minutes before scheduled time.",
      "Late arrivals may result in reduced cruise time without refund.",
      "The captain reserves the right to modify routes due to weather or safety concerns.",
      "All cruises are subject to weather conditions; alternative dates will be offered if cancelled.",
    ],
  },
  {
    icon: "AlertTriangle",
    title: "Guest Responsibilities",
    content: [
      "Guests must follow all safety instructions provided by the crew.",
      "Consumption of outside alcohol may be subject to corkage fees.",
      "Guests are responsible for any damage caused to the vessel or equipment.",
      "Inappropriate behavior may result in immediate termination of the cruise.",
      "Children must be supervised by adults at all times.",
    ],
  },
  {
    icon: "Scale",
    title: "Liability & Insurance",
    content: [
      "We maintain comprehensive marine insurance for all vessels.",
      "Personal belongings are the responsibility of guests.",
      "We are not liable for injuries resulting from guest negligence.",
      "Force majeure events are beyond our control and liability.",
      "Medical conditions should be disclosed at the time of booking.",
    ],
  },
];

const defaultCancellationSections: LegalSection[] = [
  {
    icon: "Calendar",
    title: "Standard Cancellation",
    content: [
      "Cancellations must be submitted in writing via email or through your booking account.",
      "The cancellation date is determined by when we receive your request.",
      "Refunds will be processed within 7-10 business days.",
      "Refunds will be issued to the original payment method.",
    ],
  },
  {
    icon: "RefreshCw",
    title: "Rescheduling Policy",
    content: [
      "Free rescheduling is available up to 24 hours before your booking.",
      "Rescheduled bookings are subject to availability.",
      "Each booking can be rescheduled a maximum of two times.",
      "Rescheduled bookings must be used within 6 months of original date.",
    ],
  },
  {
    icon: "CloudRain",
    title: "Weather-Related Cancellations",
    content: [
      "If we cancel due to unsafe weather conditions, you will receive a full refund or free rescheduling.",
      "Weather decisions are made by our experienced captains for your safety.",
      "Light rain or overcast skies generally do not qualify for weather cancellations.",
      "We will notify you at least 2 hours before departure if weather cancellation is necessary.",
    ],
  },
  {
    icon: "AlertCircle",
    title: "No-Show Policy",
    content: [
      "Failure to arrive at the departure point results in a full charge.",
      "No refund will be provided for no-shows.",
      "Please arrive 15 minutes before your scheduled departure time.",
      "Contact us immediately if you're running late—we may be able to accommodate.",
    ],
  },
  {
    icon: "CheckCircle",
    title: "Special Circumstances",
    content: [
      "Medical emergencies with documentation may qualify for special consideration.",
      "Flight cancellations with proof may be eligible for full refund.",
      "Group bookings may have different cancellation terms.",
      "Holiday and peak season bookings may have stricter policies.",
    ],
  },
];

const defaultRefundTiers: RefundTier[] = [
  { timeframe: "48+ hours before", refund: "100%", description: "Full refund", color: "bg-green-500" },
  { timeframe: "24-48 hours before", refund: "50%", description: "Half refund", color: "bg-yellow-500" },
  { timeframe: "Less than 24 hours", refund: "0%", description: "No refund", color: "bg-red-500" },
];

const LegalPages = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("privacy");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch data
  const { data: privacyData, isLoading: privacyLoading } = useSiteSetting("legal_privacy");
  const { data: termsData, isLoading: termsLoading } = useSiteSetting("legal_terms");
  const { data: cancellationData, isLoading: cancellationLoading } = useSiteSetting("legal_cancellation");
  const updateSetting = useUpdateSiteSetting();

  // Local state for form data
  const [privacyForm, setPrivacyForm] = useState({
    lastUpdated: "January 2026",
    contactEmail: "privacy@rentalyachtdubai.com",
    heroDescription: "Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.",
    sections: defaultPrivacySections,
  });

  const [termsForm, setTermsForm] = useState({
    lastUpdated: "January 2026",
    contactEmail: "legal@rentalyachtdubai.com",
    heroDescription: "Please read these terms carefully before using our services. By booking with us, you agree to these terms.",
    sections: defaultTermsSections,
  });

  const [cancellationForm, setCancellationForm] = useState({
    lastUpdated: "January 2026",
    contactEmail: "bookings@rentalyachtdubai.com",
    heroDescription: "We understand plans change. Here's everything you need to know about cancellations and refunds.",
    refundTiers: defaultRefundTiers,
    sections: defaultCancellationSections,
  });

  // Hydrate from database
  useEffect(() => {
    if (privacyData) {
      setPrivacyForm({
        lastUpdated: (privacyData.lastUpdated as string) || privacyForm.lastUpdated,
        contactEmail: (privacyData.contactEmail as string) || privacyForm.contactEmail,
        heroDescription: (privacyData.heroDescription as string) || privacyForm.heroDescription,
        sections: (privacyData.sections as unknown as LegalSection[]) || privacyForm.sections,
      });
    }
  }, [privacyData]);

  useEffect(() => {
    if (termsData) {
      setTermsForm({
        lastUpdated: (termsData.lastUpdated as string) || termsForm.lastUpdated,
        contactEmail: (termsData.contactEmail as string) || termsForm.contactEmail,
        heroDescription: (termsData.heroDescription as string) || termsForm.heroDescription,
        sections: (termsData.sections as unknown as LegalSection[]) || termsForm.sections,
      });
    }
  }, [termsData]);

  useEffect(() => {
    if (cancellationData) {
      setCancellationForm({
        lastUpdated: (cancellationData.lastUpdated as string) || cancellationForm.lastUpdated,
        contactEmail: (cancellationData.contactEmail as string) || cancellationForm.contactEmail,
        heroDescription: (cancellationData.heroDescription as string) || cancellationForm.heroDescription,
        refundTiers: (cancellationData.refundTiers as unknown as RefundTier[]) || cancellationForm.refundTiers,
        sections: (cancellationData.sections as unknown as LegalSection[]) || cancellationForm.sections,
      });
    }
  }, [cancellationData]);

  const handleSave = async (type: "privacy" | "terms" | "cancellation") => {
    setIsSaving(true);
    try {
      let key: string;
      let value: SiteSettingsValue;

      switch (type) {
        case "privacy":
          key = "legal_privacy";
          value = privacyForm as unknown as SiteSettingsValue;
          break;
        case "terms":
          key = "legal_terms";
          value = termsForm as unknown as SiteSettingsValue;
          break;
        case "cancellation":
          key = "legal_cancellation";
          value = cancellationForm as unknown as SiteSettingsValue;
          break;
      }

      await updateSetting.mutateAsync({ key, value });
      toast({
        title: "Changes Saved",
        description: "Your legal page content has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = privacyLoading || termsLoading || cancellationLoading;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
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
            Manage Privacy Policy, Terms of Service, and Cancellation Policy content
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Privacy Policy</span>
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">Terms of Service</span>
            </TabsTrigger>
            <TabsTrigger value="cancellation" className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Cancellation</span>
            </TabsTrigger>
          </TabsList>

          {/* Privacy Policy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-secondary" />
                      Privacy Policy
                    </CardTitle>
                    <CardDescription>Edit all content for the Privacy Policy page</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("/privacy-policy", "_blank")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Last Updated Date</Label>
                    <Input
                      value={privacyForm.lastUpdated}
                      onChange={(e) => setPrivacyForm({ ...privacyForm, lastUpdated: e.target.value })}
                      placeholder="e.g., January 2026"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input
                      type="email"
                      value={privacyForm.contactEmail}
                      onChange={(e) => setPrivacyForm({ ...privacyForm, contactEmail: e.target.value })}
                      placeholder="e.g., privacy@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Hero Description</Label>
                  <Textarea
                    value={privacyForm.heroDescription}
                    onChange={(e) => setPrivacyForm({ ...privacyForm, heroDescription: e.target.value })}
                    placeholder="Brief introduction shown in the hero section"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Content Sections</Label>
                  <LegalSectionEditor
                    sections={privacyForm.sections}
                    onChange={(sections) => setPrivacyForm({ ...privacyForm, sections })}
                  />
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleSave("privacy")} disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Terms of Service Tab */}
          <TabsContent value="terms">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-secondary" />
                      Terms of Service
                    </CardTitle>
                    <CardDescription>Edit all content for the Terms of Service page</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("/terms-of-service", "_blank")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Effective Date</Label>
                    <Input
                      value={termsForm.lastUpdated}
                      onChange={(e) => setTermsForm({ ...termsForm, lastUpdated: e.target.value })}
                      placeholder="e.g., January 2026"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input
                      type="email"
                      value={termsForm.contactEmail}
                      onChange={(e) => setTermsForm({ ...termsForm, contactEmail: e.target.value })}
                      placeholder="e.g., legal@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Hero Description</Label>
                  <Textarea
                    value={termsForm.heroDescription}
                    onChange={(e) => setTermsForm({ ...termsForm, heroDescription: e.target.value })}
                    placeholder="Brief introduction shown in the hero section"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Content Sections</Label>
                  <LegalSectionEditor
                    sections={termsForm.sections}
                    onChange={(sections) => setTermsForm({ ...termsForm, sections })}
                  />
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleSave("terms")} disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cancellation Policy Tab */}
          <TabsContent value="cancellation">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-secondary" />
                      Cancellation Policy
                    </CardTitle>
                    <CardDescription>Edit all content for the Cancellation Policy page</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("/cancellation-policy", "_blank")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Last Updated Date</Label>
                    <Input
                      value={cancellationForm.lastUpdated}
                      onChange={(e) => setCancellationForm({ ...cancellationForm, lastUpdated: e.target.value })}
                      placeholder="e.g., January 2026"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input
                      type="email"
                      value={cancellationForm.contactEmail}
                      onChange={(e) => setCancellationForm({ ...cancellationForm, contactEmail: e.target.value })}
                      placeholder="e.g., bookings@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Hero Description</Label>
                  <Textarea
                    value={cancellationForm.heroDescription}
                    onChange={(e) => setCancellationForm({ ...cancellationForm, heroDescription: e.target.value })}
                    placeholder="Brief introduction shown in the hero section"
                    rows={3}
                  />
                </div>

                <RefundTiersEditor
                  tiers={cancellationForm.refundTiers}
                  onChange={(refundTiers) => setCancellationForm({ ...cancellationForm, refundTiers })}
                />

                <div className="space-y-2">
                  <Label className="text-base font-medium">Content Sections</Label>
                  <LegalSectionEditor
                    sections={cancellationForm.sections}
                    onChange={(sections) => setCancellationForm({ ...cancellationForm, sections })}
                  />
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleSave("cancellation")} disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Credit */}
        <div className="pt-6 border-t border-border/50">
          <p className="text-center text-sm text-muted-foreground">
            Created and maintained by{" "}
            <a
              href="https://www.dibull.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-secondary/80 transition-colors font-medium"
            >
              Dibull
            </a>
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LegalPages;
