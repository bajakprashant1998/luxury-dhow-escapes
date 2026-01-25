import { Link } from "react-router-dom";
import { memo } from "react";
import { motion } from "framer-motion";
import { Anchor, Utensils, Music, Camera, ArrowRight, MapPin } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import dubaiMarinaNight from "@/assets/dubai-marina-night.webp";
import yachtInterior from "@/assets/yacht-interior.webp";
import buffetDining from "@/assets/buffet-dining.webp";

const highlights = [
  { icon: Anchor, title: "Traditional Dhow", description: "Authentic wooden vessel experience" },
  { icon: Utensils, title: "Gourmet Buffet", description: "International cuisine selection" },
  { icon: Music, title: "Live Entertainment", description: "Tanura dance & music shows" },
  { icon: Camera, title: "Stunning Views", description: "Dubai Marina skyline" },
];

const HighlightsSection = memo(() => {
  return (
    <section className="py-24 bg-muted/30 overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-secondary font-semibold tracking-wider uppercase mb-4">
              Why Choose Us
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              An Experience Like <span className="text-secondary">No Other</span>
            </h2>
            <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
              Every element of your cruise has been carefully curated to create memories that last a lifetime. From traditional dhows to luxury megayachts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 md:p-4 bg-card rounded-xl border border-border hover:border-secondary/30 hover:shadow-lg transition-all duration-300 group touch-target hover:-translate-y-1"
                >
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <item.icon className="w-5 md:w-6 h-5 md:h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm md:text-base">{item.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/about" className="inline-flex items-center gap-2 mt-10 text-secondary font-semibold hover:gap-3 transition-all group">
              Learn More About Us 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div 
            className="relative mt-8 lg:mt-0"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-2 gap-4 md:gap-5">
              <div className="overflow-hidden rounded-xl shadow-lg border border-border/50">
                <OptimizedImage 
                  src={dubaiMarinaNight} 
                  alt="Dubai Marina Night"
                  aspectRatio="4/3"
                  sizes="(max-width: 768px) 45vw, 25vw"
                  containerClassName="h-40 sm:h-48 md:h-56 hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="overflow-hidden rounded-xl shadow-lg border border-border/50">
                <OptimizedImage 
                  src={yachtInterior} 
                  alt="Yacht Interior"
                  aspectRatio="4/3"
                  sizes="(max-width: 768px) 45vw, 25vw"
                  containerClassName="h-40 sm:h-48 md:h-56 hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="overflow-hidden rounded-xl shadow-lg border border-border/50">
                <OptimizedImage 
                  src={buffetDining} 
                  alt="Buffet Dining"
                  aspectRatio="4/3"
                  sizes="(max-width: 768px) 45vw, 25vw"
                  containerClassName="h-40 sm:h-48 md:h-56 hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-40 sm:h-48 md:h-56 bg-primary rounded-xl p-5 md:p-6 flex flex-col justify-center items-center text-center shadow-lg border border-secondary/20">
                <p className="text-5xl md:text-6xl font-bold text-secondary mb-2">10+</p>
                <p className="text-primary-foreground text-sm md:text-base">Years of Excellence</p>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="flex absolute -bottom-6 left-1/2 -translate-x-1/2 bg-card rounded-full shadow-xl px-5 md:px-6 py-3 md:py-4 items-center gap-2 md:gap-3 border border-border hover:-translate-y-1 transition-transform">
              <MapPin className="w-5 h-5 text-secondary" />
              <span className="font-semibold text-foreground text-sm md:text-base">Dubai Marina</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

HighlightsSection.displayName = "HighlightsSection";

export default HighlightsSection;
