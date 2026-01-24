import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24 bg-muted/30 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-2xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container relative">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Limited Time Offers Available</span>
          </motion.div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready for an Unforgettable Experience?
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Book your dhow cruise today and create memories that will last a lifetime. 
            Instant confirmation, best price guaranteed.
          </p>

          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/tours">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-lg px-8 h-14 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                Browse All Tours
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="tel:+971501234567">
              <Button size="lg" variant="outline" className="font-semibold text-lg px-8 h-14 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Phone className="w-5 h-5 mr-2" />
                +971 50 123 4567
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
