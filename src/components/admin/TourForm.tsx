import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Upload, X, Plus, Loader2, ImageIcon, Sparkles, MapPin, Calendar, Clock, Users, Shield, Flame, RotateCcw, Link as LinkIcon, Waves, PartyPopper, ChefHat, AlertTriangle, Car, Layers } from "lucide-react";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useActiveCategories } from "@/hooks/useCategories";
import { useActiveLocations } from "@/hooks/useLocations";
import ItineraryEditor, { ItineraryItem } from "./ItineraryEditor";
import FAQEditor, { FAQItem } from "./FAQEditor";
import CharacterCounter from "./CharacterCounter";
import SEOPreview from "./SEOPreview";
import KeywordsInput from "./KeywordsInput";
import RichTextEditor from "./RichTextEditor";
import { BookingFeatures, defaultBookingFeatures, defaultCancellationInfo, defaultWhatToBring, defaultGoodToKnow } from "@/lib/tourMapper";
import { generateSeoSlug, getCategoryPath } from "@/lib/seoUtils";
import ImportantInfoEditor from "./ImportantInfoEditor";
import BookingOptionsEditor from "./BookingOptionsEditor";

type Tour = Tables<"tours">;

interface TourFormProps {
  tour?: Tour;
  mode: "create" | "edit";
}

import { useImageUpload } from "@/hooks/useImageUpload";

