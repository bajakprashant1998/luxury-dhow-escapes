import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { Award, Users, Heart, Shield, ArrowRight, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useHomepageStats } from "@/hooks/useHomepageContent";
import { useSiteSetting } from "@/hooks/useSiteSettings";

// Animated counter component
const AnimatedCounter = ({ value, suffix = "" }: { value: string; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState("0");
  
  useEffect(() => {
    if (!isInView) return;
    
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
    const prefix = value.match(/^[^0-9]*/)?.[0] || "";
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = numericValue * easeProgress;
      
      if (value.includes(".")) {
        setDisplayValue(`${prefix}${current.toFixed(1)}${suffix}`);
      } else {
        setDisplayValue(`${prefix}${Math.floor(current).toLocaleString()}${suffix}`);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value + suffix);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, value, suffix]);
  
  return <span ref={ref}>{displayValue}</span>;
};

const About = () => {
  const stats = useHomepageStats();
  const { data: siteSettings } = useSiteSetting("site");
  
  const siteName = (siteSettings?.siteName as string) || "Rental Yacht Dubai";

  const displayStats = [
    { value: stats.experience, label: stats.experienceLabel, suffix: "" },
    { value: stats.guests, label: stats.guestsLabel, suffix: "+" },
    { value: stats.rating, label: stats.ratingLabel, suffix: "" },
    { value: "100", label: "Commitment", suffix: "%" },
  ];

  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service, from the moment you book until you disembark.",
      color: "from-amber-500/20 to-amber-600/20",
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Our passion for creating unforgettable experiences drives everything we do.",
      color: "from-rose-500/20 to-rose-600/20",
    },
    {
      icon: Users,
      title: "Family Values",
      description: "We treat every guest like family, ensuring warmth and hospitality throughout your journey.",
      color: "from-blue-500/20 to-blue-600/20",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Your safety and satisfaction are our top priorities. We maintain the highest standards.",
      color: "from-emerald-500/20 to-emerald-600/20",
    },
  ];

  const team = [
    { 
      name: "Ahmed Hassan", 
      role: "Founder & CEO", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      bio: "20+ years of maritime experience",
      linkedin: "#",
    },
    { 
      name: "Sarah Al-Rashid", 
      role: "Operations Director", 
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      bio: "Expert in luxury hospitality",
      linkedin: "#",
    },
    { 
      name: "Mohammed Khan", 
      role: "Guest Experience Manager", 
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      bio: "Dedicated to guest satisfaction",
      linkedin: "#",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const },
    },
  };

  return (
    <Layout>
      {/* Hero Section with Parallax */}
      <section className="relative py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary z-10" />
          <img
            src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1920"
            alt="Dubai Marina"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="container relative z-20">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p 
              className="text-secondary font-semibold tracking-wider uppercase mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Our Story
            </motion.p>
            <motion.h1 
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              About {siteName}
            </motion.h1>
            <motion.p 
              className="text-primary-foreground/80 text-lg md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Since 2015, we've been creating magical moments on the waters of Dubai Marina, 
              combining traditional Arabian hospitality with world-class service.
            </motion.p>
          </motion.div>
        </div>

        {/* Animated scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-primary-foreground/40 rounded-full flex items-start justify-center p-1"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className="w-1.5 h-2.5 bg-secondary rounded-full"
              animate={{ opacity: [1, 0.3, 1], y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section className="py-12 bg-secondary relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-secondary-foreground rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-secondary-foreground rounded-full blur-3xl" />
        </div>
        
        <div className="container relative z-10">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {displayStats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                variants={itemVariants}
              >
                <motion.p 
                  className="font-display text-4xl md:text-5xl font-bold text-secondary-foreground mb-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </motion.p>
                <p className="text-secondary-foreground/80">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section with Parallax Images */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Legacy of Excellence on Dubai's Waters
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {siteName} was born from a simple dream: to share the breathtaking beauty 
                  of Dubai Marina with visitors from around the world. What started as a single 
                  traditional dhow has grown into one of Dubai's most trusted cruise experiences.
                </p>
                <p>
                  Our founder, Ahmed Hassan, grew up on these waters. His grandfather was a pearl 
                  diver, and his father captained trading dhows across the Arabian Gulf. This deep 
                  connection to maritime tradition inspires everything we do.
                </p>
                <p>
                  Today, we combine this rich heritage with modern luxury and impeccable service. 
                  Every cruise is carefully crafted to offer an authentic experience while exceeding 
                  the expectations of our discerning guests.
                </p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.03 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600"
                  alt="Traditional dhow"
                  className="rounded-xl h-64 object-cover w-full shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity" />
              </motion.div>
              <motion.div
                className="relative mt-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.03 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600"
                  alt="Dubai Marina"
                  className="rounded-xl h-64 object-cover w-full shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section with Hover Effects */}
      <section className="py-12 sm:py-20 bg-cream relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="container px-4 sm:px-6 relative z-10">
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Our Core Values
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              These principles guide every decision we make and every experience we create
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                className="group relative bg-card p-4 sm:p-6 rounded-xl shadow-md text-center overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-primary/10 flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <value.icon className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
                  </motion.div>
                  <h3 className="font-display text-base sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm line-clamp-3">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section with Hover Cards */}
      <section className="py-12 sm:py-20">
        <div className="container px-4 sm:px-6">
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Meet Our Team
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              The dedicated professionals behind your unforgettable cruise experience
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {team.map((member, index) => (
              <motion.div 
                key={index} 
                className="text-center group"
                variants={itemVariants}
              >
                <div className="relative mb-3 sm:mb-4 overflow-hidden rounded-xl">
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Overlay with social links */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent flex flex-col justify-end p-4"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-primary-foreground text-xs sm:text-sm mb-2">{member.bio}</p>
                    <div className="flex justify-center gap-3">
                      <a 
                        href={member.linkedin} 
                        className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/40 transition-colors"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <Linkedin className="w-4 h-4 text-primary-foreground" />
                      </a>
                      <a 
                        href="#" 
                        className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/40 transition-colors"
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail className="w-4 h-4 text-primary-foreground" />
                      </a>
                    </div>
                  </motion.div>
                </div>
                <h3 className="font-display text-sm sm:text-xl font-semibold text-foreground">{member.name}</h3>
                <p className="text-secondary text-xs sm:text-base">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-primary to-primary-foreground/10"
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <div className="container relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience the {siteName} Difference?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Join thousands of satisfied guests who have discovered the magic of Dubai Marina 
              aboard our traditional dhow cruises.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/tours">
                <Button 
                  size="lg" 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold group"
                >
                  Explore Our Cruises
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
