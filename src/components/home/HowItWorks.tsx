import { memo } from "react";
import { motion } from "framer-motion";
import { Search, CalendarCheck, Ship } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Browse & Choose",
    description: "Explore our curated collection of yacht charters, dhow cruises, and water activities.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Book Instantly",
    description: "Select your date, guests, and extras. Get instant confirmation with secure payment.",
  },
  {
    icon: Ship,
    step: "03",
    title: "Enjoy the Experience",
    description: "Arrive at the marina and step aboard for an unforgettable Dubai experience.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const HowItWorks = memo(() => {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <motion.div
          className="text-center mb-14 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-secondary font-semibold tracking-wider uppercase mb-3">
            Simple & Easy
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Book your dream Dubai experience in just three simple steps
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((stepItem, index) => (
            <motion.div
              key={index}
              className="text-center relative group"
              variants={item}
            >
              {/* Step number badge */}
              <div className="relative inline-flex mb-6">
                <motion.div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-card border-2 border-border group-hover:border-secondary/50 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 relative z-10"
                  whileHover={{ scale: 1.05, rotate: 3 }}
                >
                  <stepItem.icon className="w-8 h-8 sm:w-10 sm:h-10 text-secondary" />
                </motion.div>
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center z-20 shadow-md">
                  {stepItem.step.slice(-1)}
                </span>
              </div>

              <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-2">
                {stepItem.title}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xs mx-auto leading-relaxed">
                {stepItem.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

HowItWorks.displayName = "HowItWorks";

export default HowItWorks;
