import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail, ChevronDown, ChevronRight, Ship, Anchor, Crown, Users, Search, MessageCircle, Sparkles, Waves, PartyPopper, ArrowRight, Star, MapPin } from "lucide-react";
import rentalYachtLogo from "@/assets/rental-yacht-logo-new.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useContactConfig } from "@/hooks/useContactConfig";
import { motion, AnimatePresence } from "framer-motion";

const promoMessages = [
  { text: "Special Offer: 15% off weekend cruises", icon: Sparkles },
  { text: "Free cancellation up to 24 hours", icon: Sparkles },
  { text: "Best Price Guaranteed on all tours", icon: Sparkles },
];

const tourCategories = [
  {
    name: "Dhow Cruises",
    path: "/dubai/dhow-cruises",
    icon: Ship,
    description: "Traditional wooden vessel dining with live entertainment",
    badge: "Popular",
    image: "/assets/tours/dhow-cruise-marina.jpg",
  },
  {
    name: "Shared Yacht Tours",
    path: "/dubai/shared-yacht-tours",
    icon: Users,
    description: "Affordable luxury with live BBQ & swimming",
    image: "/assets/tours/yacht-bbq-experience.jpg",
  },
  {
    name: "Private Charters",
    path: "/dubai/private-yacht-charter",
    icon: Anchor,
    description: "Exclusive yacht experience for your group",
    badge: "Premium",
    image: "/assets/tours/private-yacht-55ft.jpg",
  },
  {
    name: "Megayacht Dining",
    path: "/dubai/megayacht-experiences",
    icon: Crown,
    description: "Premium multi-deck cruise experience",
    image: "/assets/tours/megayacht-burj-khalifa.jpg",
  },
  {
    name: "Water Activities",
    path: "/dubai/water-activities",
    icon: Waves,
    description: "Jet ski, parasailing & water sports",
    badge: "New",
    image: "/assets/tours/yacht-swimming.jpg",
  },
  {
    name: "Events & Celebrations",
    path: "/dubai/yacht-events",
    icon: PartyPopper,
    description: "Birthdays, weddings & special occasions",
    image: "/assets/tours/yacht-sunset-tour.jpg",
  },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [promoIndex, setPromoIndex] = useState(0);
  const [isToursOpen, setIsToursOpen] = useState(false);
  const [mobileToursOpen, setMobileToursOpen] = useState(false);
  const location = useLocation();
  const { phone, phoneFormatted, email, whatsapp } = useContactConfig();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoMessages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsToursOpen(false);
    setMobileToursOpen(false);
  }, [location.pathname]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/tours?search=${encodeURIComponent(searchQuery.trim())}`;
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  }, [searchQuery]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Tours", path: "/tours", hasDropdown: true },
    { name: "Gallery", path: "/gallery" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;
  const CurrentPromoIcon = promoMessages[promoIndex].icon;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-xl shadow-lg shadow-primary/5"
          : "bg-background/90 backdrop-blur-md"
      }`}
    >
      {/* Top promo bar */}
      <div className="hidden md:block bg-primary text-primary-foreground py-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary" />
        <div className="container relative flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-secondary transition-colors group">
              <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">{phoneFormatted}</span>
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-secondary transition-colors group">
              <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">{email}</span>
            </a>
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-secondary transition-colors group">
                <MessageCircle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline text-xs font-medium">WhatsApp</span>
              </a>
            )}
          </div>
          <div className="flex items-center gap-2 text-secondary font-medium min-w-[260px] justify-end">
            <AnimatePresence mode="wait">
              <motion.div key={promoIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="flex items-center gap-2 text-xs">
                <CurrentPromoIcon className="w-3.5 h-3.5" />
                <span>{promoMessages[promoIndex].text}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group relative z-10">
            <div className="relative">
              <img src={rentalYachtLogo} alt="Rental Yacht Dubai" className="w-11 h-11 md:w-13 md:h-13 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg md:text-xl text-primary leading-none tracking-tight">
                Rental Yacht
              </span>
              <span className="text-[10px] md:text-xs text-muted-foreground tracking-[0.25em] uppercase font-semibold">
                Dubai
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => setIsToursOpen(true)}
                  onMouseLeave={() => setIsToursOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 group
                      ${isActive(link.path) || isToursOpen ? "text-secondary bg-secondary/8" : "text-foreground hover:text-secondary hover:bg-muted/60"}`}
                  >
                    {link.name}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isToursOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Mega Menu Dropdown */}
                  <AnimatePresence>
                    {isToursOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full -left-32 pt-3 z-50"
                      >
                        <div className="w-[680px] bg-background/98 backdrop-blur-2xl rounded-2xl border border-border/60 shadow-2xl shadow-primary/10 overflow-hidden">
                          {/* Header */}
                          <div className="px-6 pt-5 pb-3 flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-bold text-foreground">Explore Experiences</h3>
                              <p className="text-xs text-muted-foreground mt-0.5">Discover Dubai's finest maritime adventures</p>
                            </div>
                            <Link
                              to="/tours"
                              className="text-xs font-semibold text-secondary hover:text-secondary/80 flex items-center gap-1 transition-colors"
                            >
                              View All <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>

                          {/* Cards Grid */}
                          <div className="px-4 pb-4 grid grid-cols-2 gap-2.5">
                            {tourCategories.map((category, idx) => (
                              <Link
                                key={category.path}
                                to={category.path}
                                className="group/card relative flex gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200"
                              >
                                {/* Thumbnail */}
                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-border/40 group-hover/card:ring-secondary/30 transition-all">
                                  <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                  />
                                </div>
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <category.icon className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                                    <span className="text-sm font-semibold text-foreground group-hover/card:text-secondary transition-colors truncate">
                                      {category.name}
                                    </span>
                                    {category.badge && (
                                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none flex-shrink-0 ${
                                        category.badge === "New" ? "bg-emerald-500/15 text-emerald-600" :
                                        category.badge === "Premium" ? "bg-secondary/15 text-secondary" :
                                        "bg-secondary/15 text-secondary"
                                      }`}>
                                        {category.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                                    {category.description}
                                  </p>
                                </div>
                                {/* Arrow */}
                                <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover/card:text-secondary group-hover/card:translate-x-0.5 transition-all self-center flex-shrink-0" />
                              </Link>
                            ))}
                          </div>

                          {/* Footer CTA */}
                          <div className="px-4 py-3 bg-muted/30 border-t border-border/40 flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-secondary" /> 4.9 Rating</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-secondary" /> Dubai Marina</span>
                            </div>
                            <Link to="/contact">
                              <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-8 px-4 text-xs font-semibold rounded-lg shadow-sm">
                                Book a Tour
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 group
                    ${isActive(link.path) ? "text-secondary bg-secondary/8" : "text-foreground hover:text-secondary hover:bg-muted/60"}`}
                >
                  {link.name}
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondary scale-0 group-hover:scale-100 transition-transform" />
                  {isActive(link.path) && (
                    <motion.span layoutId="activeNav" className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondary" />
                  )}
                </Link>
              )
            )}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted/60 w-10 h-10" onClick={() => setIsSearchOpen(true)}>
              <Search className="w-4.5 h-4.5" />
            </Button>
            <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3">
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline text-xs">{phoneFormatted}</span>
            </a>
            <Link to="/contact">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-6 h-10 rounded-xl shadow-md shadow-secondary/20 hover:shadow-lg hover:shadow-secondary/30 hover:scale-[1.02] transition-all duration-200 text-sm">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile buttons */}
          <div className="flex lg:hidden items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-xl w-10 h-10" onClick={() => setIsSearchOpen(true)}>
              <Search className="w-5 h-5" />
            </Button>
            <button className="p-2.5 rounded-xl hover:bg-muted/50 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-border/60 shadow-2xl shadow-primary/10 overflow-hidden"
            >
              <div className="container py-4 flex flex-col gap-1 px-4 max-h-[80vh] overflow-y-auto">
                {navLinks.map((link) =>
                  link.hasDropdown ? (
                    <div key={link.path}>
                      <button
                        onClick={() => setMobileToursOpen(!mobileToursOpen)}
                        className={`w-full flex items-center justify-between text-base font-semibold py-3.5 px-4 rounded-xl transition-all touch-target
                          ${mobileToursOpen ? "text-secondary bg-secondary/8" : "text-foreground hover:bg-muted/50"}`}
                      >
                        {link.name}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileToursOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {mobileToursOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="py-2 space-y-1 px-1">
                              {tourCategories.map((category) => (
                                <Link
                                  key={category.path}
                                  to={category.path}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors touch-target group"
                                >
                                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-border/40">
                                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" loading="lazy" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-sm font-semibold text-foreground group-hover:text-secondary transition-colors">{category.name}</span>
                                      {category.badge && (
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                          category.badge === "New" ? "bg-emerald-500/15 text-emerald-600" : "bg-secondary/15 text-secondary"
                                        }`}>{category.badge}</span>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">{category.description}</p>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                                </Link>
                              ))}
                              <Link
                                to="/tours"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-secondary"
                              >
                                View All Tours <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`text-base font-semibold py-3.5 px-4 rounded-xl transition-all touch-target
                        ${isActive(link.path) ? "text-secondary bg-secondary/8" : "text-foreground hover:bg-muted/50 hover:text-secondary"}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )
                )}

                {/* Mobile contact & CTA */}
                <div className="mt-3 pt-3 border-t border-border/40 space-y-3 pb-safe">
                  <div className="flex items-center gap-4 px-4">
                    <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors touch-target">
                      <Phone className="w-4 h-4" /> {phoneFormatted}
                    </a>
                    {whatsapp && (
                      <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors touch-target">
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </a>
                    )}
                  </div>
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold h-12 rounded-xl shadow-md shadow-secondary/20 touch-target text-sm">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search Modal */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Search Tours</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input type="search" placeholder="Search for tours, experiences..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 rounded-xl" autoFocus />
            <Button type="submit" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl">
              <Search className="w-4 h-4" />
            </Button>
          </form>
          <div className="text-sm text-muted-foreground mt-2">
            <p className="font-semibold mb-2 text-xs uppercase tracking-wider">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {["Dhow Cruise", "Private Yacht", "Sunset Tour", "BBQ"].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setSearchQuery(term);
                    window.location.href = `/tours?search=${encodeURIComponent(term)}`;
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-muted hover:bg-secondary/15 hover:text-secondary transition-colors text-xs font-medium"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
