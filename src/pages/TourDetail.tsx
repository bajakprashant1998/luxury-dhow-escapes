import { useState, useEffect, lazy, Suspense } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, MapPin, Check, X, ChevronRight, Heart, Share2, Anchor, Utensils, Music, Camera, Shield, AlertTriangle, Sparkles, ChefHat, Info, Waves, PartyPopper, Users, Circle, Car, Layers, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import TourCard from "@/components/TourCard";
import ImageGallery from "@/components/tour-detail/ImageGallery";
import TrustBadges from "@/components/tour-detail/TrustBadges";
import QuickInfoCards from "@/components/tour-detail/QuickInfoCards";
import MobileBookingBar from "@/components/tour-detail/MobileBookingBar";
import BookingModal from "@/components/tour-detail/BookingModal";
import { useTour, useRelatedTours } from "@/hooks/useTours";
import { getTourUrl, getCategoryFromPath } from "@/lib/seoUtils";
import PageMeta from "@/components/PageMeta";
import { renderMarkdown } from "@/lib/markdownRenderer";

// Lazy load below-fold components for better initial load
const BookingSidebar = lazy(() => import("@/components/tour-detail/BookingSidebar"));
const ReviewsSection = lazy(() => import("@/components/tour-detail/ReviewsSection"));

// Loading skeletons for lazy components
const SidebarSkeleton = () => (
  <div className="sticky top-28 space-y-4">
    <div className="bg-card rounded-2xl p-6 shadow-xl animate-pulse">
      <div className="h-6 bg-muted rounded w-3/4 mb-4" />
      <div className="h-10 bg-muted rounded mb-4" />
      <div className="h-12 bg-muted rounded mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-4/6" />
      </div>
      <div className="h-12 bg-muted rounded mt-6" />
    </div>
  </div>
);

const ReviewsSkeleton = () => (
  <div className="bg-card rounded-xl p-6 shadow-md animate-pulse">
    <div className="h-8 bg-muted rounded w-1/3 mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="h-24 bg-muted rounded" />
      <div className="md:col-span-2 space-y-2">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 bg-muted rounded" />)}
      </div>
    </div>
  </div>
);

