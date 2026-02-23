import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, Shield, Lock, CreditCard, Star, ChevronDown, ChevronUp, ArrowRight, Globe, Clock, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import rentalYachtLogo from "@/assets/rental-yacht-logo-new.png";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_CACHE_KEY, ADMIN_USER_KEY, getAdminCache } from "@/lib/adminAuth";
import { useContactConfig } from "@/hooks/useContactConfig";
import NewsletterForm from "@/components/home/NewsletterForm";

// Payment brand icons as inline SVGs
const VisaIcon = () => (
  <svg viewBox="0 0 48 32" className="w-12 h-8" fill="none">
    <rect width="48" height="32" rx="4" fill="hsl(var(--primary-foreground) / 0.1)" />
    <path d="M19.5 21h-3l1.9-11.5h3L19.5 21zm-5.3-11.5l-2.8 8-0.3-1.6-1-5.2c-0.2-0.7-0.7-0.9-1.3-0.9H4.1l-0.1 0.3c1 0.3 2.1 0.7 2.8 1.2l2.4 9.2h3.1l4.7-11h-2.8zm24.8 11h2.7l-2.4-11.5h-2.5c-0.6 0-1.1 0.3-1.3 0.8l-4.5 10.7h3.1l0.6-1.7h3.8l0.5 1.7zm-3.3-4l1.6-4.3 0.9 4.3h-2.5zm-6.2-4.8l0.4-2.4c-0.5-0.2-1.3-0.4-2.1-0.4-2.3 0-4 1.2-4 3 0 1.3 1.2 2 2.1 2.4 0.9 0.4 1.3 0.7 1.3 1.1 0 0.6-0.8 0.9-1.5 0.9-1 0-1.5-0.1-2.4-0.5l-0.3-0.2-0.4 2.3c0.6 0.3 1.7 0.5 2.8 0.5 2.5 0 4.1-1.2 4.1-3.1 0-1-0.6-1.8-2-2.4-0.8-0.4-1.3-0.7-1.3-1.1 0-0.4 0.4-0.8 1.3-0.8 0.7 0 1.3 0.2 1.7 0.3l0.3 0.4z" fill="hsl(var(--secondary))" />
  </svg>
);

const MastercardIcon = () => (
  <svg viewBox="0 0 48 32" className="w-12 h-8" fill="none">
    <rect width="48" height="32" rx="4" fill="hsl(var(--primary-foreground) / 0.1)" />
    <circle cx="19" cy="16" r="8" fill="#EB001B" opacity="0.9" />
    <circle cx="29" cy="16" r="8" fill="#F79E1B" opacity="0.9" />
    <path d="M24 10.5c1.7 1.4 2.8 3.4 2.8 5.5s-1.1 4.1-2.8 5.5c-1.7-1.4-2.8-3.4-2.8-5.5s1.1-4.1 2.8-5.5z" fill="#FF5F00" />
  </svg>
);

const AmexIcon = () => (
  <svg viewBox="0 0 48 32" className="w-12 h-8" fill="none">
    <rect width="48" height="32" rx="4" fill="hsl(var(--secondary) / 0.15)" />
    <path d="M8 12h3l0.5 1.2 0.5-1.2h3v6h-2.5l-0.5-1-0.5 1H8v-6zm1.5 1.5v3h1l0.5-1 0.5 1h1v-3h-0.8v1.8l-0.7-1.8h-0.5l-0.7 1.8v-1.8h-0.8z" fill="hsl(var(--secondary))" />
    <text x="24" y="18" textAnchor="middle" fontSize="6" fontWeight="bold" fill="hsl(var(--secondary))">AMEX</text>
  </svg>
);

// Collapsible section for mobile
const CollapsibleSection = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="sm:contents">
      <div className="sm:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between py-3 text-left"
        >
          <h4 className="font-display text-base font-semibold text-secondary">{title}</h4>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-secondary" />
          ) : (
            <ChevronDown className="w-5 h-5 text-secondary" />
          )}
        </button>
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="pb-4">{children}</div>
        </motion.div>
      </div>
      <div className="hidden sm:block">
        <h4 className="font-display text-base sm:text-lg font-semibold text-secondary mb-4 sm:mb-6">
          {title}
        </h4>
        {children}
      </div>
    </div>
  );
};

