import { useState, lazy, Suspense, memo, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Star, Shield, Users, Clock, Award, Phone, MessageCircle,
  Anchor, ChevronDown, Calendar, User, Mail, Sparkles, Ship,
  Waves, MapPin,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useContactConfig } from "@/hooks/useContactConfig";
import { testimonials } from "@/data/testimonials";
import { toast } from "sonner";

// Hero image loaded eagerly, rest lazy
import heroImage from "@/assets/promo/yacht-dubai-skyline.jpg";
import yachtPartyDeck from "@/assets/promo/yacht-party-deck.jpg";
import yachtLuxuryInterior from "@/assets/promo/yacht-luxury-interior.jpg";
import yachtSunsetCouple from "@/assets/promo/yacht-sunset-couple.jpg";
import yachtAerial from "@/assets/promo/yacht-aerial.jpg";
import yachtDining from "@/assets/promo/yacht-dining.jpg";
import yachtPalmJumeirah from "@/assets/promo/yacht-palm-jumeirah.jpg";
import yachtChampagneNight from "@/assets/promo/yacht-champagne-night.jpg";
import yachtPoolDeck from "@/assets/promo/yacht-pool-deck.jpg";

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
const staggerFast = { visible: { transition: { staggerChildren: 0.06 } } };

const GOLD = "#d4a853";
const GOLD_LIGHT = "#e8c170";

const packages = [
  {
    name: "Dhow Cruise Experience",
    price: "From AED 99",
    image: yachtDining,
    features: ["2-Hour Marina Cruise", "International Buffet Dinner", "Live Entertainment & Tanura Show", "Stunning Skyline Views", "Welcome Drinks Included"],
    popular: false,
  },
  {
    name: "Shared Yacht Tour",
    price: "From AED 249",
    image: yachtPartyDeck,
    features: ["3-Hour Yacht Experience", "Swimming & Snorkeling Stop", "BBQ & Refreshments", "Music System On Board", "Professional Crew"],
    popular: true,
  },
  {
    name: "Private Yacht Charter",
    price: "From AED 799",
    image: yachtAerial,
    features: ["Exclusive Private Experience", "Customizable Duration", "Personal Captain & Crew", "Premium Sound System", "Complimentary Refreshments"],
    popular: false,
  },
];

const whyChoose = [
  { icon: Shield, title: "Safety Certified", desc: "All yachts fully insured & safety inspected" },
  { icon: Users, title: "Professional Crew", desc: "Experienced captains & hospitality staff" },
  { icon: Clock, title: "Instant Confirmation", desc: "Book now, get confirmed in minutes" },
  { icon: Award, title: "Luxury Guarantee", desc: "Premium vessels & 5-star service" },
  { icon: Star, title: "Best Price Promise", desc: "Competitive rates with no hidden fees" },
  { icon: Phone, title: "24/7 Support", desc: "Round-the-clock customer assistance" },
];

const showcaseImages = [
  { img: yachtLuxuryInterior, label: "Luxury Interiors", sub: "World-class comfort on the water" },
  { img: yachtPartyDeck, label: "Party Deck", sub: "Celebrate with the Dubai skyline" },
  { img: yachtSunsetCouple, label: "Romantic Sunsets", sub: "Unforgettable golden hour moments" },
  { img: yachtDining, label: "Gourmet Dining", sub: "Fresh seafood & premium BBQ" },
  { img: yachtAerial, label: "Premium Fleet", sub: "50+ luxury yachts to choose from" },
  { img: heroImage, label: "Iconic Views", sub: "Cruise past Dubai's famous landmarks" },
  { img: yachtPalmJumeirah, label: "Open Waters", sub: "Crystal clear turquoise escapes" },
  { img: yachtChampagneNight, label: "Night Celebrations", sub: "Toast to the glittering skyline" },
  { img: yachtPoolDeck, label: "Pool & Lounge", sub: "Relax on expansive sun decks" },
];

/* ─── Gold Gradient Button ─── */
const GoldButton = memo(({ children, onClick, className = "", type = "button", disabled = false, size = "lg" }: {
  children: React.ReactNode; onClick?: () => void; className?: string; type?: "button" | "submit"; disabled?: boolean; size?: "lg" | "md";
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`font-bold text-black rounded-xl transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,168,83,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 ${size === "lg" ? "py-4 px-8 text-base md:text-lg" : "py-3 px-6 text-sm md:text-base"} ${className}`}
    style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}
  >
    {children}
  </button>
));
GoldButton.displayName = "GoldButton";

