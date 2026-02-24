import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Users, Heart, Shield, ArrowRight, Anchor, Star, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import PageMeta from "@/components/PageMeta";
import { useHomepageStats } from "@/hooks/useHomepageContent";
import { useSiteSetting } from "@/hooks/useSiteSettings";

/* ─── Animated Counter ─── */
const AnimatedCounter = ({ value, suffix = "" }: { value: string; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasAnimated(true);
        const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
        const prefix = value.match(/^[^0-9]*/)?.[0] || "";
        const duration = 2000;
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const current = numericValue * easeProgress;
          if (value.includes(".")) {
            setDisplayValue(`${prefix}${current.toFixed(1)}${suffix}`);
          } else {
            setDisplayValue(`${prefix}${Math.floor(current).toLocaleString()}${suffix}`);
          }
          if (progress < 1) requestAnimationFrame(animate);
          else setDisplayValue(value + suffix);
        };
        requestAnimationFrame(animate);
      },
      { threshold: 0.3 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated, value, suffix]);

  return <span ref={ref}>{displayValue}</span>;
};

/* ─── Reusable section heading ─── */
const SectionHeading = ({
  pill,
  title,
  subtitle,
  light = false,
}: {
  pill: string;
  title: string;
  subtitle: string;
  light?: boolean;
}) => (
  <motion.div
    className="text-center mb-10 sm:mb-14"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <span
      className={`inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 ${
        light
          ? "bg-primary-foreground/10 text-primary-foreground/80"
          : "bg-secondary/15 text-secondary"
      }`}
    >
      {pill}
    </span>
    <h2
      className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 ${
        light ? "text-primary-foreground" : "text-foreground"
      }`}
    >
      {title}
    </h2>
    <p
      className={`text-sm sm:text-base max-w-2xl mx-auto ${
        light ? "text-primary-foreground/70" : "text-muted-foreground"
      }`}
    >
      {subtitle}
    </p>
  </motion.div>
);

/* ─── Data ─── */
const values = [
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive for excellence in every aspect of our service, from the moment you book until you disembark.",
  },
  {
    icon: Heart,
    title: "Passion",
    description:
      "Our passion for creating unforgettable experiences drives everything we do.",
  },
  {
    icon: Users,
    title: "Family Values",
    description:
      "We treat every guest like family, ensuring warmth and hospitality throughout your journey.",
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description:
      "Your safety and satisfaction are our top priorities. We maintain the highest standards.",
  },
];

const milestones = [
  { year: "2015", text: "Founded with a single traditional dhow" },
  { year: "2017", text: "Expanded to 5 vessels & luxury yacht charters" },
  { year: "2019", text: "Served 10,000+ guests milestone" },
  { year: "2021", text: "Launched premium megayacht experiences" },
  { year: "2023", text: "Recognised as Dubai's top-rated cruise operator" },
];

const team = [
  {
    name: "Ahmed Hassan",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    bio: "20+ years of maritime experience",
  },
  {
    name: "Sarah Al-Rashid",
    role: "Operations Director",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    bio: "Expert in luxury hospitality",
  },
  {
    name: "Mohammed Khan",
    role: "Guest Experience Manager",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    bio: "Dedicated to guest satisfaction",
  },
];

/* ─── Variants ─── */
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const } },
};

/* ═══════════════════════════════════════════════════════════ */

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

  return (
    <Layout>
      <PageMeta
        title="About Us - Rental Yacht Dubai"
        description="Learn about Rental Yacht Dubai — Dubai's premier yacht charter and dhow cruise company since 2015."
        canonicalPath="/about"
      />

      {/* ── HERO ── */}
      <section className="relative min-h-[60dvh] sm:min-h-[70dvh] flex items-end pb-12 sm:pb-20 bg-primary text-primary-foreground overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/30 z-10" />
          <img
            src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1920"
            alt="Dubai Marina aerial"
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
            <motion.span
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase bg-secondary/20 text-secondary px-4 py-1.5 rounded-full mb-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Anchor className="w-3.5 h-3.5" /> Our Story
            </motion.span>

            <motion.h1
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-[1.1]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Crafting Memories on <span className="text-secondary">Dubai's Waters</span>
            </motion.h1>

            <motion.p
              className="text-primary-foreground/80 text-base sm:text-lg md:text-xl max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Since 2015, we've combined traditional Arabian hospitality with world-class
              service to create magical moments on the water.
            </motion.p>
          </motion.div>
        </div>

        {/* scroll indicator */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden sm:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex items-start justify-center p-1"
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

      {/* ── STATS BAR ── */}
      <section className="py-10 sm:py-14 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-secondary-foreground rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-secondary-foreground rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {displayStats.map((stat, i) => (
              <motion.div key={i} className="text-center" variants={fadeUp}>
                <p className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-secondary-foreground mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-secondary-foreground/80 text-xs sm:text-sm tracking-wide uppercase">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-secondary mb-3">
                Who We Are
              </span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                A Legacy of Excellence on Dubai's Waters
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                <p>
                  {siteName} was born from a simple dream: to share the breathtaking beauty
                  of Dubai Marina with visitors from around the world. What started as a
                  single traditional dhow has grown into one of Dubai's most trusted cruise
                  experiences.
                </p>
                <p>
                  Our founder's grandfather was a pearl diver, and his father captained
                  trading dhows across the Arabian Gulf. This deep connection to maritime
                  tradition inspires everything we do.
                </p>
                <p>
                  Today, we combine this rich heritage with modern luxury and impeccable
                  service. Every cruise is carefully crafted to offer an authentic experience
                  while exceeding the expectations of our discerning guests.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/tours">
                  <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 group">
                    Explore Cruises
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline">Get in Touch</Button>
                </Link>
              </div>
            </motion.div>

            {/* staggered image grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                {
                  src: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600",
                  alt: "Traditional dhow cruise",
                  offset: false,
                },
                {
                  src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600",
                  alt: "Dubai Marina skyline",
                  offset: true,
                },
              ].map((img, i) => (
                <motion.div
                  key={i}
                  className={`relative rounded-xl overflow-hidden shadow-lg ${img.offset ? "mt-8" : ""}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-52 sm:h-64 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-16 sm:py-24 bg-primary text-primary-foreground overflow-hidden">
        <div className="container">
          <SectionHeading
            pill="Milestones"
            title="Our Journey"
            subtitle="Key moments that shaped who we are today"
            light
          />

          <motion.div
            className="relative max-w-3xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* center line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-primary-foreground/20 -translate-x-1/2" />

            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  className={`relative flex items-start gap-4 sm:gap-0 mb-10 last:mb-0 ${
                    isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                  variants={fadeUp}
                >
                  {/* dot */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-secondary ring-4 ring-primary z-10 mt-1.5" />

                  {/* content */}
                  <div
                    className={`ml-10 sm:ml-0 sm:w-[45%] ${
                      isLeft ? "sm:text-right sm:pr-10" : "sm:text-left sm:pl-10"
                    }`}
                  >
                    <span className="text-secondary font-display text-lg sm:text-xl font-bold">
                      {m.year}
                    </span>
                    <p className="text-primary-foreground/75 text-sm sm:text-base mt-1">
                      {m.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-16 sm:py-24 bg-muted/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="container relative z-10">
          <SectionHeading
            pill="What Drives Us"
            title="Our Core Values"
            subtitle="These principles guide every decision we make and every experience we create"
          />

          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((v, i) => (
              <motion.div
                key={i}
                className="group relative bg-card rounded-xl p-5 sm:p-7 text-center shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                variants={fadeUp}
                whileHover={{ y: -4 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <v.icon className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                  </div>
                  <h3 className="font-display text-sm sm:text-lg font-semibold text-foreground mb-2">
                    {v.title}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {v.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-16 sm:py-24">
        <div className="container">
          <SectionHeading
            pill="The Crew"
            title="Meet Our Team"
            subtitle="The dedicated professionals behind your unforgettable cruise experience"
          />

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {team.map((member, i) => (
              <motion.div key={i} className="group text-center" variants={fadeUp}>
                <div className="relative mb-4 overflow-hidden rounded-xl aspect-[3/4] shadow-md">
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5 }}
                    loading="lazy"
                  />
                  {/* hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-primary-foreground text-xs sm:text-sm">{member.bio}</p>
                  </div>

                  {/* role badge */}
                  <div className="absolute top-3 left-3 bg-secondary/90 text-secondary-foreground text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {member.role}
                  </div>
                </div>
                <h3 className="font-display text-sm sm:text-lg font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-secondary text-xs sm:text-sm">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHY US STRIP ── */}
      <section className="py-12 sm:py-16 bg-muted/40">
        <div className="container">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: Star, label: "5-Star Reviews" },
              { icon: Globe, label: "Guests from 60+ Countries" },
              { icon: Shield, label: "Fully Insured Fleet" },
              { icon: Anchor, label: "Licensed & Certified" },
            ].map((item, i) => (
              <motion.div key={i} className="flex flex-col items-center gap-2" variants={fadeUp}>
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-secondary/15 flex items-center justify-center">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-foreground">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1920')] bg-cover bg-center opacity-10" />

        <div className="container relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience the {siteName} Difference?
            </h2>
            <p className="text-primary-foreground/75 text-sm sm:text-lg mb-8 max-w-xl mx-auto">
              Join thousands of satisfied guests who have discovered the magic of Dubai
              Marina aboard our traditional dhow cruises.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
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
