import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, Shield, Lock, CreditCard } from "lucide-react";
import rentalYachtLogo from "@/assets/rental-yacht-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_CACHE_KEY, ADMIN_USER_KEY } from "@/components/admin/AdminLayout";
import { useContactConfig } from "@/hooks/useContactConfig";

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

const SecurePaymentIcon = () => (
  <div className="relative">
    <Shield className="w-8 h-8 text-secondary" />
    <Lock className="w-3 h-3 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
  </div>
);

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
      try {
        const userId = sessionStorage.getItem(ADMIN_USER_KEY);
        const verified = sessionStorage.getItem(ADMIN_CACHE_KEY);
        if (userId && verified === "true") {
          setIsAdmin(true);
          return true;
        }
      } catch {
        // Ignore storage errors
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
            setTimeout(() => {
              checkAdminStatus(session.user.id);
            }, 0);
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

  const paymentMethods = [
    {
      name: "Secure Checkout",
      description: "256-bit SSL",
      icon: <SecurePaymentIcon />,
    },
    {
      name: "Visa",
      description: "Accepted",
      icon: <VisaIcon />,
    },
    {
      name: "Mastercard",
      description: "Accepted",
      icon: <MastercardIcon />,
    },
    {
      name: "American Express",
      description: "Accepted",
      icon: <AmexIcon />,
    },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container py-10 sm:py-16 px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <img 
                src={rentalYachtLogo} 
                alt="Rental Yacht Dubai" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg"
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg sm:text-xl text-secondary leading-tight">Rental Yacht</span>
                <span className="text-[10px] sm:text-xs text-primary-foreground/70 tracking-wider uppercase">Dubai</span>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-xs sm:text-sm leading-relaxed">
              Experience the magic of Dubai with our premium yacht charters and dhow cruise experiences. 
              Creating unforgettable memories on the waters of Dubai Marina.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 hover:scale-110 touch-target">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 hover:scale-110 touch-target">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 hover:scale-110 touch-target">
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 hover:scale-110 touch-target">
                <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-base sm:text-lg font-semibold text-secondary mb-4 sm:mb-6">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target hover:translate-x-1 transition-transform duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target hover:translate-x-1 transition-transform duration-200">
                  Our Tours
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target hover:translate-x-1 transition-transform duration-200">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target hover:translate-x-1 transition-transform duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target hover:translate-x-1 transition-transform duration-200">
                  Book Now
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target hover:translate-x-1 transition-transform duration-200">
                    Admin Panel
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Tours */}
          <div className="hidden sm:block">
            <h4 className="font-display text-base sm:text-lg font-semibold text-secondary mb-4 sm:mb-6">Our Tours</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/tours/dhow-cruise-marina" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target hover:translate-x-1 transition-transform duration-200">
                  Dhow Cruise Marina
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target hover:translate-x-1 transition-transform duration-200">
                  Upper Deck Experience
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target hover:translate-x-1 transition-transform duration-200">
                  Private Charter
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target hover:translate-x-1 transition-transform duration-200">
                  Sunset Cruise
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-base sm:text-lg font-semibold text-secondary mb-4 sm:mb-6">Contact Us</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <a href={`tel:${phone}`} className="flex items-start gap-2 sm:gap-3 text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 touch-target group">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{phoneFormatted}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-2 sm:gap-3 text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 touch-target group">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="break-all">{email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 sm:gap-3 text-primary-foreground/80 text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                  <span>{address}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-8 sm:py-10 px-4 sm:px-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-secondary" />
              <h4 className="font-display text-sm sm:text-base font-semibold text-secondary uppercase tracking-wider">
                Secure Payment
              </h4>
            </div>
            <p className="text-primary-foreground/60 text-xs">
              Your transactions are protected with industry-leading encryption
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {paymentMethods.map((method, index) => (
              <div
                key={method.name}
                className="group relative bg-primary-foreground/5 border border-secondary/20 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-secondary/50 hover:bg-primary-foreground/10 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {method.icon}
                </div>
                <div className="text-center">
                  <p className="text-primary-foreground/90 text-xs sm:text-sm font-medium">
                    {method.name}
                  </p>
                  <p className="text-primary-foreground/50 text-[10px] sm:text-xs">
                    {method.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10 bg-primary-foreground/5">
        <div className="container py-4 sm:py-6 px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-4">
            <p className="text-primary-foreground/60 text-xs sm:text-sm text-center md:text-left">
              © 2024 Rental Yacht Dubai. All rights reserved.
            </p>
            <div className="hidden sm:flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-secondary/60" />
              <span className="text-primary-foreground/40 text-xs">SSL Encrypted</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors py-1 touch-target">
              Privacy Policy
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors py-1 touch-target">
              Terms of Service
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors py-1 touch-target">
              Cancellation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
