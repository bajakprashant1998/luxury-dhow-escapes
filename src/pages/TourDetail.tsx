import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Star, 
  Clock, 
  MapPin, 
  Check, 
  X, 
  ChevronRight,
  Heart,
  Share2,
  Anchor,
  Utensils,
  Music,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import TourCard from "@/components/TourCard";
import ImageGallery from "@/components/tour-detail/ImageGallery";
import TrustBadges from "@/components/tour-detail/TrustBadges";
import QuickInfoCards from "@/components/tour-detail/QuickInfoCards";
import BookingSidebar from "@/components/tour-detail/BookingSidebar";
import ReviewsSection from "@/components/tour-detail/ReviewsSection";
import MobileBookingBar from "@/components/tour-detail/MobileBookingBar";

import BookingModal from "@/components/tour-detail/BookingModal";
import { useTour, useRelatedTours } from "@/hooks/useTours";

const TourDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { data: tour, isLoading, error } = useTour(slug || "");
  const { data: relatedTours = [] } = useRelatedTours(
    tour?.category || "",
    tour?.id || ""
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

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
      toast({ title: "Removed from saved tours" });
    } else {
      localStorage.setItem(`saved-tour-${tour.id}`, "true");
      setIsSaved(true);
      toast({ title: "Tour saved!", description: "You can find this tour in your saved items." });
    }
  };

  const handleShare = async () => {
    if (!tour) return;
    
    const shareData = {
      title: tour.title,
      text: tour.description,
      url: window.location.href,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link copied!", description: "Share this tour with friends and family." });
      }
    } catch (err) {
      // User cancelled share or error occurred
      if ((err as Error).name !== 'AbortError') {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link copied to clipboard!" });
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  // Error or not found state
  if (error || !tour) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Tour Not Found</h1>
          <p className="text-muted-foreground mb-8">The tour you're looking for doesn't exist.</p>
          <Link to="/tours">
            <Button>Browse All Tours</Button>
          </Link>
        </div>
      </Layout>
    );
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

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted py-3">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm">
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
          <motion.div 
            className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <motion.p 
                className="text-secondary font-semibold mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {tour.subtitle}
              </motion.p>
              <motion.h1 
                className="font-display text-2xl md:text-4xl font-bold text-foreground mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {tour.title}
              </motion.h1>
              <motion.div 
                className="flex flex-wrap items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(tour.rating)
                            ? "fill-secondary text-secondary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
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
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleSave}>
                  <Heart className={cn("w-4 h-4 transition-all", isSaved && "fill-destructive text-destructive")} />
                  <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
              <motion.div 
                className="bg-card rounded-xl p-6 shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{tour.longDescription}</p>
              </motion.div>

              {/* Highlights */}
              {tour.highlights.length > 0 && (
                <motion.div 
                  className="bg-card rounded-xl p-6 shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">Highlights</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tour.highlights.map((highlight, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-secondary" />
                        </div>
                        <span className="text-foreground">{highlight}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Inclusions & Exclusions with Tabs */}
              {(tour.included.length > 0 || tour.excluded.length > 0) && (
                <motion.div 
                  className="bg-card rounded-xl p-6 shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5 }}
                >
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
                        {tour.included.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                    <TabsContent value="excluded">
                      <ul className="space-y-3">
                        {tour.excluded.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}

              {/* Itinerary */}
              {tour.itinerary.length > 0 && (
                <motion.div 
                  className="bg-card rounded-xl p-6 shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">Your Experience</h2>
                  <div className="relative">
                    {tour.itinerary.map((item, index) => {
                      const IconComponent = getActivityIcon(item.activity);
                      return (
                        <motion.div 
                          key={index} 
                          className="flex gap-4 pb-6 last:pb-0"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {/* Timeline */}
                          <div className="flex flex-col items-center">
                            <motion.div 
                              className="w-12 h-12 rounded-xl bg-secondary/10 border-2 border-secondary flex items-center justify-center"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <IconComponent className="w-5 h-5 text-secondary" />
                            </motion.div>
                            {index < tour.itinerary.length - 1 && (
                              <motion.div 
                                className="w-0.5 h-full bg-gradient-to-b from-secondary/50 to-secondary/10 mt-2"
                                initial={{ scaleY: 0 }}
                                whileInView={{ scaleY: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                              />
                            )}
                          </div>
                          {/* Content */}
                          <div className="flex-1 pb-4">
                            <p className="text-secondary font-bold text-lg">{item.time}</p>
                            <p className="text-foreground">{item.activity}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Reviews Section */}
              <ReviewsSection rating={tour.rating} reviewCount={tour.reviewCount} />

              {/* FAQs */}
              {tour.faqs.length > 0 && (
                <motion.div 
                  className="bg-card rounded-xl p-6 shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Frequently Asked Questions
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {tour.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-left font-medium hover:text-secondary transition-colors">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              )}

              {/* Important Information */}
              <motion.div 
                className="bg-card rounded-xl p-6 shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Important Information</h2>
                <Tabs defaultValue="cancellation" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="cancellation">Cancellation</TabsTrigger>
                    <TabsTrigger value="bring">What to Bring</TabsTrigger>
                    <TabsTrigger value="know">Good to Know</TabsTrigger>
                  </TabsList>
                  <TabsContent value="cancellation" className="text-muted-foreground space-y-2">
                    <p>✓ Free cancellation up to 24 hours before the start time</p>
                    <p>✓ Full refund for cancellations made within the free period</p>
                    <p>✗ No refund for no-shows or late cancellations</p>
                  </TabsContent>
                  <TabsContent value="bring" className="text-muted-foreground space-y-2">
                    <p>• Comfortable shoes and smart casual attire</p>
                    <p>• Camera or smartphone for photos</p>
                    <p>• Light jacket (air conditioning on lower deck)</p>
                    <p>• Valid ID for verification</p>
                  </TabsContent>
                  <TabsContent value="know" className="text-muted-foreground space-y-2">
                    <p>• Arrive 20-30 minutes before departure</p>
                    <p>• Not wheelchair accessible</p>
                    <p>• Vegetarian options available upon request</p>
                    <p>• Dress code: Smart casual (no shorts/flip-flops)</p>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1 hidden lg:block">
              <BookingSidebar 
                price={tour.price} 
                originalPrice={tour.originalPrice} 
                duration={tour.duration}
                reviewCount={tour.reviewCount}
                tourTitle={tour.title}
                tourId={tour.id}
                pricingType={tour.pricingType}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related Tours */}
      {relatedTours.length > 0 && (
        <section className="py-12 bg-muted/50">
          <div className="container">
            <motion.h2 
              className="font-display text-2xl font-bold text-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              You Might Also Like
            </motion.h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.1 }}
            >
              {relatedTours.map((relatedTour, index) => (
                <motion.div
                  key={relatedTour.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TourCard tour={relatedTour} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Mobile Booking Bar */}
      <MobileBookingBar 
        price={tour.price} 
        originalPrice={tour.originalPrice}
        tourTitle={tour.title}
        tourId={tour.id}
        pricingType={tour.pricingType}
      />


      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tourTitle={tour.title}
        tourId={tour.id}
        price={tour.price}
      />

      {/* Bottom padding for mobile booking bar */}
      <div className="h-24 lg:hidden" />
    </Layout>
  );
};

export default TourDetail;