const Footer = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { phone, phoneFormatted, email, address } = useContactConfig();

  useEffect(() => {
    let cancelled = false;

    const checkAdminStatus = async (userId: string) => {
      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .limit(1);

        if (!cancelled) {
          setIsAdmin(Array.isArray(data) ? data.length > 0 : !!data);
        }
      } catch {
        if (!cancelled) setIsAdmin(false);
      }
    };

    const checkCache = () => {
      const cache = getAdminCache();
      if (cache) {
        setIsAdmin(true);
        return true;
      }
      return false;
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (cancelled) return;
        if (event === "SIGNED_OUT") {
          setIsAdmin(false);
          return;
        }
        if (session?.user) {
          if (!checkCache()) {
            setTimeout(() => { checkAdminStatus(session.user.id); }, 0);
          }
        } else {
          setIsAdmin(false);
        }
      }
    );

    const init = async () => {
      if (checkCache()) return;
      const { data } = await supabase.auth.getSession();
      if (data.session?.user && !cancelled) {
        checkAdminStatus(data.session.user.id);
      }
    };
    init();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-secondary to-transparent" />

      {/* Newsletter CTA Banner */}
      <div className="border-b border-primary-foreground/10">
        <div className="container py-10 sm:py-14 px-4 sm:px-6">
          <motion.div
            className="relative bg-gradient-to-br from-secondary/15 via-secondary/5 to-transparent rounded-3xl p-8 sm:p-12 border border-secondary/20 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-primary-foreground mb-3 tracking-tight">
                  Get Exclusive Deals
                </h3>
                <p className="text-primary-foreground/70 text-sm sm:text-base leading-relaxed">
                  Subscribe for VIP access to limited-time offers, new experiences, and insider travel tips for Dubai.
                </p>
              </div>
              <div>
                <NewsletterForm variant="footer" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust Highlights Bar */}
      <div className="border-b border-primary-foreground/10">
        <div className="container py-6 px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Shield, label: "Best Price Guarantee", sub: "Or we'll match it" },
              { icon: Clock, label: "Instant Confirmation", sub: "No waiting around" },
              { icon: Headphones, label: "24/7 Live Support", sub: "Always here for you" },
              { icon: Globe, label: "Trusted Worldwide", sub: "2M+ happy guests" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 group"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                  <item.icon className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-primary-foreground">{item.label}</p>
                  <p className="text-[10px] sm:text-xs text-primary-foreground/50">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <motion.div
        className="container py-10 sm:py-14 px-4 sm:px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
          {/* Brand — wider column */}
          <motion.div className="sm:col-span-2 lg:col-span-4 space-y-5" variants={itemVariants}>
            <div className="flex items-center gap-3">
              <img
                src={rentalYachtLogo}
                alt="Rental Yacht Dubai"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl sm:text-2xl text-secondary leading-tight">
                  Rental Yacht
                </span>
                <span className="text-xs sm:text-sm text-primary-foreground/70 tracking-wider uppercase">
                  Dubai
                </span>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-sm">
              Premium yacht charters and dhow cruise experiences along Dubai Marina's iconic skyline. Creating unforgettable memories since 2010.
            </p>

            {/* Rating */}
            <div className="inline-flex items-center gap-3 bg-primary-foreground/5 rounded-xl p-3 pr-5 border border-primary-foreground/10">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <div className="text-sm">
                <span className="font-bold text-secondary">4.9</span>
                <span className="text-primary-foreground/60"> • 2,000+ Reviews</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-2.5">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Youtube, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-primary-foreground/8 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 border border-primary-foreground/5 hover:border-secondary"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <CollapsibleSection title="Quick Links">
              <ul className="space-y-2.5">
                {[
                  { to: "/", label: "Home" },
                  { to: "/tours", label: "Our Tours" },
                  { to: "/gallery", label: "Gallery" },
                  { to: "/about", label: "About Us" },
                  { to: "/contact", label: "Book Now" },
                  ...(isAdmin ? [{ to: "/admin", label: "Admin Panel" }] : []),
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group flex items-center gap-2 text-primary-foreground/70 hover:text-secondary transition-all text-sm py-0.5"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-secondary" />
                      <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          </motion.div>

          {/* Tours */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <CollapsibleSection title="Our Tours">
              <ul className="space-y-2.5">
                {[
                  { to: "/dubai/dhow-cruises", label: "Dhow Cruises" },
                  { to: "/dubai/shared-yacht-tours", label: "Shared Yacht Tours" },
                  { to: "/dubai/private-yacht-charter", label: "Private Yacht Charter" },
                  { to: "/dubai/megayacht-experiences", label: "Megayacht Experiences" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group flex items-center gap-2 text-primary-foreground/70 hover:text-secondary transition-all text-sm py-0.5"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-secondary" />
                      <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          </motion.div>

          {/* Contact */}
          <motion.div className="lg:col-span-4" variants={itemVariants}>
            <CollapsibleSection title="Get In Touch">
              <div className="space-y-3">
                <a
                  href={`tel:${phone}`}
                  className="group flex items-center gap-3 bg-primary-foreground/5 rounded-xl p-3 border border-primary-foreground/8 hover:border-secondary/30 hover:bg-primary-foreground/8 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/25 transition-colors">
                    <Phone className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-foreground">{phoneFormatted}</p>
                    <p className="text-[11px] text-primary-foreground/50">Call us anytime</p>
                  </div>
                </a>

                <a
                  href={`mailto:${email}`}
                  className="group flex items-center gap-3 bg-primary-foreground/5 rounded-xl p-3 border border-primary-foreground/8 hover:border-secondary/30 hover:bg-primary-foreground/8 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/25 transition-colors">
                    <Mail className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-foreground break-all">{email}</p>
                    <p className="text-[11px] text-primary-foreground/50">We reply within 1 hour</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 bg-primary-foreground/5 rounded-xl p-3 border border-primary-foreground/8">
                  <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-foreground">{address}</p>
                    <p className="text-[11px] text-primary-foreground/50">Visit our office</p>
                  </div>
                </div>
              </div>
            </CollapsibleSection>
          </motion.div>
        </div>
      </motion.div>

      {/* Payment Methods */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-6 sm:py-8 px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-primary-foreground/50 text-xs">
              <Lock className="w-3.5 h-3.5 text-secondary" />
              <span className="font-medium uppercase tracking-wider">Secure Payment</span>
            </div>
            <div className="flex items-center gap-3">
              <VisaIcon />
              <MastercardIcon />
              <AmexIcon />
            </div>
            <div className="flex items-center gap-1.5 text-primary-foreground/40 text-[11px]">
              <Shield className="w-3.5 h-3.5" />
              <span>256-bit SSL Encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10 bg-primary-foreground/[0.03]">
        <div className="container py-4 sm:py-5 px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-primary-foreground/50 text-xs text-center md:text-left">
            © 2026 Rental Yacht Dubai. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs">
            <Link to="/privacy-policy" className="text-primary-foreground/50 hover:text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-primary-foreground/50 hover:text-secondary transition-colors">
              Terms of Service
            </Link>
            <Link to="/cancellation-policy" className="text-primary-foreground/50 hover:text-secondary transition-colors">
              Cancellation
            </Link>
          </div>
        </div>
        <div className="border-t border-primary-foreground/8">
          <div className="container py-3 px-4 sm:px-6">
            <p className="text-center text-primary-foreground/40 text-[11px]">
              Created and maintained by{" "}
              <a
                href="https://www.dibull.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary/80 hover:text-secondary transition-colors font-medium"
              >
                Dibull
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-primary border-t border-primary-foreground/10 p-3 pb-safe z-40">
        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold py-3 rounded-lg w-full touch-target"
        >
          <Phone className="w-5 h-5" />
          Call Now
        </a>
      </div>
    </footer>
  );
};

export default Footer;
