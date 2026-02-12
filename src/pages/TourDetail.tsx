import { useState, useEffect, lazy, Suspense } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, MapPin, Check, X, ChevronRight, Heart, Share2, Anchor, Utensils, Music, Camera, Shield, AlertTriangle, Sparkles, ChefHat, Info, Waves, PartyPopper, Users, Circle } from "lucide-react";
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

  return <Layout>
    <PageMeta
      title={`${tour.title} - Rental Yacht Dubai`}
      description={(tour.description || "").slice(0, 160)}
      ogImage={tour.gallery?.[0] || tour.image}
      canonicalPath={getTourUrl(tour)}
      ogType="article"
    />
    {/* Breadcrumb */}
    <div className="bg-muted py-0">
      <div className="container">
        <nav className="text-sm py-[10px] my-[10px] flex-row flex items-center justify-start gap-[8px]">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <Link to="/tours" className="text-muted-foreground hover:text-foreground transition-colors">
            Tours
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{tour.title}</span>
        </nav>
      </div>
    </div>

    {/* Hero Section with Title */}
    <section className="py-6 md:py-8">
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
          <div>
            <motion.p className="text-secondary font-semibold mb-1" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 0.1
            }}>
              {tour.subtitle}
            </motion.p>
            <motion.h1 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-3" initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.15
            }}>
              {tour.title}
            </motion.h1>
            <motion.div className="flex flex-wrap items-center gap-4" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 0.2
            }}>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`w-4 h-4 ${star <= Math.round(tour.rating) ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />)}
                </div>
                <span className="font-semibold">{tour.rating}</span>
                <span className="text-muted-foreground">({tour.reviewCount.toLocaleString()} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Dubai Marina</span>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div className="flex items-center gap-2" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.3
          }}>
            <motion.div whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleSave}>
                <Heart className={cn("w-4 h-4 transition-all", isSaved && "fill-destructive text-destructive")} />
                <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Image Gallery */}
        <ImageGallery images={tour.gallery} title={tour.title} />
      </div>
    </section>

    {/* Trust Badges */}
    <section className="pb-6">
      <div className="container">
        <TrustBadges />
      </div>
    </section>

    {/* Main Content */}
    <section className="pb-8">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Info Cards */}
            <QuickInfoCards duration={tour.duration} capacity={tour.capacity} />

            {/* Overview */}
            <motion.div className="bg-card rounded-xl p-6 shadow-md" initial={{
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
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Overview</h2>
              <div
                className="text-muted-foreground leading-relaxed prose-headings:text-foreground prose-a:text-secondary"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(tour.longDescription) }}
              />
            </motion.div>

            {/* Highlights */}
            {tour.highlights.length > 0 && <motion.div className="bg-card rounded-xl p-6 shadow-md" initial={{
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
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Highlights</h2>
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
              <motion.div className="bg-card rounded-xl p-6 shadow-md" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-secondary" />
                  Equipment & Gear Provided
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tour.bookingFeatures.equipment_list!.map((item, index) => (
                    <motion.div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/10" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
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
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
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
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
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
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
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
            {(tour.included.length > 0 || tour.excluded.length > 0) && <motion.div className="bg-card rounded-xl p-6 shadow-md" initial={{
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
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="included" className="gap-2">
                    <Check className="w-4 h-4 text-secondary" />
                    What's Included
                  </TabsTrigger>
                  <TabsTrigger value="excluded" className="gap-2">
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
            {tour.itinerary.length > 0 && <motion.div className="bg-card rounded-xl p-6 shadow-md" initial={{
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
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Your Experience</h2>
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
                    {/* Timeline */}
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
                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <p className="text-secondary font-bold text-lg">{item.time}</p>
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
            {tour.faqs.length > 0 && <motion.div className="bg-card rounded-xl p-6 shadow-md" initial={{
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
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {tour.faqs.map((faq, index) => <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left font-medium hover:text-secondary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}
              </Accordion>
            </motion.div>}

            {/* Important Information */}
            <motion.div className="bg-card rounded-xl p-6 shadow-md" initial={{
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
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Important Information</h2>
              <Tabs defaultValue="cancellation" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4 h-auto">
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
    {relatedTours.length > 0 && <section className="py-12 bg-muted/50">
      <div className="container">
        <motion.h2 className="font-display text-2xl font-bold text-foreground mb-8" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }}>
          {tour.category === 'water-activity' ? 'More Water Adventures' : tour.category === 'yacht-event' ? 'More Celebration Packages' : 'You Might Also Like'}
        </motion.h2>
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