/* ─── Section Wrapper ─── */
const Section = memo(({ children, bg = "#0a0a0a", className = "", id }: {
  children: React.ReactNode; bg?: string; className?: string; id?: string;
}) => (
  <section id={id} className={`py-14 md:py-20 px-4 sm:px-6 ${className}`} style={{ background: bg }}>
    {children}
  </section>
));
Section.displayName = "Section";

/* ─── Section Header ─── */
const SectionHeader = memo(({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) => (
  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="text-center mb-10 md:mb-14">
    <p className="text-xs sm:text-sm tracking-[0.2em] uppercase mb-2" style={{ color: GOLD }}>{tag}</p>
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">{title}</h2>
    {subtitle && <p className="text-gray-400 mt-3 max-w-2xl mx-auto text-sm md:text-base">{subtitle}</p>}
  </motion.div>
));
SectionHeader.displayName = "SectionHeader";

/* ─── Lazy Image ─── */
const LazyImg = memo(({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => (
  <img src={src} alt={alt} loading="lazy" decoding="async" className={className} />
));
LazyImg.displayName = "LazyImg";

export default function YachtPromoLanding() {
  const { whatsappLinkWithGreeting, phoneFormatted, phone } = useContactConfig();

  const scrollToBooking = useCallback(() => {
    document.getElementById("final-booking")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
      {/* ══════ HERO ══════ */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Luxury yacht cruising in Dubai Marina at sunset"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0a0a0a]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4a853]/30 mb-5" style={{ background: "rgba(212,168,83,0.1)" }}>
                <Sparkles className="w-3.5 h-3.5" style={{ color: GOLD }} />
                <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase" style={{ color: GOLD }}>Premium Yacht Experiences</span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-4 md:mb-6">
                Experience{" "}
                <span className="bg-gradient-to-r from-[#d4a853] to-[#e8c170] bg-clip-text text-transparent">Luxury Yacht</span>{" "}
                Rental in Dubai
              </motion.h1>
              <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 md:mb-8 max-w-lg leading-relaxed">
                Sail through the iconic Dubai skyline aboard our premium fleet. Unforgettable experiences with world-class service.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                <GoldButton onClick={scrollToBooking}>Book Your Yacht Now</GoldButton>
                <a
                  href={whatsappLinkWithGreeting("Hi! I'm interested in booking a luxury yacht in Dubai.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold border border-white/20 hover:border-white/50 hover:bg-white/5 transition-all duration-300 text-sm md:text-base"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </a>
              </motion.div>
            </motion.div>

            {/* Mini Booking Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            >
              <MiniBookingForm />
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-white/30" />
        </motion.div>
      </section>

      {/* ══════ TRUST STATS ══════ */}
      <section className="py-6 md:py-8 border-y border-white/10" style={{ background: "#111" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerFast} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: "1,000+", label: "Happy Guests", icon: Users },
              { value: "4.9★", label: "Average Rating", icon: Star },
              { value: "8+", label: "Years Experience", icon: Award },
              { value: "50+", label: "Luxury Yachts", icon: Ship },
            ].map((s) => (
              <motion.div key={s.label} variants={scaleIn} className="flex flex-col items-center py-2">
                <s.icon className="w-4 h-4 sm:w-5 sm:h-5 mb-1.5" style={{ color: GOLD }} />
                <p className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: GOLD }}>{s.value}</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════ TESTIMONIALS ══════ */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <SectionHeader tag="Testimonials" title="Trusted by 1000+ Happy Guests" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {testimonials.slice(0, 3).map((t) => (
              <motion.div
                key={t.id}
                variants={scaleIn}
                className="rounded-2xl p-5 md:p-6 border border-white/10 hover:border-[#d4a853]/30 transition-all duration-300"
                style={{ background: "#161616" }}
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: GOLD }} />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: GOLD, color: "#000" }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ══════ EXPERIENCE SHOWCASE ══════ */}
      <Section bg="#111">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            tag="The Experience"
            title="Unforgettable Moments on the Water"
            subtitle="From stunning interiors to breathtaking skyline views — every detail is crafted for your perfect day."
          />

          {/* Mobile: horizontal scroll carousel | Desktop: grid */}
          <div className="md:hidden -mx-4 px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
              {showcaseImages.map((item) => (
                <motion.div key={item.label} variants={scaleIn} className="flex-shrink-0 w-[72vw] snap-center">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                    <LazyImg src={item.img} alt={item.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="font-semibold text-base">{item.label}</p>
                      <p className="text-xs text-gray-300 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Desktop grid */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="hidden md:grid grid-cols-3 gap-4">
            {showcaseImages.map((item) => (
              <motion.div key={item.label} variants={scaleIn} className="relative rounded-2xl overflow-hidden group aspect-[4/3] cursor-pointer">
                <LazyImg src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-semibold text-lg">{item.label}</p>
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ══════ PARALLAX BANNER ══════ */}
      <ParallaxBanner image={yachtSunsetCouple} scrollToBooking={scrollToBooking} />

      {/* ══════ PACKAGES ══════ */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <SectionHeader tag="Our Packages" title="Choose Your Experience" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            {packages.map((pkg) => (
              <motion.div
                key={pkg.name}
                variants={scaleIn}
                whileHover={{ y: -6 }}
                className="rounded-2xl overflow-hidden border transition-all duration-300"
                style={{ background: "#161616", borderColor: pkg.popular ? GOLD : "rgba(255,255,255,0.1)" }}
              >
                {pkg.popular && (
                  <div className="text-center py-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-black" style={{ background: GOLD }}>
                    ⭐ Most Popular
                  </div>
                )}
                <div className="relative h-40 sm:h-48 md:h-52 overflow-hidden">
                  <LazyImg src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold mb-1">{pkg.name}</h3>
                  <p className="text-xl md:text-2xl font-bold mb-4" style={{ color: GOLD }}>{pkg.price}</p>
                  <ul className="space-y-2 mb-5">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                        <span className="mt-0.5 flex-shrink-0" style={{ color: GOLD }}>✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {pkg.popular ? (
                    <GoldButton onClick={scrollToBooking} className="w-full" size="md">Book Now</GoldButton>
                  ) : (
                    <button
                      onClick={scrollToBooking}
                      className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 border border-white/10 hover:border-[#d4a853]/50 hover:bg-white/5"
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ══════ WHY CHOOSE US ══════ */}
      <Section bg="#111">
        <div className="max-w-6xl mx-auto">
          <SectionHeader tag="Why Choose Us" title="The Rental Yacht Dubai Difference" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerFast} className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {whyChoose.map((item) => (
              <motion.div
                key={item.title}
                variants={scaleIn}
                whileHover={{ scale: 1.03 }}
                className="text-center p-4 md:p-6 rounded-2xl border border-white/5 hover:border-[#d4a853]/30 transition-all duration-300"
                style={{ background: "#1a1a1a" }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(212,168,83,0.12)" }}>
                  <item.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: GOLD }} />
                </div>
                <h3 className="font-semibold text-sm md:text-base mb-1">{item.title}</h3>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ══════ URGENCY ══════ */}
      <section className="py-14 md:py-20 px-4 text-center overflow-hidden" style={{ background: "linear-gradient(135deg, #1a2d4f, #0d1a2d)" }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-2xl mx-auto">
          <motion.div variants={scaleIn}>
            <Anchor className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-4" style={{ color: GOLD }} />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">Limited Availability This Season</motion.h2>
          <motion.p variants={fadeUp} className="text-gray-300 text-sm md:text-base mb-2">
            Our premium yachts are booking fast. Only <span className="font-bold text-white">7 slots remaining</span> this week.
          </motion.p>
          <motion.p variants={fadeUp} className="text-xs md:text-sm text-gray-400 mb-6 md:mb-8">Don't miss your chance to experience Dubai from the water.</motion.p>
          <motion.div variants={fadeUp}>
            <GoldButton onClick={scrollToBooking}>Reserve Your Spot Today</GoldButton>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════ FINAL BOOKING FORM ══════ */}
      <Section id="final-booking">
        <div className="max-w-3xl mx-auto">
          <SectionHeader tag="Book Now" title="Secure Your Luxury Yacht Experience" subtitle="Fill in the form below and our team will confirm your booking within minutes." />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleIn}>
            <FullBookingForm />
          </motion.div>
        </div>
      </Section>

      {/* ══════ FOOTER ══════ */}
      <footer className="py-6 md:py-8 px-4 text-center border-t border-white/10" style={{ background: "#0a0a0a" }}>
        <p className="text-xs sm:text-sm text-gray-500">© {new Date().getFullYear()} Rental Yacht Dubai. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-3">
          <a href={`tel:${phone}`} className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <Phone className="w-3 h-3" /> {phoneFormatted}
          </a>
          <a href={whatsappLinkWithGreeting()} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <MessageCircle className="w-3 h-3" /> WhatsApp
          </a>
        </div>
      </footer>

      {/* ══════ STICKY MOBILE CTA ══════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
        <div className="p-3 pt-5" style={{ background: "linear-gradient(to top, #0a0a0a 60%, transparent)" }}>
          <GoldButton onClick={scrollToBooking} className="w-full shadow-lg shadow-[#d4a85340]">
            Book Your Yacht Now
          </GoldButton>
        </div>
      </div>
    </div>
  );
}

/* ─── Parallax Banner ─── */
const ParallaxBanner = memo(({ image, scrollToBooking }: { image: string; scrollToBooking: () => void }) => (
  <section className="relative h-[35vh] sm:h-[40vh] md:h-[50vh] overflow-hidden">
    <LazyImg src={image} alt="Romantic yacht sunset" className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center px-4">
        <motion.div variants={scaleIn}>
          <Waves className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-3" style={{ color: GOLD }} />
        </motion.div>
        <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 md:mb-3">Your Dream Awaits</motion.h2>
        <motion.p variants={fadeUp} className="text-gray-300 max-w-xl mx-auto mb-5 md:mb-6 text-sm md:text-base">Create memories that last a lifetime aboard Dubai's most exclusive yachts.</motion.p>
        <motion.div variants={fadeUp}>
          <GoldButton onClick={scrollToBooking} size="md">Start Planning Your Experience</GoldButton>
        </motion.div>
      </motion.div>
    </div>
  </section>
));
ParallaxBanner.displayName = "ParallaxBanner";

/* ─── Input Class ─── */
const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#d4a853]/50 focus:ring-1 focus:ring-[#d4a853]/20 transition-all duration-200";

/* ─── Mini Booking Form (Hero) ─── */
function MiniBookingForm() {
  const [form, setForm] = useState({ name: "", phone: "", date: "", guests: "2" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return toast.error("Please fill in your name and phone number.");
    setLoading(true);
    const { error } = await supabase.from("inquiries").insert({
      name: form.name,
      phone: form.phone,
      email: "landing-page-lead@placeholder.com",
      message: `Quick booking request — Date: ${form.date || "Flexible"}, Guests: ${form.guests}`,
      subject: "Landing Page Quick Booking",
    });
    setLoading(false);
    if (error) return toast.error("Something went wrong. Please try again.");
    toast.success("Request received! We'll contact you shortly.");
    setForm({ name: "", phone: "", date: "", guests: "2" });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-5 sm:p-6 md:p-8 border border-white/10 backdrop-blur-md" style={{ background: "rgba(0,0,0,0.65)" }}>
      <h3 className="text-lg md:text-xl font-bold mb-0.5">Quick Booking</h3>
      <p className="text-xs sm:text-sm text-gray-400 mb-4 md:mb-5">Get a response within 15 minutes</p>
      <div className="space-y-3">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your Name" className={inputCls} />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone Number" type="tel" className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={`${inputCls} text-gray-300`} />
          </div>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className={`${inputCls} text-gray-300 appearance-none`}>
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? "s" : ""}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <GoldButton type="submit" disabled={loading} className="w-full mt-4 md:mt-5" size="md">
        {loading ? "Sending..." : "Get Instant Quote"}
      </GoldButton>
      <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-2.5">✓ No payment required · Free cancellation</p>
    </form>
  );
}

/* ─── Full Booking Form (Bottom) ─── */
function FullBookingForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", guests: "2", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return toast.error("Please fill in all required fields.");
    setLoading(true);
    const { error } = await supabase.from("inquiries").insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: `${form.message || "Yacht booking inquiry"} — Date: ${form.date || "Flexible"}, Guests: ${form.guests}`,
      subject: "Landing Page Full Booking",
    });
    setLoading(false);
    if (error) return toast.error("Something went wrong. Please try again.");
    toast.success("Booking request submitted! We'll confirm within minutes.");
    setForm({ name: "", email: "", phone: "", date: "", guests: "2", message: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-5 sm:p-6 md:p-10 border border-white/10" style={{ background: "#161616" }}>
      <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name *" className={inputCls} />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email Address *" className={inputCls} />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone Number *" type="tel" className={inputCls} />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={`${inputCls} text-gray-300`} />
        </div>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className={`${inputCls} text-gray-300 appearance-none`}>
            {Array.from({ length: 30 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? "s" : ""}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Special requests..." rows={1} className={`${inputCls} min-h-[44px]`} />
        </div>
      </div>
      <GoldButton type="submit" disabled={loading} className="w-full mt-5 md:mt-6">
        {loading ? "Submitting..." : "Secure Your Yacht Experience"}
      </GoldButton>
      <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-2.5">✓ Free cancellation up to 24 hours · Instant confirmation</p>
    </form>
  );
}