const TourDetail = () => {
  const {
    slug,
    categoryPath
  } = useParams<{
    slug: string;
    categoryPath?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toast
  } = useToast();
  const {
    data: tour,
    isLoading,
    error
  } = useTour(slug || "");
  const {
    data: relatedTours = []
  } = useRelatedTours(tour?.category || "", tour?.id || "");
  const [isSaved, setIsSaved] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Redirect old URLs to new SEO-friendly URLs
  useEffect(() => {
    if (tour && !categoryPath && location.pathname.startsWith("/tours/")) {
      // Old URL format detected, redirect to new SEO URL
      const newUrl = getTourUrl(tour);
      navigate(newUrl, {
        replace: true
      });
    }
  }, [tour, categoryPath, location.pathname, navigate]);

  // Load saved state from localStorage
  useEffect(() => {
    if (tour?.id) {
      const saved = localStorage.getItem(`saved-tour-${tour.id}`);
      setIsSaved(!!saved);
    }
  }, [tour?.id]);
  const handleSave = () => {
    if (!tour) return;
    if (isSaved) {
      localStorage.removeItem(`saved-tour-${tour.id}`);
      setIsSaved(false);
      toast({
        title: "Removed from saved tours"
      });
    } else {
      localStorage.setItem(`saved-tour-${tour.id}`, "true");
      setIsSaved(true);
      toast({
        title: "Tour saved!",
        description: "You can find this tour in your saved items."
      });
    }
  };
  const handleShare = async () => {
    if (!tour) return;
    const shareData = {
      title: tour.title,
      text: tour.description,
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Share this tour with friends and family."
        });
      }
    } catch (err) {
      // User cancelled share or error occurred
      if ((err as Error).name !== 'AbortError') {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied to clipboard!"
        });
      }
    }
  };

  // Loading state
  if (isLoading) {
    return <Layout>
      <div className="bg-muted py-3">
        <div className="container">
          <Skeleton className="h-5 w-64" />
        </div>
      </div>
      <section className="py-6 md:py-8">
        <div className="container">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-12 w-96 mb-4" />
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-28" />
          </div>
          <Skeleton className="aspect-[16/9] w-full rounded-xl" />
        </div>
      </section>
    </Layout>;
  }

  // Error or not found state
  if (error || !tour) {
    return <Layout>
      <div className="container py-20 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Tour Not Found</h1>
        <p className="text-muted-foreground mb-8">The tour you're looking for doesn't exist.</p>
        <Link to="/tours">
          <Button>Browse All Tours</Button>
        </Link>
      </div>
    </Layout>;
  }

  // Get icon for itinerary activity
  const getActivityIcon = (activity: string) => {
    if (activity.toLowerCase().includes("board") || activity.toLowerCase().includes("depart") || activity.toLowerCase().includes("return")) {
      return Anchor;
    }
    if (activity.toLowerCase().includes("dinner") || activity.toLowerCase().includes("bbq") || activity.toLowerCase().includes("lunch") || activity.toLowerCase().includes("buffet")) {
      return Utensils;
    }
    if (activity.toLowerCase().includes("entertainment") || activity.toLowerCase().includes("dance") || activity.toLowerCase().includes("tanura")) {
      return Music;
    }
    return Camera;
  };

  const renderInfoItem = (item: string | { text: string; icon: "check" | "cross" | "info" | "dot" }, index: number) => {
    if (typeof item === 'string') {
      return <p key={index} className="text-sm">{item}</p>;
    }

    const Icon = {
      check: Check,
      cross: X,
      info: Info,
      dot: Circle
    }[item.icon] || Circle;

    const iconClass = cn(
      "w-4 h-4 mt-0.5 flex-shrink-0",
      item.icon === 'check' && "text-emerald-500",
      item.icon === 'cross' && "text-destructive",
      item.icon === 'info' && "text-blue-500",
      item.icon === 'dot' && "text-foreground w-2 h-2 mt-1.5 fill-current"
    );

    return (
      <div key={index} className="flex items-start gap-2 text-sm">
        <Icon className={iconClass} />
        <span>{item.text}</span>
      </div>
    );
  };

  const categoryLabels: Record<string, string> = {
    "dhow-cruise": "Dhow Cruises",
    "yacht-shared": "Shared Yacht",
    "yacht-private": "Private Charter",
    "megayacht": "Megayacht",
    "water-activity": "Water Activities",
    "yacht-event": "Yacht Events",
  };

  const discount = Math.round((1 - tour.price / tour.originalPrice) * 100);

  return <Layout>
    <PageMeta
      title={`${tour.title} - Rental Yacht Dubai`}
      description={(tour.description || "").slice(0, 160)}
      ogImage={tour.gallery?.[0] || tour.image}
      canonicalPath={getTourUrl(tour)}
      ogType="article"
    />
    {/* Breadcrumb */}
    <div className="bg-muted/50 border-b border-border/50">
      <div className="container">
        <nav className="text-sm py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Link to="/" className="text-muted-foreground hover:text-secondary transition-colors whitespace-nowrap">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
          <Link to="/tours" className="text-muted-foreground hover:text-secondary transition-colors whitespace-nowrap">
            Tours
          </Link>
          {tour.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
              <Link to={`/tours?category=${tour.category}`} className="text-muted-foreground hover:text-secondary transition-colors whitespace-nowrap">
                {categoryLabels[tour.category] || tour.category}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{tour.title}</span>
        </nav>
      </div>
    </div>

    {/* Hero Section with Title */}
    <section className="pt-6 pb-4 md:pt-10 md:pb-6 bg-gradient-to-b from-muted/30 to-background">
      <div className="container">
        {/* Title & Actions Row */}
        <motion.div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }}>
          <div className="flex-1">
            {/* Category & Subtitle */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold border border-secondary/20 uppercase tracking-wide">
                {categoryLabels[tour.category] || tour.category}
              </span>
              {discount > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-bold shadow-sm">
                  🔥 {discount}% OFF
                </span>
              )}
            </div>
            
            <h1 className="font-display text-2xl md:text-3xl lg:text-5xl font-black text-foreground mb-2 tracking-tight leading-tight">
              {tour.title}
            </h1>

            {tour.subtitle && (
              <p className="text-muted-foreground text-base md:text-lg mb-4">{tour.subtitle}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5 bg-secondary/10 px-3 py-1.5 rounded-lg border border-secondary/20">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`w-3.5 h-3.5 ${star <= Math.round(tour.rating) ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`} />)}
                </div>
                <span className="font-extrabold text-sm text-foreground">{tour.rating}</span>
                <span className="text-muted-foreground text-xs">({tour.reviewCount.toLocaleString()} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-lg text-sm">
                <Clock className="w-4 h-4 text-secondary" />
                <span className="text-foreground font-medium">{tour.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-lg text-sm">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="text-foreground font-medium">Dubai Marina</span>
              </div>
              {tour.capacity && (
                <div className="flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-lg text-sm">
                  <Users className="w-4 h-4 text-secondary" />
                  <span className="text-foreground font-medium">{tour.capacity}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="gap-2 rounded-xl hover:border-secondary/50 hover:text-secondary" onClick={handleSave}>
              <Heart className={cn("w-4 h-4 transition-all", isSaved && "fill-destructive text-destructive")} />
              <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 rounded-xl hover:border-secondary/50 hover:text-secondary" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </motion.div>

        {/* Image Gallery */}
        <ImageGallery images={tour.gallery} title={tour.title} />
      </div>
    </section>

    {/* Trust Badges */}
    <section className="pb-4 md:pb-6">
      <div className="container">
        <TrustBadges />
      </div>
    </section>

    {/* Main Content */}
    <section className="pb-12">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Quick Info Cards */}
            <QuickInfoCards duration={tour.duration} capacity={tour.capacity} />

            {/* Transfer & Deck Info Badges */}
            {(tour.bookingFeatures.transfer_available || tour.bookingFeatures.has_upper_deck) && (
              <div className="flex flex-wrap gap-3">
                {tour.bookingFeatures.transfer_available && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Car className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-foreground">
                      {tour.bookingFeatures.transfer_label || "Hotel Transfer"}{" "}
                      <span className="text-muted-foreground">
                        {(tour.bookingFeatures.transfer_price || 0) > 0 ? `(AED ${tour.bookingFeatures.transfer_price})` : "(Complimentary)"}
                      </span>
                    </span>
                  </div>
                )}
                {tour.bookingFeatures.has_upper_deck && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-foreground">Upper Deck Available</span>
                  </div>
                )}
              </div>
            )}

            {/* Overview */}
            <motion.div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: "-50px"
            }} transition={{
              duration: 0.5
            }}>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground mb-4 flex items-center gap-2 tracking-tight">
                <div className="w-1 h-6 bg-secondary rounded-full" />
                Overview
              </h2>
              <div
                className="text-muted-foreground leading-relaxed prose-headings:text-foreground prose-a:text-secondary"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(tour.longDescription) }}
              />
            </motion.div>

            {/* Highlights */}
            {tour.highlights.length > 0 && <motion.div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: "-50px"
            }} transition={{
              duration: 0.5
            }}>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground mb-5 flex items-center gap-2 tracking-tight">
                <div className="w-1 h-6 bg-secondary rounded-full" />
                Highlights
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tour.highlights.map((highlight, index) => <motion.li key={index} className="flex items-start gap-3" initial={{
                  opacity: 0,
                  x: -10
                }} whileInView={{
                  opacity: 1,
                  x: 0
                }} viewport={{
                  once: true
                }} transition={{
                  delay: index * 0.05
                }}>
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-foreground">{highlight}</span>
                </motion.li>)}
              </ul>
            </motion.div>}

            {/* Water Activity: Equipment & Gear */}
            {tour.category === 'water-activity' && (tour.bookingFeatures.equipment_list?.length || 0) > 0 && (
              <motion.div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground mb-4 flex items-center gap-2 tracking-tight">
                  <div className="w-1 h-6 bg-secondary rounded-full" />
                  <Shield className="w-5 h-5 text-secondary" />
                  Equipment & Gear Provided
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tour.bookingFeatures.equipment_list!.map((item, index) => (
                    <motion.div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/5 border border-secondary/10" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                      <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                      <span className="text-foreground text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Water Activity: Safety Information */}
            {tour.category === 'water-activity' && (tour.bookingFeatures.safety_info?.length || 0) > 0 && (
              <motion.div className="bg-card rounded-xl p-6 shadow-md border-l-4 border-amber-400" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}>
                <h2 className="font-display text-2xl font-extrabold text-foreground mb-4 flex items-center gap-2 tracking-tight">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                  Safety Information
                </h2>
                <ul className="space-y-3">
                  {tour.bookingFeatures.safety_info!.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Event: Decoration Options */}
            {tour.category === 'yacht-event' && (tour.bookingFeatures.decoration_options?.length || 0) > 0 && (
              <motion.div className="bg-card rounded-xl p-6 shadow-md" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}>
                <h2 className="font-display text-2xl font-extrabold text-foreground mb-4 flex items-center gap-2 tracking-tight">
                  <Sparkles className="w-6 h-6 text-secondary" />
                  Decoration & Setup Options
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tour.bookingFeatures.decoration_options!.map((item, index) => (
                    <span key={index} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium border border-secondary/20">
                      <Sparkles className="w-3.5 h-3.5" />
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Event: Catering Options */}
            {tour.category === 'yacht-event' && (tour.bookingFeatures.catering_options?.length || 0) > 0 && (
              <motion.div className="bg-card rounded-xl p-6 shadow-md" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}>
                <h2 className="font-display text-2xl font-extrabold text-foreground mb-4 flex items-center gap-2 tracking-tight">
                  <ChefHat className="w-6 h-6 text-secondary" />
                  Catering & Dining Packages
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tour.bookingFeatures.catering_options!.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Utensils className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Event: Customization Notes */}
            {tour.category === 'yacht-event' && tour.bookingFeatures.customization_notes && (
              <motion.div className="bg-secondary/5 border border-secondary/20 rounded-xl p-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Customization Available</h3>
                    <p className="text-sm text-muted-foreground">{tour.bookingFeatures.customization_notes}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Inclusions & Exclusions with Tabs */}
            {(tour.included.length > 0 || tour.excluded.length > 0) && <motion.div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: "-50px"
            }} transition={{
              duration: 0.5
            }}>
              <Tabs defaultValue="included" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-5 h-11">
                  <TabsTrigger value="included" className="gap-2 text-sm">
                    <Check className="w-4 h-4 text-secondary" />
                    What's Included
                  </TabsTrigger>
                  <TabsTrigger value="excluded" className="gap-2 text-sm">
                    <X className="w-4 h-4 text-destructive" />
                    What's Excluded
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="included">
                  <ul className="space-y-3">
                    {tour.included.map((item, index) => <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </li>)}
                  </ul>
                </TabsContent>
                <TabsContent value="excluded">
                  <ul className="space-y-3">
                    {tour.excluded.map((item, index) => <li key={index} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </li>)}
                  </ul>
                </TabsContent>
              </Tabs>
            </motion.div>}

            {/* Itinerary */}
            {tour.itinerary.length > 0 && <motion.div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: "-50px"
            }} transition={{
              duration: 0.5
            }}>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground mb-6 flex items-center gap-2 tracking-tight">
                <div className="w-1 h-6 bg-secondary rounded-full" />
                Your Experience
              </h2>
              <div className="relative">
                {tour.itinerary.map((item, index) => {
                  const IconComponent = getActivityIcon(item.activity);
                  return <motion.div key={index} className="flex gap-4 pb-6 last:pb-0" initial={{
                    opacity: 0,
                    x: -20
                  }} whileInView={{
                    opacity: 1,
                    x: 0
                  }} viewport={{
                    once: true
                  }} transition={{
                    delay: index * 0.1
                  }}>
                    <div className="flex flex-col items-center">
                      <motion.div className="w-12 h-12 rounded-xl bg-secondary/10 border-2 border-secondary flex items-center justify-center" whileHover={{
                        scale: 1.1,
                        rotate: 5
                      }}>
                        <IconComponent className="w-5 h-5 text-secondary" />
                      </motion.div>
                      {index < tour.itinerary.length - 1 && <motion.div className="w-0.5 h-full bg-gradient-to-b from-secondary/50 to-secondary/10 mt-2" initial={{
                        scaleY: 0
                      }} whileInView={{
                        scaleY: 1
                      }} viewport={{
                        once: true
                      }} transition={{
                        delay: index * 0.1 + 0.2
                      }} />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-secondary font-extrabold text-lg">{item.time}</p>
                      <p className="text-foreground">{item.activity}</p>
                    </div>
                  </motion.div>;
                })}
              </div>
            </motion.div>}

            {/* Reviews Section */}
            <Suspense fallback={<ReviewsSkeleton />}>
              <ReviewsSection rating={tour.rating} reviewCount={tour.reviewCount} tourId={tour.id} />
            </Suspense>

            {/* FAQs */}
            {tour.faqs.length > 0 && <motion.div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: "-50px"
            }} transition={{
              duration: 0.5
            }}>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground mb-6 flex items-center gap-2 tracking-tight">
                <div className="w-1 h-6 bg-secondary rounded-full" />
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {tour.faqs.map((faq, index) => <AccordionItem key={index} value={`faq-${index}`} className="border border-border/50 rounded-xl px-4 data-[state=open]:border-secondary/30 transition-colors">
                  <AccordionTrigger className="text-left font-bold hover:text-secondary transition-colors text-sm sm:text-base hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm sm:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}
              </Accordion>
            </motion.div>}

            {/* Important Information */}
            <motion.div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: "-50px"
            }} transition={{
              duration: 0.5
            }}>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground mb-5 flex items-center gap-2 tracking-tight">
                <div className="w-1 h-6 bg-secondary rounded-full" />
                Important Information
              </h2>
              <Tabs defaultValue="cancellation" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-5 h-11">
                  <TabsTrigger value="cancellation" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Cancellation</TabsTrigger>
                  <TabsTrigger value="bring" className="text-xs sm:text-sm py-2 px-1 sm:px-3">What to Bring</TabsTrigger>
                  <TabsTrigger value="know" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Good to Know</TabsTrigger>
                </TabsList>
                <TabsContent value="cancellation" className="text-muted-foreground space-y-2 min-h-[80px]">
                  {tour.bookingFeatures.cancellation_info.map((item, index) => renderInfoItem(item, index))}
                </TabsContent>
                <TabsContent value="bring" className="text-muted-foreground space-y-2 min-h-[80px]">
                  {tour.bookingFeatures.what_to_bring.map((item, index) => renderInfoItem(item, index))}
                </TabsContent>
                <TabsContent value="know" className="text-muted-foreground space-y-2 min-h-[80px]">
                  {tour.bookingFeatures.good_to_know.map((item, index) => renderInfoItem(item, index))}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1 hidden lg:block space-y-6">
            <Suspense fallback={<SidebarSkeleton />}>
              <BookingSidebar price={tour.price} originalPrice={tour.originalPrice} duration={tour.duration} reviewCount={tour.reviewCount} tourTitle={tour.title} tourId={tour.id} pricingType={tour.pricingType} fullYachtPrice={tour.fullYachtPrice} capacity={tour.capacity} bookingFeatures={tour.bookingFeatures} />
            </Suspense>

            {/* Cross-Sell CTA for Water Activities */}
            {tour.category === 'water-activity' && (
              <motion.div className="rounded-2xl p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Waves className="w-8 h-8 text-secondary mb-3" />
                <h3 className="font-display text-lg font-bold text-foreground mb-2">Combine with a Yacht Charter</h3>
                <p className="text-sm text-muted-foreground mb-4">Add this activity to any yacht booking for a complete Dubai experience</p>
                <Link to="/tours?category=yacht-private">
                  <Button variant="secondary" className="w-full">Browse Yachts</Button>
                </Link>
              </motion.div>
            )}

            {/* Guest Capacity Badge for Events */}
            {tour.category === 'yacht-event' && tour.capacity && (
              <motion.div className="rounded-2xl p-6 bg-card border shadow-sm text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Users className="w-8 h-8 text-secondary mx-auto mb-3" />
                <p className="font-display text-xl font-bold text-foreground">{tour.capacity}</p>
                {tour.bookingFeatures.minimum_duration && (
                  <p className="text-sm text-muted-foreground mt-1">{tour.bookingFeatures.minimum_duration}</p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>

    {/* Related Tours */}
    {relatedTours.length > 0 && <section className="py-14 sm:py-20 bg-muted/30">
      <div className="container">
        <motion.div className="flex items-end justify-between mb-8" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }}>
          <div>
            <p className="text-secondary font-bold tracking-widest uppercase text-sm mb-2">More Experiences</p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {tour.category === 'water-activity' ? 'More Water Adventures' : tour.category === 'yacht-event' ? 'More Celebration Packages' : 'You Might Also Like'}
            </h2>
          </div>
          <Link to="/tours" className="hidden sm:block">
            <Button variant="outline" size="sm" className="font-semibold group rounded-xl">
              View All
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          staggerChildren: 0.1
        }}>
          {relatedTours.map((relatedTour, index) => <motion.div key={relatedTour.id} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }}>
            <TourCard tour={relatedTour} />
          </motion.div>)}
        </motion.div>
      </div>
    </section>}

    {/* Mobile Booking Bar */}
    <MobileBookingBar price={tour.price} originalPrice={tour.originalPrice} tourTitle={tour.title} tourId={tour.id} pricingType={tour.pricingType} fullYachtPrice={tour.fullYachtPrice} capacity={tour.capacity} bookingFeatures={tour.bookingFeatures} />


    {/* Booking Modal */}
    <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} tourTitle={tour.title} tourId={tour.id} price={tour.price} bookingFeatures={tour.bookingFeatures} />

    {/* Bottom padding for mobile booking bar - accounts for expanded state and safe area */}
    <div className="h-32 lg:hidden" />
  </Layout>;
};
export default TourDetail;