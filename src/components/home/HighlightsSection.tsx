import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Anchor, Utensils, Music, Camera, ArrowRight, MapPin } from "lucide-react";
import dubaiMarinaNight from "@/assets/dubai-marina-night.jpg";
import yachtInterior from "@/assets/yacht-interior.jpg";
import buffetDining from "@/assets/buffet-dining.jpg";

const highlights = [
  { icon: Anchor, title: "Traditional Dhow", description: "Authentic wooden vessel experience" },
  { icon: Utensils, title: "Gourmet Buffet", description: "International cuisine selection" },
  { icon: Music, title: "Live Entertainment", description: "Tanura dance & music shows" },
  { icon: Camera, title: "Stunning Views", description: "Dubai Marina skyline" },
];

const HighlightsSection = () => {
  return (
    <section className="py-24 bg-muted/30 overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
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
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-3 md:p-4 bg-card rounded-xl border border-border hover:border-secondary/30 hover:shadow-lg transition-all duration-300 group touch-target"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <item.icon className="w-5 md:w-6 h-5 md:h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm md:text-base">{item.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/about" className="inline-flex items-center gap-2 mt-10 text-secondary font-semibold hover:gap-3 transition-all group">
                Learn More About Us 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative mt-8 lg:mt-0"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <motion.img 
                src={dubaiMarinaNight} 
                alt="Dubai Marina Night" 
                className="rounded-xl md:rounded-2xl shadow-lg w-full h-36 sm:h-48 object-cover"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              />
              <motion.img 
                src={yachtInterior} 
                alt="Yacht Interior" 
                className="rounded-xl md:rounded-2xl shadow-lg w-full h-36 sm:h-48 object-cover mt-4 md:mt-8"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              />
              <motion.img 
                src={buffetDining} 
                alt="Buffet Dining" 
                className="rounded-xl md:rounded-2xl shadow-lg w-full h-36 sm:h-48 object-cover -mt-2 md:-mt-4"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div 
                className="bg-primary rounded-xl md:rounded-2xl p-4 md:p-6 flex flex-col justify-center items-center text-center"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <motion.p 
                  className="text-4xl md:text-5xl font-bold text-secondary mb-1 md:mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                >
                  10+
                </motion.p>
                <p className="text-primary-foreground text-xs md:text-sm">Years of Excellence</p>
              </motion.div>
            </div>

            {/* Floating Badge - Hidden on mobile, repositioned */}
            <motion.div 
              className="hidden sm:flex absolute -bottom-6 left-1/2 -translate-x-1/2 bg-card rounded-xl shadow-xl px-4 md:px-6 py-3 md:py-4 items-center gap-2 md:gap-3 border border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -4 }}
            >
              <MapPin className="w-4 md:w-5 h-4 md:h-5 text-secondary" />
              <span className="font-medium text-foreground text-sm md:text-base">Dubai Marina</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
