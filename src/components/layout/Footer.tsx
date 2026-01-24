import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import rentalYachtLogo from "@/assets/rental-yacht-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_CACHE_KEY, ADMIN_USER_KEY } from "@/components/admin/AdminLayout";

const Footer = () => {
  const [isAdmin, setIsAdmin] = useState(false);

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

    // Check cache first for instant display
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
          // Check cache first
          if (!checkCache()) {
            // Defer database call
            setTimeout(() => {
              checkAdminStatus(session.user.id);
            }, 0);
          }
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Initial check
    const init = async () => {
      // Try cache first
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
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={rentalYachtLogo} 
                alt="Rental Yacht Dubai" 
                className="w-12 h-12 object-contain rounded-lg"
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-secondary leading-tight">Rental Yacht</span>
                <span className="text-xs text-primary-foreground/70 tracking-wider uppercase">Dubai</span>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Experience the magic of Dubai with our premium yacht charters and dhow cruise experiences. 
              Creating unforgettable memories on the waters of Dubai Marina.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-secondary mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Our Tours
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Book Now
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                    Admin Panel
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Tours */}
          <div>
            <h4 className="font-display text-lg font-semibold text-secondary mb-6">Our Tours</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/tours/dhow-cruise-marina" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Dhow Cruise Marina
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Upper Deck Experience
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Private Charter
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Sunset Cruise
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-secondary mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+971501234567" className="flex items-start gap-3 text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>+971 50 123 4567</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@rentalyachtdubai.com" className="flex items-start gap-3 text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>info@rentalyachtdubai.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-primary-foreground/80 text-sm">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Dubai Marina Walk, Dubai, United Arab Emirates</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 Rental Yacht Dubai. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors">
              Cancellation Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
