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
import { Upload, X, Plus, Loader2, ImageIcon, Sparkles, MapPin } from "lucide-react";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useActiveCategories } from "@/hooks/useCategories";
import { useActiveLocations } from "@/hooks/useLocations";
import ItineraryEditor, { ItineraryItem } from "./ItineraryEditor";
import FAQEditor, { FAQItem } from "./FAQEditor";
import CharacterCounter from "./CharacterCounter";
import SEOPreview from "./SEOPreview";
import KeywordsInput from "./KeywordsInput";

type Tour = Tables<"tours">;

interface TourFormProps {
  tour?: Tour;
  mode: "create" | "edit";
}

const TourForm = ({ tour, mode }: TourFormProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
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
  });

  // Array field inputs
  const [highlightInput, setHighlightInput] = useState("");
  const [includedInput, setIncludedInput] = useState("");
  const [excludedInput, setExcludedInput] = useState("");

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

  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("tour-images")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Failed to upload image");
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("tour-images")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const url = await uploadImage(file, "main");
    if (url) {
      setFormData((prev) => ({ ...prev, image_url: url }));
      toast.success("Image uploaded successfully");
    }
    setIsUploadingImage(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setIsUploadingGallery(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const url = await uploadImage(file, "gallery");
      if (url) {
        uploadedUrls.push(url);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...uploadedUrls],
      }));
      toast.success(`${uploadedUrls.length} image(s) uploaded`);
    }
    setIsUploadingGallery(false);
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
      };

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

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Brief description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Short description for cards"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="long_description">Full Description</Label>
                <Textarea
                  id="long_description"
                  value={formData.long_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, long_description: e.target.value }))}
                  placeholder="Detailed tour description"
                  rows={6}
                />
              </div>
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
