import { Link } from "react-router-dom";
import { memo, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles, Shield, Clock, Award, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useHomepageContent } from "@/hooks/useHomepageContent";
import heroDhowCruise from "@/assets/hero-dubai-marina-night.webp";

const trustBadges = [
  { icon: Shield, text: "Best Price Guarantee" },
  { icon: Clock, text: "Instant Confirmation" },
  { icon: Award, text: "Top Rated 2025" },
];

// Animated counter hook
function useCounter(target: string, duration = 2000) {
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    // Extract leading number (int or decimal) and everything after
    const match = target.match(/^(\d+\.?\d*)(.*)/);
    if (!match) {
      setDisplay(target);
      return;
    }
    const numericPart = parseFloat(match[1]);
    const suffix = match[2]; // e.g. "+", "M+", "/7"
    const hasDecimal = match[1].includes(".");
    const decimalPlaces = hasDecimal ? (match[1].split(".")[1]?.length || 0) : 0;

    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (numericPart - start) * eased;
      const formatted = hasDecimal ? current.toFixed(decimalPlaces) : Math.round(current).toLocaleString();
      setDisplay(formatted + suffix);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return display;
}

const StatItem = ({ value, label, delay }: { value: string; label: string; delay: number }) => {
  const display = useCounter(value, 2200);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative group"
    >
      <div className="text-center px-2 py-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/[0.1] hover:bg-white/[0.12] hover:border-secondary/30 transition-all duration-300 hover:scale-105">
        <p className="text-xl sm:text-3xl lg:text-4xl font-black text-secondary tracking-tight leading-none">
          {display}
        </p>
        <p className="text-[9px] sm:text-xs text-white/60 uppercase tracking-widest mt-1 sm:mt-1.5 font-medium">
          {label}
        </p>
      </div>
    </motion.div>
  );
};

const HeroSection = memo(() => {
  const { stats, trustIndicators } = useHomepageContent();
  const [imageLoaded, setImageLoaded] = useState(false);

  const statsDisplay = [
    { value: stats.guests, label: stats.guestsLabel },
    { value: stats.rating, label: stats.ratingLabel },
    { value: stats.experience, label: stats.experienceLabel },
    { value: stats.support, label: stats.supportLabel },
  ];

  return (
    <section className="relative min-h-[92dvh] sm:min-h-[100dvh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={heroDhowCruise}
          alt="Luxury dhow cruise along Dubai Marina skyline at sunset"
          priority
          objectFit="cover"
          sizes="100vw"
          onLoad={() => setImageLoaded(true)}
          containerClassName="w-full h-full"
        />
        {/* Overlay for contrast — lighter since image is naturally dark */}
        <div className="absolute inset-0 bg-primary/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/40" />
        {/* Subtle radial glow behind content */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Floating ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 right-[15%] w-72 h-72 bg-secondary/[0.08] rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-32 left-[8%] w-56 h-56 bg-secondary/[0.05] rounded-full blur-2xl animate-float-slower" />
        <div className="absolute top-1/2 right-[5%] w-32 h-32 bg-white/[0.03] rounded-full blur-xl animate-float-slow" />
      </div>

      {/* Main Content */}
      <div className="container relative z-10 py-10 sm:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Column — 7 cols */}
          <motion.div
            className="lg:col-span-7 text-white"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Top Badge */}
            <motion.div
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-secondary/15 backdrop-blur-md text-secondary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6 border border-secondary/25 shadow-lg shadow-secondary/5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">Dubai's #1 Rated Cruise Experience</span>
            </motion.div>

            {/* Headline — cinematic typography */}
            <h1 className="font-display font-black leading-[0.9] tracking-tighter mb-4 sm:mb-6">
              <motion.span
                className="block text-[clamp(2rem,8vw,6rem)] text-white drop-shadow-lg"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                Experience Dubai
              </motion.span>
              <motion.span
                className="block text-[clamp(2rem,8vw,6rem)] text-shimmer"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
              >
                From The Water
              </motion.span>
            </h1>

            {/* Sub-headline */}
            <motion.p
              className="text-sm sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 leading-relaxed max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Unforgettable dhow cruises, luxury yacht charters, and megayacht dining experiences along Dubai Marina's stunning skyline.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link to="/tours" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-sm sm:text-lg px-6 sm:px-10 h-12 sm:h-14 shadow-xl shadow-secondary/20 hover:shadow-2xl hover:shadow-secondary/30 hover:scale-[1.03] transition-all duration-300 group rounded-xl touch-target"
                >
                  Explore All Tours
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </Link>
              <Link to="/gallery" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white/60 font-semibold text-sm sm:text-lg px-6 sm:px-10 h-12 sm:h-14 backdrop-blur-md rounded-xl transition-all duration-300 touch-target"
                >
                  <Play className="w-5 h-5 mr-2" />
                  View Gallery
                </Button>
              </Link>
            </motion.div>

            {/* Trust Badges Row */}
            <motion.div
              className="flex flex-wrap gap-2.5 sm:gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {trustBadges.map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm rounded-xl px-3.5 py-2 border border-white/[0.08] hover:border-secondary/30 hover:bg-white/[0.12] transition-all duration-200"
                >
                  <badge.icon className="w-4 h-4 text-secondary" />
                  <span className="text-xs sm:text-sm font-medium text-white/85">{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column — 5 cols: Stats + Floating Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
              {statsDisplay.map((stat, i) => (
                <StatItem key={i} value={stat.value} label={stat.label} delay={0.5 + i * 0.12} />
              ))}
            </div>

            {/* Floating Booking Card (desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="bg-card/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-secondary/15 flex items-center justify-center">
                      <Star className="w-5 h-5 text-secondary fill-secondary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">Book Your Experience</p>
                      <p className="text-xs text-muted-foreground">Starting from AED 120/person</p>
                    </div>
                  </div>
                  <div className="space-y-2.5 mb-5">
                    {trustIndicators.slice(0, 3).map((indicator, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm">
                        <div className="w-5 h-5 rounded-full bg-secondary/15 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-muted-foreground text-sm">{indicator}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/tours">
                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold shadow-md shadow-secondary/10 h-11 rounded-xl">
                      View All Tours
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                {/* Promo badge */}
                <motion.div
                  className="absolute -top-3 -left-3 bg-destructive text-destructive-foreground px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-destructive/30"
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: -6 }}
                  transition={{ delay: 1, type: "spring", stiffness: 200 }}
                >
                  🔥 Up to 30% OFF
                </motion.div>

                {/* Live indicator */}
                <motion.div
                  className="absolute -bottom-2 right-4 flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1 shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-semibold text-muted-foreground">12 people booking now</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="w-7 h-11 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
          <motion.div
            className="w-1.5 h-3 bg-secondary rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
