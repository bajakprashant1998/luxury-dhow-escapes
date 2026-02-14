import { Link } from "react-router-dom";
import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Sparkles, Shield, Clock, Award, CreditCard, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactConfig } from "@/hooks/useContactConfig";

// Trust indicators with payment/guarantee badges
const trustIndicators = [
  { icon: Shield, text: "Best Price Guarantee" },
  { icon: CreditCard, text: "Secure Payment" },
  { icon: Award, text: "Top Rated 2024" },
  { icon: Clock, text: "24/7 Support" },
];

// Calculate time until end of month (offers reset monthly)
const getTimeUntilEndOfMonth = () => {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return endOfMonth.getTime() - now.getTime();
};

const CountdownTimer = memo(() => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilEndOfMonth());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilEndOfMonth());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const timeUnits = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Mins" },
    { value: seconds, label: "Secs" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-3">
          <div className="bg-primary text-primary-foreground rounded-lg p-2 sm:p-3 min-w-[50px] sm:min-w-[60px] text-center shadow-lg">
            <div className="text-xl sm:text-2xl font-bold tabular-nums">
              {unit.value.toString().padStart(2, "0")}
            </div>
            <div className="text-[10px] sm:text-xs text-primary-foreground/70 uppercase tracking-wider">
              {unit.label}
            </div>
          </div>
          {index < timeUnits.length - 1 && (
            <span className="text-xl sm:text-2xl font-bold text-muted-foreground">:</span>
          )}
        </div>
      ))}
    </div>
  );
});

CountdownTimer.displayName = "CountdownTimer";

const CTASection = memo(() => {
  const { phone, phoneFormatted } = useContactConfig();

  return (
    <section className="py-16 sm:py-24 bg-muted/30 overflow-hidden relative">
      {/* Decorative Elements - CSS animations for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-2xl animate-float-slower" />
      </div>

      <div className="container relative">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Timer className="w-4 h-4" />
            <span className="text-sm font-semibold">Limited Time Offer - Book Now!</span>
          </motion.div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Ready for an Unforgettable Experience?
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Book your dhow cruise today and create memories that will last a lifetime.
            Instant confirmation, best price guaranteed.
          </p>

          {/* Countdown Timer */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-muted-foreground mb-3 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary" />
              Special offers end in:
            </p>
            <CountdownTimer />
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/tours" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group touch-target">
                Browse All Tours
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href={`tel:${phone}`} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 hover:bg-primary hover:text-primary-foreground transition-all duration-300 touch-target">
                <Phone className="w-5 h-5 mr-2" />
                {phoneFormatted}
              </Button>
            </a>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {trustIndicators.map((indicator, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <indicator.icon className="w-4 h-4 text-secondary" />
                <span className="text-xs sm:text-sm font-medium">{indicator.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

CTASection.displayName = "CTASection";

export default CTASection;
