import { motion } from "framer-motion";
import { Shield, Clock, Heart, Users, CheckCircle2 } from "lucide-react";

const whyChooseUs = [
  { icon: Shield, title: "Best Price Guarantee", description: "Find it cheaper? We'll match it!" },
  { icon: Clock, title: "Instant Confirmation", description: "Book now, confirmation in seconds" },
  { icon: Heart, title: "24/7 Support", description: "We're here whenever you need us" },
  { icon: Users, title: "2M+ Happy Guests", description: "Join our growing family" },
];

const trustIndicators = ["Free Cancellation", "Secure Payment", "Verified Reviews", "Local Expertise"];

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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {whyChooseUs.map((item, index) => (
            <motion.div 
              key={index} 
              className="text-center group"
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <motion.div 
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <item.icon className="w-10 h-10 text-secondary" />
              </motion.div>
              <h3 className="font-display text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-primary-foreground/70">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div 
          className="mt-20 pt-12 border-t border-primary-foreground/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-6 md:gap-12"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {trustIndicators.map((indicator, index) => (
              <motion.div 
                key={index} 
                className="flex items-center gap-2"
                variants={item}
              >
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                <span className="font-medium">{indicator}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
