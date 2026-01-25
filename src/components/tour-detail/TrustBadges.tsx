import { motion } from "framer-motion";
import { Shield, ThumbsUp, Clock, CreditCard, Star } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 }
  }
};

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
};

const TrustBadges = () => {
  const badges = [
    {
      icon: Star,
      label: "Top Rated",
      sublabel: "4.9 Average",
    },
    {
      icon: Shield,
      label: "Verified Seller",
      sublabel: "Licensed operator",
    },
    {
      icon: ThumbsUp,
      label: "Best Price",
      sublabel: "Guarantee",
    },
    {
      icon: Clock,
      label: "Free Cancel",
      sublabel: "Up to 24h before",
    },
    {
      icon: CreditCard,
      label: "Secure Payment",
      sublabel: "SSL encrypted",
    },
  ];

  return (
    <motion.div 
      className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap items-center gap-2 md:gap-3 lg:gap-4 scrollbar-hide snap-x-mandatory"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {badges.map((badge, index) => (
        <motion.div
          key={index}
          variants={item}
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex-shrink-0 snap-start flex items-center gap-2 md:gap-2.5 px-3 md:px-4 py-2 md:py-2.5 bg-card rounded-lg md:rounded-xl border border-border/50 shadow-sm hover:shadow-md hover:border-secondary/30 transition-all duration-300 cursor-default group touch-target"
        >
          <motion.div 
            className="w-8 md:w-9 h-8 md:h-9 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors"
            whileHover={{ rotate: 10 }}
          >
            <badge.icon className="w-3.5 md:w-4 h-3.5 md:h-4 text-secondary" />
          </motion.div>
          <div className="text-left">
            <p className="text-[11px] md:text-xs font-semibold text-foreground leading-tight group-hover:text-secondary transition-colors whitespace-nowrap">{badge.label}</p>
            <p className="text-[9px] md:text-[10px] text-muted-foreground leading-tight whitespace-nowrap">{badge.sublabel}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TrustBadges;
