import { Waves } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LuxuryBookingCard = () => {
  const features = [
    "Instant confirmation",
    "Free cancellation up to 24h",
    "Best price guaranteed",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl max-w-sm w-full"
      style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(212, 168, 83, 0.1)",
      }}
    >
      {/* Header with Icon */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-secondary/20 rounded-2xl flex items-center justify-center">
          <Waves className="w-7 h-7 md:w-8 md:h-8 text-secondary" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-foreground">
            Book Your Experience
          </h3>
          <p className="text-muted-foreground text-sm md:text-base">
            Starting from AED 120
          </p>
        </div>
      </div>

      {/* Features List */}
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <motion.li
            key={feature}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
            className="flex items-center gap-3"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-secondary flex-shrink-0" />
            <span className="text-muted-foreground text-sm md:text-base">
              {feature}
            </span>
          </motion.li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link to="/tours">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 md:py-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-xl transition-colors duration-300 text-sm md:text-base"
        >
          View All Tours
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default LuxuryBookingCard;
