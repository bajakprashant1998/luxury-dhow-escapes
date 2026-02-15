import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Users, Award, MapPin, ShieldCheck } from "lucide-react";

const proofItems = [
  { icon: Users, value: "2M+", label: "Happy Guests" },
  { icon: Star, value: "4.9/5", label: "Average Rating" },
  { icon: Award, value: "16+", label: "Years Experience" },
  { icon: MapPin, value: "50+", label: "Tour Options" },
  { icon: ShieldCheck, value: "100%", label: "Secure Booking" },
];

const SocialProofBar = memo(() => {
  return (
    <section className="py-10 sm:py-14 bg-primary relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--secondary)) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      <div className="container relative">
        <motion.div
          className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {proofItems.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 text-primary-foreground"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-secondary flex-shrink-0" />
              <div>
                <p className="text-lg sm:text-xl font-bold leading-tight">{item.value}</p>
                <p className="text-[10px] sm:text-xs text-primary-foreground/60 uppercase tracking-wider">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

SocialProofBar.displayName = "SocialProofBar";

export default SocialProofBar;
