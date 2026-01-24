import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroDhowCruise from "@/assets/hero-dhow-cruise.jpg";

const stats = [
  { value: "2M+", label: "Happy Guests" },
  { value: "4.9", label: "Average Rating" },
  { value: "16+", label: "Tour Options" },
  { value: "24/7", label: "Support" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img
          src={heroDhowCruise}
          alt="Dubai Marina at night"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/50" />
        
        {/* Animated Gradient Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent"
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-[20%] w-64 h-64 bg-secondary/10 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 left-[10%] w-48 h-48 bg-secondary/5 rounded-full blur-2xl"
          animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="text-primary-foreground"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary px-4 py-2 rounded-full mb-6 border border-secondary/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Dubai's #1 Rated Cruise Experience</span>
            </motion.div>

            <motion.h1 
              className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Experience Dubai
              <motion.span 
                className="block text-secondary mt-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                From The Water
              </motion.span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Unforgettable dhow cruises, luxury yacht charters, and megayacht dining experiences along Dubai Marina's stunning skyline.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              className="flex flex-wrap gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Link to="/tours">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-lg px-8 h-14 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                  Explore Tours
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/gallery">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-lg px-8 h-14 backdrop-blur-sm">
                  <Play className="w-5 h-5 mr-2" />
                  View Gallery
                </Button>
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div 
              className="flex flex-wrap gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1, duration: 0.5 }}
                >
                  <p className="text-3xl md:text-4xl font-bold text-secondary">{stat.value}</p>
                  <p className="text-xs text-primary-foreground/70 uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Floating Card */}
          <motion.div 
            className="hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
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
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-8 h-12 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <motion.div 
            className="w-1.5 h-3 bg-secondary rounded-full"
            animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
