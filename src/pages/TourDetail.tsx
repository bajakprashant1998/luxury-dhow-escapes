import { useParams, Link } from "react-router-dom";
import { 
  Star, 
  Clock, 
  MapPin, 
  Check, 
  X, 
  ChevronRight,
  Shield,
  Calendar,
  Users,
  Phone,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Layout from "@/components/layout/Layout";
import { getTourBySlug, tours } from "@/data/tours";
import TourCard from "@/components/TourCard";

const TourDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const tour = getTourBySlug(slug || "");

  if (!tour) {
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

  const discount = Math.round((1 - tour.price / tour.originalPrice) * 100);
  const relatedTours = tours.filter((t) => t.id !== tour.id).slice(0, 2);

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
            <span className="text-foreground font-medium">{tour.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Rating */}
              <div>
                <p className="text-secondary font-semibold mb-2">{tour.subtitle}</p>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {tour.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 fill-secondary text-secondary" />
                    <span className="font-semibold">{tour.rating}</span>
                    <span className="text-muted-foreground">({tour.reviewCount.toLocaleString()} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-5 h-5" />
                    <span>Dubai Marina</span>
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4 md:col-span-3 row-span-2">
                  <img
                    src={tour.gallery[0]}
                    alt={tour.title}
                    className="w-full h-[300px] md:h-[400px] object-cover rounded-xl"
                  />
                </div>
                <div className="hidden md:block">
                  <img
                    src={tour.gallery[1]}
                    alt={tour.title}
                    className="w-full h-[192px] object-cover rounded-xl"
                  />
                </div>
                <div className="hidden md:block">
                  <img
                    src={tour.gallery[2]}
                    alt={tour.title}
                    className="w-full h-[192px] object-cover rounded-xl"
                  />
                </div>
              </div>

              {/* Overview */}
              <div className="bg-card rounded-xl p-6 shadow-md">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{tour.longDescription}</p>
              </div>

              {/* Highlights */}
              <div className="bg-card rounded-xl p-6 shadow-md">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Highlights</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tour.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-secondary" />
                      </div>
                      <span className="text-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl p-6 shadow-md">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    What's Included
                  </h2>
                  <ul className="space-y-3">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-card rounded-xl p-6 shadow-md">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <X className="w-5 h-5 text-destructive" />
                    What's Excluded
                  </h2>
                  <ul className="space-y-3">
                    {tour.excluded.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Itinerary */}
              <div className="bg-card rounded-xl p-6 shadow-md">
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Your Experience</h2>
                <div className="relative">
                  {tour.itinerary.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-6 last:pb-0">
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        {index < tour.itinerary.length - 1 && (
                          <div className="w-0.5 h-full bg-secondary/30 mt-2" />
                        )}
                      </div>
                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <p className="text-secondary font-semibold">{item.time}</p>
                        <p className="text-foreground">{item.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="bg-card rounded-xl p-6 shadow-md">
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {tour.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-card rounded-xl p-6 shadow-lg border border-border">
                {/* Price */}
                <div className="mb-6">
                  {discount > 0 && (
                    <span className="inline-block bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold mb-2">
                      {discount}% OFF
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">AED {tour.price}</span>
                    {tour.originalPrice > tour.price && (
                      <span className="text-muted-foreground line-through">AED {tour.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">per person</p>
                </div>

                {/* Quick Info */}
                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-secondary" />
                    <span className="text-sm text-muted-foreground">Available daily</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-secondary" />
                    <span className="text-sm text-muted-foreground">{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-secondary" />
                    <span className="text-sm text-muted-foreground">Hotel pickup included</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-secondary" />
                    <span className="text-sm text-muted-foreground">Free cancellation (24h)</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-3">
                  <Link to="/contact" className="block">
                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold h-12 text-lg">
                      Reserve Now
                    </Button>
                  </Link>
                  <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" className="w-full h-12">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      WhatsApp Us
                    </Button>
                  </a>
                  <a href="tel:+971501234567" className="block">
                    <Button variant="ghost" className="w-full h-12 text-muted-foreground">
                      <Phone className="w-5 h-5 mr-2" />
                      +971 50 123 4567
                    </Button>
                  </a>
                </div>

                {/* Trust Badge */}
                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground">
                    ✓ Instant Confirmation<br />
                    ✓ Best Price Guaranteed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tours */}
      {relatedTours.length > 0 && (
        <section className="py-16 bg-cream">
          <div className="container">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default TourDetail;
