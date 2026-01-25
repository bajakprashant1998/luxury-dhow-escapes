import { Link } from "react-router-dom";
import { memo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useHomepageContent } from "@/hooks/useHomepageContent";
import heroDhowCruise from "@/assets/hero-dhow-cruise.jpg";

const HeroSection = memo(() => {
  const { stats } = useHomepageContent();
  const [imageLoaded, setImageLoaded] = useState(false);

  const statsDisplay = [
    { value: stats.guests, label: stats.guestsLabel },
    { value: stats.rating, label: stats.ratingLabel },
    { value: stats.experience, label: stats.experienceLabel },
    { value: stats.support, label: stats.supportLabel },
  ];

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Background Image - Priority loading with optimized component */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={heroDhowCruise}
          alt="Dubai Marina at night"
          priority
          objectFit="cover"
          sizes="100vw"
          onLoad={() => setImageLoaded(true)}
          containerClassName="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
      </div>

      {/* Floating Elements - Reduced motion, uses CSS instead of JS animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[20%] w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-40 left-[10%] w-48 h-48 bg-secondary/5 rounded-full blur-2xl animate-float-slower" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="text-primary-foreground"
            initial={{ opacity: 0, y: 40 }}
            animate={imageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary px-4 py-2 rounded-full mb-6 border border-secondary/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={imageLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Dubai's #1 Rated Cruise Experience</span>
            </motion.div>

            <h1 className="font-display text-fluid-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-6">
              Experience Dubai
              <span className="block text-shimmer mt-2">From The Water</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed max-w-xl">
              Unforgettable dhow cruises, luxury yacht charters, and megayacht dining experiences along Dubai Marina's stunning skyline.
            </p>

            {/* CTAs - Full width on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
              <Link to="/tours" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group touch-target">
                  Explore Tours
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/gallery" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 backdrop-blur-sm touch-target">
                  <Play className="w-5 h-5 mr-2" />
                  View Gallery
                </Button>
              </Link>
            </div>

            {/* Stats Row - Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {statsDisplay.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center bg-primary-foreground/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-primary-foreground/10 hover:scale-105 hover:bg-primary-foreground/10 transition-all duration-200"
                >
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-primary-foreground/70 uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Floating Card - simplified animation */}
          <div className="hidden lg:block">
            <div className="relative animate-float-slow">
              <div className="bg-card/95 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-border/50 max-w-sm ml-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <Waves className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Book Your Experience</p>
                    <p className="text-sm text-muted-foreground">Starting from AED 120</p>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="text-muted-foreground">Instant confirmation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="text-muted-foreground">Free cancellation up to 24h</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="text-muted-foreground">Best price guaranteed</span>
                  </div>
                </div>
                <Link to="/tours">
                  <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    View All Tours
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - CSS animation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
        <div className="w-8 h-12 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-secondary rounded-full animate-scroll-indicator" />
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
