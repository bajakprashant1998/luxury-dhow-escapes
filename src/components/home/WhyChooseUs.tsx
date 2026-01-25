import { motion } from "framer-motion";
import { Shield, Clock, Heart, Users, CheckCircle2, LucideIcon } from "lucide-react";
import { useHomepageContent } from "@/hooks/useHomepageContent";

// Icon mapping for dynamic icons from database
const iconMap: Record<string, LucideIcon> = {
  Shield,
  Clock,
  Heart,
  Users,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const WhyChooseUs = () => {
  const { whyChooseUs, trustIndicators } = useHomepageContent();

  return (
    <section className="py-24 bg-primary text-primary-foreground overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="container relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Why Book With <span className="text-secondary">Rental Yacht Dubai</span>
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            We're committed to making your Dubai experience exceptional from start to finish
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {whyChooseUs.map((whyItem, index) => {
            const IconComponent = iconMap[whyItem.icon] || Shield;
            return (
              <motion.div 
                key={index} 
                className="text-center group"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
              >
                <motion.div 
                  className="w-14 sm:w-16 lg:w-20 h-14 sm:h-16 lg:h-20 mx-auto mb-3 sm:mb-4 lg:mb-6 rounded-xl sm:rounded-2xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <IconComponent className="w-7 sm:w-8 lg:w-10 h-7 sm:h-8 lg:h-10 text-secondary" />
                </motion.div>
                <h3 className="font-display text-sm sm:text-base lg:text-xl font-semibold mb-1 sm:mb-2 lg:mb-3">{whyItem.title}</h3>
                <p className="text-primary-foreground/70 text-xs sm:text-sm lg:text-base line-clamp-2 sm:line-clamp-none">{whyItem.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div 
          className="mt-10 sm:mt-16 lg:mt-20 pt-8 sm:pt-10 lg:pt-12 border-t border-primary-foreground/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap justify-start sm:justify-center items-center gap-4 sm:gap-6 md:gap-12 scrollbar-hide snap-x-mandatory"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {trustIndicators.map((indicator, index) => (
              <motion.div 
                key={index} 
                className="flex-shrink-0 snap-start flex items-center gap-1.5 sm:gap-2"
                variants={item}
              >
                <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-secondary" />
                <span className="font-medium text-sm sm:text-base whitespace-nowrap">{indicator}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
