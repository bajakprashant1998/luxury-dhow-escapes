import { Link } from "react-router-dom";
import { 
  Anchor, 
  Utensils, 
  Music, 
  Camera, 
  Star, 
  Shield, 
  Clock, 
  Heart, 
  ArrowRight,
  CheckCircle2,
  Phone,
  Users,
  Ship,
  Crown,
  Sparkles,
  MapPin,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/layout/Layout";
import TourCard from "@/components/TourCard";
import TestimonialCard from "@/components/TestimonialCard";
import { testimonials } from "@/data/testimonials";
import { useFeaturedTours } from "@/hooks/useTours";
import heroDhowCruise from "@/assets/hero-dhow-cruise.jpg";
import dubaiMarinaNight from "@/assets/dubai-marina-night.jpg";
import yachtInterior from "@/assets/yacht-interior.jpg";
import buffetDining from "@/assets/buffet-dining.jpg";

const Home = () => {
  const { data: featuredTours = [], isLoading: toursLoading } = useFeaturedTours();

  const highlights = [
    { icon: Anchor, title: "Traditional Dhow", description: "Authentic wooden vessel experience" },
    { icon: Utensils, title: "Gourmet Buffet", description: "International cuisine selection" },
    { icon: Music, title: "Live Entertainment", description: "Tanura dance & music shows" },
    { icon: Camera, title: "Stunning Views", description: "Dubai Marina skyline" },
  ];

  const whyChooseUs = [
    { icon: Shield, title: "Best Price Guarantee", description: "Find it cheaper? We'll match it!" },
    { icon: Clock, title: "Instant Confirmation", description: "Book now, confirmation in seconds" },
    { icon: Heart, title: "24/7 Support", description: "We're here whenever you need us" },
    { icon: Users, title: "2M+ Happy Guests", description: "Join our growing family" },
  ];

  const experienceCategories = [
    { 
      icon: Ship, 
      title: "Dhow Cruises", 
      description: "Traditional dining experience",
      link: "/tours?category=dhow-cruise",
      color: "bg-blue-500/10 text-blue-600"
    },
    { 
      icon: Users, 
      title: "Shared Yacht", 
      description: "Live BBQ on the water",
      link: "/tours?category=yacht-shared",
      color: "bg-orange-500/10 text-orange-600"
    },
    { 
      icon: Anchor, 
      title: "Private Charter", 
      description: "Exclusive yacht rental",
      link: "/tours?category=yacht-private",
      color: "bg-emerald-500/10 text-emerald-600"
    },
    { 
      icon: Crown, 
      title: "Megayacht", 
      description: "Premium luxury cruise",
      link: "/tours?category=megayacht",
      color: "bg-purple-500/10 text-purple-600"
    },
  ];

  const stats = [
    { value: "2M+", label: "Happy Guests" },
    { value: "4.9", label: "Average Rating" },
    { value: "16+", label: "Tour Options" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroDhowCruise}
            alt="Dubai Marina at night"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        </div>


        {/* Content */}
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl text-primary-foreground animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Dubai's #1 Rated Cruise Experience</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
              Experience Dubai
              <span className="block text-secondary">From The Water</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed max-w-xl">
              Unforgettable dhow cruises, luxury yacht charters, and megayacht dining experiences along Dubai Marina's stunning skyline.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-secondary">{stat.value}</p>
                  <p className="text-xs text-primary-foreground/70">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link to="/tours">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-lg px-8 h-14 shadow-lg hover:shadow-xl transition-all">
                  Explore Tours
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/gallery">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-lg px-8 h-14">
                  <Play className="w-5 h-5 mr-2" />
                  View Gallery
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-secondary rounded-full" />
          </div>
        </div>
      </section>

      {/* Experience Categories */}
      <section className="py-8 -mt-16 relative z-20">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {experienceCategories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="bg-card p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group border border-border hover:border-secondary/30"
              >
                <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-1 group-hover:text-secondary transition-colors">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-secondary font-semibold tracking-wider uppercase mb-4">
                Why Choose Us
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                An Experience Like <span className="text-secondary">No Other</span>
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Every element of your cruise has been carefully curated to create memories that last a lifetime. From traditional dhows to luxury megayachts.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {highlights.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/about" className="inline-flex items-center gap-2 mt-8 text-secondary font-semibold hover:gap-3 transition-all">
                Learn More About Us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src={dubaiMarinaNight} 
                  alt="Dubai Marina Night" 
                  className="rounded-2xl shadow-lg w-full h-48 object-cover"
                />
                <img 
                  src={yachtInterior} 
                  alt="Yacht Interior" 
                  className="rounded-2xl shadow-lg w-full h-48 object-cover mt-8"
                />
                <img 
                  src={buffetDining} 
                  alt="Buffet Dining" 
                  className="rounded-2xl shadow-lg w-full h-48 object-cover -mt-4"
                />
                <div className="bg-primary rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                  <p className="text-4xl font-bold text-secondary mb-2">10+</p>
                  <p className="text-primary-foreground text-sm">Years of Excellence</p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-card rounded-xl shadow-xl px-6 py-3 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="font-medium text-foreground">Dubai Marina</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tour Section */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-secondary font-semibold tracking-wider uppercase mb-2">
                Popular Experiences
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Featured Tours
              </h2>
            </div>
            <Link to="/tours" className="mt-4 md:mt-0">
              <Button variant="outline" className="font-semibold group">
                View All Tours
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Loading State */}
          {toursLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-xl overflow-hidden shadow-md">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-4 pt-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tours Grid */}
          {!toursLoading && featuredTours.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredTours.slice(0, 4).map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!toursLoading && featuredTours.length === 0 && (
            <div className="text-center py-12 bg-muted/30 rounded-xl">
              <p className="text-muted-foreground mb-4">No featured tours available at the moment.</p>
              <Link to="/tours">
                <Button>Browse All Tours</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-primary text-primary-foreground overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container relative">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why Book With <span className="text-secondary">BetterView</span>
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              We're committed to making your Dubai experience exceptional from start to finish
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors group-hover:scale-110 duration-300">
                  <item.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-primary-foreground/70">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-12 border-t border-primary-foreground/10">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
              {["Free Cancellation", "Secure Payment", "Verified Reviews", "Local Expertise"].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-secondary font-semibold tracking-wider uppercase mb-2">
              Guest Reviews
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Guests Say
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>
              <span className="font-bold text-foreground">4.9 out of 5</span>
              <span className="text-muted-foreground">• 3,245+ reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready for an Unforgettable Experience?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Book your dhow cruise today and create memories that will last a lifetime. 
              Instant confirmation, best price guaranteed.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/tours">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-lg px-8 h-14 shadow-lg">
                  Browse All Tours
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="tel:+971501234567">
                <Button size="lg" variant="outline" className="font-semibold text-lg px-8 h-14">
                  <Phone className="w-5 h-5 mr-2" />
                  +971 50 123 4567
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
