import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Shield, Users, Clock, Award, Phone, MessageCircle, Anchor, ChevronDown, MapPin, Calendar, User, Mail, Sparkles, Ship, Waves } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useContactConfig } from "@/hooks/useContactConfig";
import { testimonials } from "@/data/testimonials";
import { toast } from "sonner";

// Hero & showcase images
import heroImage from "@/assets/promo/yacht-dubai-skyline.jpg";
import yachtPartyDeck from "@/assets/promo/yacht-party-deck.jpg";
import yachtLuxuryInterior from "@/assets/promo/yacht-luxury-interior.jpg";
import yachtSunsetCouple from "@/assets/promo/yacht-sunset-couple.jpg";
import yachtAerial from "@/assets/promo/yacht-aerial.jpg";
import yachtDining from "@/assets/promo/yacht-dining.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const GOLD = "#d4a853";

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
];

export default function YachtPromoLanding() {
  const { whatsappLinkWithGreeting, phoneFormatted, phone } = useContactConfig();

  const scrollToBooking = () => {
    document.getElementById("final-booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Luxury yacht cruising in Dubai Marina at sunset" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0a]" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4a853]/30 mb-6" style={{ background: "rgba(212,168,83,0.1)" }}>
                <Sparkles className="w-4 h-4" style={{ color: GOLD }} />
                <span className="text-xs tracking-[0.2em] uppercase" style={{ color: GOLD }}>Premium Yacht Experiences</span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Experience{" "}
                <span className="bg-gradient-to-r from-[#d4a853] to-[#e8c170] bg-clip-text text-transparent">Luxury Yacht</span>{" "}
                Rental in Dubai
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-gray-300 mb-8 max-w-lg">
                Sail through the iconic Dubai skyline aboard our premium fleet. Unforgettable experiences with world-class service, from intimate sunset cruises to lavish private charters.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <button
                  onClick={scrollToBooking}
                  className="px-8 py-4 rounded-lg font-semibold text-black text-lg hover:brightness-110 transition-all shadow-lg shadow-[#d4a85340]"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, #e8c170)` }}
                >
                  Book Your Yacht Now
                </button>
                <a
                  href={whatsappLinkWithGreeting("Hi! I'm interested in booking a luxury yacht in Dubai.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-lg font-semibold border border-white/20 hover:border-white/50 transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp Us
                </a>
              </motion.div>
            </motion.div>

            {/* Mini Booking Form */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
              <MiniBookingForm />
            </motion.div>
          </div>
        </div>
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-8 h-8 text-white/40" />
        </motion.div>
      </section>

      {/* Trust Stats */}
      <section className="py-8 border-y border-white/10" style={{ background: "#111" }}>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "1,000+", label: "Happy Guests", icon: Users },
            { value: "4.9★", label: "Average Rating", icon: Star },
            { value: "8+", label: "Years Experience", icon: Award },
            { value: "50+", label: "Luxury Yachts", icon: Ship },
          ].map((s) => (
            <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col items-center">
              <s.icon className="w-5 h-5 mb-2" style={{ color: GOLD }} />
              <p className="text-2xl md:text-3xl font-bold" style={{ color: GOLD }}>{s.value}</p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4" style={{ background: "#0a0a0a" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <p className="text-sm tracking-[0.2em] uppercase mb-2" style={{ color: GOLD }}>Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-bold">Trusted by 1000+ Happy Guests</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t) => (
              <motion.div key={t.id} variants={fadeUp} className="rounded-2xl p-6 border border-white/10" style={{ background: "#161616" }}>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" style={{ color: GOLD }} />
                  ))}
                </div>
                <p className="text-gray-300 text-sm mb-4 line-clamp-4">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: GOLD, color: "#000" }}>
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
      </section>

      {/* Experience Showcase — 6 stunning images */}
      <section className="py-20 px-4" style={{ background: "#111" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <p className="text-sm tracking-[0.2em] uppercase mb-2" style={{ color: GOLD }}>The Experience</p>
            <h2 className="text-3xl md:text-4xl font-bold">Unforgettable Moments on the Water</h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">From stunning interiors to breathtaking skyline views — every detail is crafted for your perfect day.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {showcaseImages.map((item) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                className="relative rounded-2xl overflow-hidden group aspect-[4/3]"
              >
                <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-semibold text-lg">{item.label}</p>
                  <p className="text-sm text-gray-300">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Full-width parallax banner */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={yachtSunsetCouple} alt="Romantic yacht sunset" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center px-4">
            <Waves className="w-10 h-10 mx-auto mb-4" style={{ color: GOLD }} />
            <h2 className="text-3xl md:text-5xl font-bold mb-3">Your Dream Awaits</h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-6">Create memories that last a lifetime aboard Dubai's most exclusive yachts.</p>
            <button
              onClick={scrollToBooking}
              className="px-8 py-4 rounded-lg font-semibold text-black hover:brightness-110 transition-all"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #e8c170)` }}
            >
              Start Planning Your Experience
            </button>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 px-4" style={{ background: "#0a0a0a" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <p className="text-sm tracking-[0.2em] uppercase mb-2" style={{ color: GOLD }}>Our Packages</p>
            <h2 className="text-3xl md:text-4xl font-bold">Choose Your Experience</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <motion.div
                key={pkg.name}
                variants={fadeUp}
                className="rounded-2xl overflow-hidden border transition-all hover:border-[#d4a853]/60 hover:-translate-y-1"
                style={{ background: "#161616", borderColor: pkg.popular ? GOLD : "rgba(255,255,255,0.1)" }}
              >
                {pkg.popular && (
                  <div className="text-center py-2 text-xs font-bold tracking-widest uppercase text-black" style={{ background: GOLD }}>
                    Most Popular
                  </div>
                )}
                <div className="relative h-52">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                  <p className="text-2xl font-bold mb-4" style={{ color: GOLD }}>{pkg.price}</p>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <span style={{ color: GOLD }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={scrollToBooking}
                    className="w-full py-3 rounded-lg font-semibold transition-all hover:brightness-110 text-black"
                    style={{ background: pkg.popular ? `linear-gradient(135deg, ${GOLD}, #e8c170)` : "rgba(255,255,255,0.1)", color: pkg.popular ? "#000" : "#fff" }}
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4" style={{ background: "#111" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <p className="text-sm tracking-[0.2em] uppercase mb-2" style={{ color: GOLD }}>Why Choose Us</p>
            <h2 className="text-3xl md:text-4xl font-bold">The Rental Yacht Dubai Difference</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {whyChoose.map((item) => (
              <motion.div key={item.title} variants={fadeUp} className="text-center p-6 rounded-2xl border border-white/5 hover:border-[#d4a853]/30 transition-all" style={{ background: "#1a1a1a" }}>
                <item.icon className="w-8 h-8 mx-auto mb-3" style={{ color: GOLD }} />
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Urgency */}
      <section className="py-16 px-4 text-center" style={{ background: `linear-gradient(135deg, #1a2d4f, #0d1a2d)` }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-2xl mx-auto">
          <motion.div variants={fadeUp}>
            <Anchor className="w-10 h-10 mx-auto mb-4" style={{ color: GOLD }} />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold mb-3">Limited Availability This Season</motion.h2>
          <motion.p variants={fadeUp} className="text-gray-300 mb-2">Our premium yachts are booking fast. Only <span className="font-bold text-white">7 slots remaining</span> this week.</motion.p>
          <motion.p variants={fadeUp} className="text-sm text-gray-400 mb-8">Don't miss your chance to experience Dubai from the water.</motion.p>
          <motion.button
            variants={fadeUp}
            onClick={scrollToBooking}
            className="px-10 py-4 rounded-lg font-semibold text-black text-lg hover:brightness-110 transition-all shadow-lg shadow-[#d4a85340]"
            style={{ background: `linear-gradient(135deg, ${GOLD}, #e8c170)` }}
          >
            Reserve Your Spot Today
          </motion.button>
        </motion.div>
      </section>

      {/* Final Booking Form */}
      <section id="final-booking" className="py-20 px-4" style={{ background: "#0a0a0a" }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <p className="text-sm tracking-[0.2em] uppercase mb-2" style={{ color: GOLD }}>Book Now</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Secure Your Luxury Yacht Experience</h2>
            <p className="text-gray-400">Fill in the form below and our team will confirm your booking within minutes.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <FullBookingForm />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-white/10" style={{ background: "#0a0a0a" }}>
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} Rental Yacht Dubai. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-3">
          <a href={`tel:${phone}`} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <Phone className="w-3 h-3" /> {phoneFormatted}
          </a>
          <a href={whatsappLinkWithGreeting()} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <MessageCircle className="w-3 h-3" /> WhatsApp
          </a>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 md:hidden" style={{ background: "linear-gradient(to top, #0a0a0a, transparent)" }}>
        <button
          onClick={scrollToBooking}
          className="w-full py-4 rounded-xl font-bold text-black text-lg shadow-lg shadow-[#d4a85340]"
          style={{ background: `linear-gradient(135deg, ${GOLD}, #e8c170)` }}
        >
          Book Your Yacht Now
        </button>
      </div>
    </div>
  );
}

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
    <form onSubmit={handleSubmit} className="rounded-2xl p-6 md:p-8 border border-white/10 backdrop-blur-md" style={{ background: "rgba(0,0,0,0.6)" }}>
      <h3 className="text-xl font-bold mb-1">Quick Booking</h3>
      <p className="text-sm text-gray-400 mb-5">Get a response within 15 minutes</p>
      <div className="space-y-3">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your Name" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#d4a853]/50" />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone Number" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#d4a853]/50" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-[#d4a853]/50" />
          </div>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-[#d4a853]/50 appearance-none">
              {[...Array(20)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? "s" : ""}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-5 py-3.5 rounded-lg font-bold text-black hover:brightness-110 transition-all disabled:opacity-50"
        style={{ background: `linear-gradient(135deg, ${GOLD}, #e8c170)` }}
      >
        {loading ? "Sending..." : "Get Instant Quote"}
      </button>
      <p className="text-xs text-gray-500 text-center mt-3">✓ No payment required · Free cancellation</p>
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

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#d4a853]/50";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-6 md:p-10 border border-white/10" style={{ background: "#161616" }}>
      <div className="grid md:grid-cols-2 gap-4">
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
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone Number *" className={inputCls} />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} />
        </div>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className={`${inputCls} appearance-none`}>
            {[...Array(30)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? "s" : ""}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Special requests or questions..." rows={1} className={`${inputCls} min-h-[44px]`} />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 py-4 rounded-lg font-bold text-black text-lg hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-[#d4a85340]"
        style={{ background: `linear-gradient(135deg, ${GOLD}, #e8c170)` }}
      >
        {loading ? "Submitting..." : "Secure Your Yacht Experience"}
      </button>
      <p className="text-xs text-gray-500 text-center mt-3">✓ Free cancellation up to 24 hours · Instant confirmation</p>
    </form>
  );
}
