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
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import TourCard from "@/components/TourCard";
import TestimonialCard from "@/components/TestimonialCard";
import { tours, getFeaturedTours } from "@/data/tours";
import { testimonials } from "@/data/testimonials";

const Home = () => {
  const featuredTours = getFeaturedTours();

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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920"
            alt="Dubai Marina at night"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl text-primary-foreground animate-fade-in">
            <p className="text-secondary font-semibold tracking-wider uppercase mb-4">
              ✨ Dubai's Premier Dhow Cruise Experience
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Discover the Magic of 
              <span className="text-secondary"> Dubai Marina</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Embark on an unforgettable evening cruise aboard a traditional Arabian dhow. 
              Savor gourmet dining, live entertainment, and breathtaking skyline views.
            </p>

            {/* Price Badge */}
            <div className="inline-flex items-center gap-4 bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-4 mb-8">
              <div>
                <p className="text-primary-foreground/70 text-sm">Starting from</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-secondary">AED 149</span>
                  <span className="text-primary-foreground/60 line-through">AED 199</span>
                </div>
              </div>
              <div className="h-12 w-px bg-primary-foreground/20" />
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-secondary text-secondary" />
                <span className="font-semibold">4.8</span>
                <span className="text-primary-foreground/70">(2,847 reviews)</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link to="/tours">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-lg px-8 h-14">
                  Explore Tours
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-lg px-8 h-14">
                  <Phone className="w-5 h-5 mr-2" />
                  Book Now
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

      {/* Highlights Section */}
      <section className="py-20 bg-cream">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              An Experience Like No Other
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every element of your cruise has been carefully curated to create memories that last a lifetime
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow group"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <item.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tour Section */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-secondary font-semibold tracking-wider uppercase mb-2">
                Our Signature Experience
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Featured Experiences
              </h2>
            </div>
            <Link to="/tours" className="mt-4 md:mt-0">
              <Button variant="ghost" className="text-secondary hover:text-secondary hover:bg-secondary/10 font-semibold">
                View All Tours
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredTours.slice(0, 4).map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
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
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-primary-foreground/70">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-12 border-t border-primary-foreground/10">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                <span className="font-medium">Free Cancellation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                <span className="font-medium">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                <span className="font-medium">Verified Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                <span className="font-medium">Local Expertise</span>
              </div>
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
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>
              <span className="font-semibold text-foreground">4.8 out of 5</span>
              <span className="text-muted-foreground">based on 2,847 reviews</span>
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
      <section className="py-20 bg-cream">
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
              <Link to="/contact">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-lg px-8 h-14">
                  Book Your Cruise
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="tel:+971501234567">
                <Button size="lg" variant="outline" className="font-semibold text-lg px-8 h-14">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us Now
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