const TourForm = ({ tour, mode }: TourFormProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const { upload } = useImageUpload({ showToast: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Fetch categories and locations from database
  const { data: categories = [], isLoading: categoriesLoading } = useActiveCategories();
  const { data: locations = [], isLoading: locationsLoading } = useActiveLocations();

  // Form state
  const [formData, setFormData] = useState({
    title: tour?.title || "",
    slug: tour?.slug || "",
    seo_slug: (tour as any)?.seo_slug || "",
    subtitle: tour?.subtitle || "",
    description: tour?.description || "",
    long_description: tour?.long_description || "",
    price: tour?.price?.toString() || "",
    original_price: tour?.original_price?.toString() || "",
    pricing_type: (tour as any)?.pricing_type || "per_person",
    full_yacht_price: (tour as any)?.full_yacht_price?.toString() || "",
    duration: tour?.duration || "",
    capacity: tour?.capacity || "",
    category: tour?.category || "dhow",
    location: tour?.location || "",
    featured: tour?.featured || false,
    status: tour?.status || "active",
    image_url: tour?.image_url || "",
    image_alt: tour?.image_alt || "",
    gallery: tour?.gallery || [],
    highlights: tour?.highlights || [],
    included: tour?.included || [],
    excluded: tour?.excluded || [],
    itinerary: (tour?.itinerary as unknown as ItineraryItem[]) || [],
    faqs: (tour?.faqs as unknown as FAQItem[]) || [],
    meta_title: tour?.meta_title || "",
    meta_description: tour?.meta_description || "",
    meta_keywords: tour?.meta_keywords || [],
    booking_features: ((tour as any)?.booking_features as BookingFeatures) || defaultBookingFeatures,
  });

  // Array field inputs
  const [highlightInput, setHighlightInput] = useState("");
  const [includedInput, setIncludedInput] = useState("");
  const [excludedInput, setExcludedInput] = useState("");
  const [equipmentInput, setEquipmentInput] = useState("");
  const [safetyInput, setSafetyInput] = useState("");
  const [decorationInput, setDecorationInput] = useState("");
  const [cateringInput, setCateringInput] = useState("");

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: mode === "create" ? generateSlug(title) : prev.slug,
    }));
  };



  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    // Use the hook's upload function
    const result = await upload(file);

    if (result?.url) {
      setFormData((prev) => ({ ...prev, image_url: result.url }));
      // Toast handles success message
    }
    setIsUploadingImage(false);
    // Reset input value to allow re-uploading same file if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setIsUploadingGallery(true);
    const uploadedUrls: string[] = [];

    // Process files sequentially to ensure order or handle errors individually
    for (const file of Array.from(files)) {
      const result = await upload(file);
      if (result?.url) {
        uploadedUrls.push(result.url);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...uploadedUrls],
      }));
      toast.success(`${uploadedUrls.length} image(s) appended to gallery`);
    }
    setIsUploadingGallery(false);
    // Reset input
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery?.filter((_, i) => i !== index) || [],
    }));
  };

  const addArrayItem = (
    field: "highlights" | "included" | "excluded",
    value: string,
    setValue: (v: string) => void
  ) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()],
    }));
    setValue("");
  };

  const removeArrayItem = (field: "highlights" | "included" | "excluded", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || [],
    }));
  };

  // SEO auto-suggest functions
  const suggestMetaTitle = () => {
    setFormData((prev) => ({
      ...prev,
      meta_title: prev.title.slice(0, 60),
    }));
  };

  const suggestMetaDescription = () => {
    setFormData((prev) => ({
      ...prev,
      meta_description: (prev.description || "").slice(0, 160),
    }));
  };

  const suggestImageAlt = () => {
    const alt = [formData.title, formData.location].filter(Boolean).join(" - ");
    setFormData((prev) => ({ ...prev, image_alt: alt }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tourData: TablesInsert<"tours"> | TablesUpdate<"tours"> = {
        title: formData.title,
        slug: formData.slug,
        seo_slug: formData.seo_slug || null,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        long_description: formData.long_description || null,
        price: parseFloat(formData.price) || 0,
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        pricing_type: formData.pricing_type,
        full_yacht_price: formData.full_yacht_price ? parseFloat(formData.full_yacht_price) : null,
        duration: formData.duration || null,
        capacity: formData.capacity || null,
        category: formData.category,
        location: formData.location || null,
        featured: formData.featured,
        status: formData.status,
        image_url: formData.image_url || null,
        image_alt: formData.image_alt || null,
        gallery: formData.gallery?.length ? formData.gallery : null,
        highlights: formData.highlights?.length ? formData.highlights : null,
        included: formData.included?.length ? formData.included : null,
        excluded: formData.excluded?.length ? formData.excluded : null,
        itinerary: formData.itinerary?.length ? JSON.parse(JSON.stringify(formData.itinerary)) : null,
        faqs: formData.faqs?.length ? JSON.parse(JSON.stringify(formData.faqs)) : null,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        meta_keywords: formData.meta_keywords?.length ? formData.meta_keywords : null,
        booking_features: JSON.parse(JSON.stringify(formData.booking_features)),
      } as any;

      if (mode === "create") {
        const { error } = await supabase.from("tours").insert(tourData as TablesInsert<"tours">);
        if (error) throw error;
        toast.success("Tour created successfully");
      } else {
        const { error } = await supabase
          .from("tours")
          .update(tourData as TablesUpdate<"tours">)
          .eq("id", tour?.id);
        if (error) throw error;
        toast.success("Tour updated successfully");
      }

      navigate("/admin/tours");
    } catch (error: any) {
      console.error("Error saving tour:", error);
      toast.error(error.message || "Failed to save tour");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Enter tour title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="tour-url-slug"
                    required
                  />
                </div>
              </div>

              {/* SEO-Friendly Slug */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="seo_slug" className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    SEO-Friendly URL Slug
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const seoSlug = generateSeoSlug(formData.title, formData.category, formData.location);
                      setFormData((prev) => ({ ...prev, seo_slug: seoSlug }));
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Auto-generate
                  </Button>
                </div>
                <Input
                  id="seo_slug"
                  value={formData.seo_slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, seo_slug: e.target.value }))}
                  placeholder="e.g., luxury-44ft-yacht-charter-dubai-marina"
                />
                <p className="text-xs text-muted-foreground">
                  SEO-optimized URL: <span className="font-mono text-secondary">/dubai/{getCategoryPath(formData.category)}/{formData.seo_slug || formData.slug}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Brief description"
                />
              </div>

              <RichTextEditor
                id="description"
                label="Short Description"
                value={formData.description}
                onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                placeholder="Compelling summary for tour cards. Use **bold** for key features and *italics* for highlights."
                rows={4}
                helpText="Used on tour cards and search results. Keep it concise and engaging."
                tourTitle={formData.title}
                tourCategory={formData.category}
                tourLocation={formData.location}
                descriptionType="short"
              />

              <RichTextEditor
                id="long_description"
                label="Full Description"
                value={formData.long_description}
                onChange={(value) => setFormData((prev) => ({ ...prev, long_description: value }))}
                placeholder="Create a luxurious, detailed description using the formatting toolbar..."
                rows={12}
                helpText="Displayed on the tour detail page. Use headings, lists, and links to create premium content."
                tourTitle={formData.title}
                tourCategory={formData.category}
                tourLocation={formData.location}
                descriptionType="long"
              />
            </CardContent>
          </Card>

          {/* Pricing & Details */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (AED) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="original_price">Original Price (AED)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, original_price: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pricing Type</Label>
                  <Select
                    value={formData.pricing_type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, pricing_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pricing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per_person">Per Person</SelectItem>
                      <SelectItem value="per_hour">Per Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_yacht_price">Full Yacht Price (AED)</Label>
                  <Input
                    id="full_yacht_price"
                    type="number"
                    value={formData.full_yacht_price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, full_yacht_price: e.target.value }))}
                    placeholder="Leave empty if not available"
                  />
                  <p className="text-xs text-muted-foreground">Private charter price for entire yacht</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 2 hours"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    value={formData.capacity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value }))}
                    placeholder="e.g., Up to 10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  {categoriesLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.slug}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  {locationsLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      value={formData.location}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location">
                          {formData.location && (
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {locations.find((l) => l.name === formData.location)?.name || formData.location}
                            </span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.name}>
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {loc.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Highlights */}
          <Card>
            <CardHeader>
              <CardTitle>Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  placeholder="Add a highlight"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addArrayItem("highlights", highlightInput, setHighlightInput);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem("highlights", highlightInput, setHighlightInput)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.highlights?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("highlights", index)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Included/Excluded */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={includedInput}
                    onChange={(e) => setIncludedInput(e.target.value)}
                    placeholder="Add included item"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addArrayItem("included", includedInput, setIncludedInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("included", includedInput, setIncludedInput)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <ul className="space-y-1">
                  {formData.included?.map((item, index) => (
                    <li key={index} className="flex items-center justify-between text-sm">
                      <span className="text-emerald-600">✓ {item}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem("included", index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's Excluded</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={excludedInput}
                    onChange={(e) => setExcludedInput(e.target.value)}
                    placeholder="Add excluded item"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addArrayItem("excluded", excludedInput, setExcludedInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("excluded", excludedInput, setExcludedInput)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <ul className="space-y-1">
                  {formData.excluded?.map((item, index) => (
                    <li key={index} className="flex items-center justify-between text-sm">
                      <span className="text-destructive">✗ {item}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem("excluded", index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Itinerary */}
          <Card>
            <CardHeader>
              <CardTitle>Itinerary</CardTitle>
            </CardHeader>
            <CardContent>
              <ItineraryEditor
                items={formData.itinerary}
                onChange={(items) => setFormData((prev) => ({ ...prev, itinerary: items }))}
              />
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <FAQEditor
                items={formData.faqs}
                onChange={(items) => setFormData((prev) => ({ ...prev, faqs: items }))}
              />
            </CardContent>
          </Card>

          {/* Booking Options (Guests/Quantity/Add-Ons) */}
          <BookingOptionsEditor
            bookingFeatures={formData.booking_features}
            onChange={(features) => setFormData((prev) => ({ ...prev, booking_features: features }))}
            currentTourId={tour?.id}
          />

          {/* Booking Features */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-secondary" />
                Booking Sidebar Features
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    booking_features: defaultBookingFeatures,
                  }));
                  toast.success("Booking features reset to defaults");
                }}
                className="h-8 gap-2 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Defaults
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Urgency Banner */}
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-destructive" />
                    Urgency Banner
                  </Label>
                  <Switch
                    checked={formData.booking_features.urgency_enabled}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        booking_features: { ...prev.booking_features, urgency_enabled: checked },
                      }))
                    }
                  />
                </div>
                {formData.booking_features.urgency_enabled && (
                  <Input
                    value={formData.booking_features.urgency_text}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        booking_features: { ...prev.booking_features, urgency_text: e.target.value },
                      }))
                    }
                    placeholder="Only few spots left today!"
                  />
                )}
              </div>

              {/* Quick Info Items */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold">Quick Info Items</Label>

                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-secondary shrink-0" />
                    <Input
                      value={formData.booking_features.availability_text}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          booking_features: { ...prev.booking_features, availability_text: e.target.value },
                        }))
                      }
                      placeholder="Available daily"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-secondary shrink-0" />
                    <Input
                      value={formData.booking_features.minimum_duration}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          booking_features: { ...prev.booking_features, minimum_duration: e.target.value },
                        }))
                      }
                      placeholder="Minimum 2 Hours Required"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-secondary shrink-0" />
                        <Label>Hotel Pickup</Label>
                      </div>
                      <Switch
                        checked={formData.booking_features.hotel_pickup}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            booking_features: { ...prev.booking_features, hotel_pickup: checked },
                          }))
                        }
                      />
                    </div>
                    {formData.booking_features.hotel_pickup && (
                      <Input
                        value={formData.booking_features.hotel_pickup_text}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            booking_features: { ...prev.booking_features, hotel_pickup_text: e.target.value },
                          }))
                        }
                        placeholder="Hotel pickup included"
                        className="ml-7"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-secondary shrink-0" />
                    <Input
                      value={formData.booking_features.cancellation_text}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          booking_features: { ...prev.booking_features, cancellation_text: e.target.value },
                        }))
                      }
                      placeholder="Free cancellation (24h)"
                    />
                  </div>
                </div>
              </div>

              {/* Charter Features */}
              <div className="space-y-3 p-4 bg-secondary/5 rounded-lg">
                <Label className="text-sm font-semibold">Private Charter Features</Label>
                <p className="text-xs text-muted-foreground">
                  These appear when "Full Yacht Price" is set (Private Charter mode)
                </p>
                <div className="space-y-2">
                  {formData.booking_features.charter_features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.booking_features.charter_features];
                          newFeatures[index] = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            booking_features: { ...prev.booking_features, charter_features: newFeatures },
                          }));
                        }}
                        placeholder="Feature text"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newFeatures = formData.booking_features.charter_features.filter((_, i) => i !== index);
                          setFormData((prev) => ({
                            ...prev,
                            booking_features: { ...prev.booking_features, charter_features: newFeatures },
                          }));
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        booking_features: {
                          ...prev.booking_features,
                          charter_features: [...prev.booking_features.charter_features, ""],
                        },
                      }));
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </div>

              {/* Travel Options */}
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-secondary" />
                    Enable Travel Type Selection
                  </Label>
                  <Switch
                    checked={formData.booking_features.travel_options_enabled || false}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        booking_features: { ...prev.booking_features, travel_options_enabled: checked },
                      }))
                    }
                  />
                </div>
                {formData.booking_features.travel_options_enabled && (
                  <div className="space-y-1">
                    <Label className="text-xs">Direct To Boat Discount (AED)</Label>
                    <Input
                      type="number"
                      value={formData.booking_features.self_travel_discount || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          booking_features: { ...prev.booking_features, self_travel_discount: parseFloat(e.target.value) || 0 },
                        }))
                      }
                      placeholder="Amount deducted for Self Travelling"
                    />
                    <p className="text-xs text-muted-foreground">Subtracted from total when customer travels on their own</p>
                  </div>
                )}
              </div>

              {/* Transfer Service with Vehicles */}
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-secondary" />
                    Transfer Service Available
                  </Label>
                  <Switch
                    checked={formData.booking_features.transfer_available !== false}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        booking_features: { ...prev.booking_features, transfer_available: checked },
                      }))
                    }
                  />
                </div>
                {formData.booking_features.transfer_available !== false && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Transfer Label</Label>
                      <Input
                        value={formData.booking_features.transfer_label || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            booking_features: { ...prev.booking_features, transfer_label: e.target.value },
                          }))
                        }
                        placeholder="Hotel/Residence Transfer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Transfer Vehicles & Pricing</Label>
                      {(formData.booking_features.transfer_vehicles || []).map((vehicle, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={vehicle.name}
                            onChange={(e) => {
                              const newVehicles = [...(formData.booking_features.transfer_vehicles || [])];
                              newVehicles[index] = { ...newVehicles[index], name: e.target.value };
                              setFormData((prev) => ({
                                ...prev,
                                booking_features: { ...prev.booking_features, transfer_vehicles: newVehicles },
                              }));
                            }}
                            placeholder="e.g. 6-Seater"
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={vehicle.price || ""}
                            onChange={(e) => {
                              const newVehicles = [...(formData.booking_features.transfer_vehicles || [])];
                              newVehicles[index] = { ...newVehicles[index], price: parseFloat(e.target.value) || 0 };
                              setFormData((prev) => ({
                                ...prev,
                                booking_features: { ...prev.booking_features, transfer_vehicles: newVehicles },
                              }));
                            }}
                            placeholder="Price (AED)"
                            className="w-28"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newVehicles = (formData.booking_features.transfer_vehicles || []).filter((_, i) => i !== index);
                              setFormData((prev) => ({
                                ...prev,
                                booking_features: { ...prev.booking_features, transfer_vehicles: newVehicles },
                              }));
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const current = formData.booking_features.transfer_vehicles || [];
                          setFormData((prev) => ({
                            ...prev,
                            booking_features: {
                              ...prev.booking_features,
                              transfer_vehicles: [...current, { name: "", price: 0 }],
                            },
                          }));
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Vehicle
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Upper Deck Option */}
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-secondary" />
                    Has Upper Deck Option
                  </Label>
                  <Switch
                    checked={formData.booking_features.has_upper_deck || false}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        booking_features: { ...prev.booking_features, has_upper_deck: checked },
                      }))
                    }
                  />
                </div>
                {formData.booking_features.has_upper_deck && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Upper Deck Surcharge (AED)</Label>
                      <Input
                        type="number"
                        value={formData.booking_features.upper_deck_surcharge || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            booking_features: { ...prev.booking_features, upper_deck_surcharge: parseFloat(e.target.value) || 0 },
                          }))
                        }
                        placeholder="Extra charge for Upper Deck"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Deck Options</Label>
                      {(formData.booking_features.deck_options || ["Lower Deck", "Upper Deck"]).map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(formData.booking_features.deck_options || ["Lower Deck", "Upper Deck"])];
                              newOptions[index] = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                booking_features: { ...prev.booking_features, deck_options: newOptions },
                              }));
                            }}
                            placeholder="Deck name"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newOptions = (formData.booking_features.deck_options || ["Lower Deck", "Upper Deck"]).filter((_, i) => i !== index);
                              setFormData((prev) => ({
                                ...prev,
                                booking_features: { ...prev.booking_features, deck_options: newOptions },
                              }));
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const current = formData.booking_features.deck_options || ["Lower Deck", "Upper Deck"];
                          setFormData((prev) => ({
                            ...prev,
                            booking_features: {
                              ...prev.booking_features,
                              deck_options: [...current, ""],
                            },
                          }));
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Deck Option
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category-Specific Fields */}
          {formData.category === 'water-activity' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="w-5 h-5 text-secondary" />
                  Water Activity Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Equipment List */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Equipment Provided</Label>
                  <div className="flex gap-2">
                    <Input
                      value={equipmentInput}
                      onChange={(e) => setEquipmentInput(e.target.value)}
                      placeholder="e.g., Life jacket, Helmet, Wetsuit"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (!equipmentInput.trim()) return;
                          setFormData((prev) => ({
                            ...prev,
                            booking_features: {
                              ...prev.booking_features,
                              equipment_list: [...(prev.booking_features.equipment_list || []), equipmentInput.trim()],
                            },
                          }));
                          setEquipmentInput("");
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (!equipmentInput.trim()) return;
                        setFormData((prev) => ({
                          ...prev,
                          booking_features: {
                            ...prev.booking_features,
                            equipment_list: [...(prev.booking_features.equipment_list || []), equipmentInput.trim()],
                          },
                        }));
                        setEquipmentInput("");
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.booking_features.equipment_list || []).map((item, index) => (
                      <div key={index} className="flex items-center gap-1 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
                        {item}
                        <button type="button" onClick={() => {
                          const newList = (formData.booking_features.equipment_list || []).filter((_, i) => i !== index);
                          setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, equipment_list: newList } }));
                        }} className="hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Information */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Safety Information
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={safetyInput}
                      onChange={(e) => setSafetyInput(e.target.value)}
                      placeholder="e.g., Minimum age 12 years, Must know swimming"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (!safetyInput.trim()) return;
                          setFormData((prev) => ({
                            ...prev,
                            booking_features: {
                              ...prev.booking_features,
                              safety_info: [...(prev.booking_features.safety_info || []), safetyInput.trim()],
                            },
                          }));
                          setSafetyInput("");
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (!safetyInput.trim()) return;
                        setFormData((prev) => ({
                          ...prev,
                          booking_features: {
                            ...prev.booking_features,
                            safety_info: [...(prev.booking_features.safety_info || []), safetyInput.trim()],
                          },
                        }));
                        setSafetyInput("");
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.booking_features.safety_info || []).map((item, index) => (
                      <div key={index} className="flex items-center gap-1 bg-amber-500/10 text-amber-700 px-3 py-1 rounded-full text-sm">
                        {item}
                        <button type="button" onClick={() => {
                          const newList = (formData.booking_features.safety_info || []).filter((_, i) => i !== index);
                          setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, safety_info: newList } }));
                        }} className="hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {formData.category === 'yacht-event' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PartyPopper className="w-5 h-5 text-secondary" />
                  Event & Experience Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Decoration Options */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Decoration Options</Label>
                  <div className="flex gap-2">
                    <Input
                      value={decorationInput}
                      onChange={(e) => setDecorationInput(e.target.value)}
                      placeholder="e.g., Balloon setup, Flower arrangements, LED lighting"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (!decorationInput.trim()) return;
                          setFormData((prev) => ({
                            ...prev,
                            booking_features: {
                              ...prev.booking_features,
                              decoration_options: [...(prev.booking_features.decoration_options || []), decorationInput.trim()],
                            },
                          }));
                          setDecorationInput("");
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (!decorationInput.trim()) return;
                        setFormData((prev) => ({
                          ...prev,
                          booking_features: {
                            ...prev.booking_features,
                            decoration_options: [...(prev.booking_features.decoration_options || []), decorationInput.trim()],
                          },
                        }));
                        setDecorationInput("");
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.booking_features.decoration_options || []).map((item, index) => (
                      <div key={index} className="flex items-center gap-1 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
                        {item}
                        <button type="button" onClick={() => {
                          const newList = (formData.booking_features.decoration_options || []).filter((_, i) => i !== index);
                          setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, decoration_options: newList } }));
                        }} className="hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Catering Options */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-secondary" />
                    Catering Options
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={cateringInput}
                      onChange={(e) => setCateringInput(e.target.value)}
                      placeholder="e.g., BBQ buffet, Fine dining, Cocktail package"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (!cateringInput.trim()) return;
                          setFormData((prev) => ({
                            ...prev,
                            booking_features: {
                              ...prev.booking_features,
                              catering_options: [...(prev.booking_features.catering_options || []), cateringInput.trim()],
                            },
                          }));
                          setCateringInput("");
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (!cateringInput.trim()) return;
                        setFormData((prev) => ({
                          ...prev,
                          booking_features: {
                            ...prev.booking_features,
                            catering_options: [...(prev.booking_features.catering_options || []), cateringInput.trim()],
                          },
                        }));
                        setCateringInput("");
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.booking_features.catering_options || []).map((item, index) => (
                      <div key={index} className="flex items-center gap-1 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
                        {item}
                        <button type="button" onClick={() => {
                          const newList = (formData.booking_features.catering_options || []).filter((_, i) => i !== index);
                          setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, catering_options: newList } }));
                        }} className="hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customization Notes */}
                <div className="space-y-2">
                  <Label>Customization Notes</Label>
                  <Textarea
                    value={formData.booking_features.customization_notes || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        booking_features: { ...prev.booking_features, customization_notes: e.target.value },
                      }))
                    }
                    placeholder="Guide customers on how to customize their event (e.g., special themes, custom menus, entertainment requests)"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Important Information Editor */}
          <ImportantInfoEditor
            bookingFeatures={formData.booking_features}
            onChange={(newFeatures) =>
              setFormData((prev) => ({ ...prev, booking_features: newFeatures }))
            }
          />

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Meta Title */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <div className="flex items-center gap-2">
                    <CharacterCounter current={formData.meta_title.length} min={30} max={60} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={suggestMetaTitle}
                      className="h-6 px-2 text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Auto
                    </Button>
                  </div>
                </div>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="SEO optimized title (50-60 characters)"
                  maxLength={70}
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <div className="flex items-center gap-2">
                    <CharacterCounter current={formData.meta_description.length} min={120} max={160} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={suggestMetaDescription}
                      className="h-6 px-2 text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Auto
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="SEO optimized description (150-160 characters)"
                  rows={3}
                  maxLength={200}
                />
              </div>

              {/* Meta Keywords */}
              <div className="space-y-2">
                <Label>Meta Keywords</Label>
                <KeywordsInput
                  keywords={formData.meta_keywords || []}
                  onChange={(keywords) => setFormData((prev) => ({ ...prev, meta_keywords: keywords }))}
                />
              </div>

              {/* Google Preview */}
              <div className="space-y-2">
                <Label>Search Result Preview</Label>
                <SEOPreview
                  title={formData.meta_title || formData.title}
                  description={formData.meta_description || formData.description}
                  slug={formData.slug}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured Tour</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/admin/tours")}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : mode === "create" ? (
                    "Create Tour"
                  ) : (
                    "Update Tour"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Image */}
          <Card>
            <CardHeader>
              <CardTitle>Main Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="hidden"
              />
              {formData.image_url ? (
                <div className="relative group">
                  <img
                    src={formData.image_url}
                    alt={formData.image_alt || "Tour main image"}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setFormData((prev) => ({ ...prev, image_url: "", image_alt: "" }))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-secondary transition-colors"
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Click to upload</span>
                    </>
                  )}
                </button>
              )}

              {/* Image Alt Text */}
              {formData.image_url && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="image_alt">Alt Text (SEO)</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={suggestImageAlt}
                      className="h-6 px-2 text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Auto
                    </Button>
                  </div>
                  <Input
                    id="image_alt"
                    value={formData.image_alt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image_alt: e.target.value }))}
                    placeholder="Describe the image for accessibility"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>Gallery Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
              />
              <div className="grid grid-cols-2 gap-2">
                {formData.gallery?.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-secondary transition-colors"
                  disabled={isUploadingGallery}
                >
                  {isUploadingGallery ? (
                    <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default TourForm;
