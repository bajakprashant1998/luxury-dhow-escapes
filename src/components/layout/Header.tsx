import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail, ChevronDown, Ship, Anchor, Crown, Users, Search, MessageCircle, Sparkles, Waves, PartyPopper } from "lucide-react";
import rentalYachtLogo from "@/assets/rental-yacht-logo-new.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useContactConfig } from "@/hooks/useContactConfig";
import { motion, AnimatePresence } from "framer-motion";

// Promotional messages that rotate
const promoMessages = [
  { text: "Special Offer: 15% off weekend cruises", icon: Sparkles },
  { text: "Free cancellation up to 24 hours", icon: Sparkles },
  { text: "Best Price Guaranteed on all tours", icon: Sparkles },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [promoIndex, setPromoIndex] = useState(0);
  const location = useLocation();
  const { phone, phoneFormatted, email, whatsapp } = useContactConfig();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Rotate promo messages
  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoMessages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
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

  const tourCategories = [
    {
      name: "Dhow Cruises",
      path: "/dubai/dhow-cruises",
      icon: Ship,
      description: "Traditional wooden vessel dining experience",
      badge: "Popular",
    },
    {
      name: "Shared Yacht Tours",
      path: "/dubai/shared-yacht-tours",
      icon: Users,
      description: "Affordable luxury with live BBQ",
    },
    {
      name: "Private Charters",
      path: "/dubai/private-yacht-charter",
      icon: Anchor,
      description: "Exclusive yacht experience for groups",
      badge: "New",
    },
    {
      name: "Megayacht Dining",
      path: "/dubai/megayacht-experiences",
      icon: Crown,
      description: "Premium multi-deck cruise experience",
    },
    {
      name: "Water Activities",
      path: "/dubai/water-activities",
      icon: Waves,
      description: "Jet ski, parasailing, and water sports",
      badge: "New",
    },
    {
      name: "Events & Experiences",
      path: "/dubai/yacht-events",
      icon: PartyPopper,
      description: "Birthday parties, weddings & celebrations",
      badge: "New",
    },
  ];

  const isActive = (path: string) => location.pathname === path;
  const CurrentPromoIcon = promoMessages[promoIndex].icon;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/98 backdrop-blur-lg shadow-md"
          : "bg-background/95 backdrop-blur-md"
      } border-b border-border`}
    >
      {/* Top bar with rotating promo */}
      <div className="hidden md:block bg-primary text-primary-foreground py-2 overflow-hidden">
        <div className="container flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 hover:text-secondary transition-colors group"
            >
              <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {phoneFormatted}
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 hover:text-secondary transition-colors group"
            >
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {email}
            </a>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-secondary transition-colors group"
              >
                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline">WhatsApp</span>
              </a>
            )}
          </div>

          {/* Rotating Promo Banner */}
          <div className="flex items-center gap-4 text-secondary font-medium min-w-[280px] justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={promoIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                <CurrentPromoIcon className="w-4 h-4" />
                <span>{promoMessages[promoIndex].text}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container py-0">
        <div className="flex items-center justify-between py-[10px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={rentalYachtLogo}
              alt="Rental Yacht Dubai"
              className="w-14 h-14 md:w-16 md:h-16 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl md:text-2xl text-primary leading-tight tracking-tight">
                Rental Yacht
              </span>
              <span className="text-xs md:text-sm text-muted-foreground tracking-[0.2em] uppercase font-medium">
                Dubai
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <NavigationMenu key={link.path}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger
                        className={`text-sm font-medium transition-colors bg-transparent hover:bg-muted/50 px-4 py-2 rounded-lg
                        ${isActive(link.path) ? "text-secondary" : "text-foreground"}`}
                      >
                        {link.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-[420px] p-4 grid gap-2">
                          <div className="mb-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Explore Our Experiences
                            </p>
                          </div>
                          {tourCategories.map((category) => (
                            <NavigationMenuLink asChild key={category.path}>
                              <Link
                                to={category.path}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group relative"
                              >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors shrink-0">
                                  <category.icon className="w-5 h-5 text-secondary" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-foreground group-hover:text-secondary transition-colors">
                                      {category.name}
                                    </p>
                                    {category.badge && (
                                      <span
                                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                          category.badge === "New"
                                            ? "bg-emerald-500/20 text-emerald-600"
                                            : "bg-secondary/20 text-secondary"
                                        }`}
                                      >
                                        {category.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {category.description}
                                  </p>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                          <div className="mt-2 pt-3 border-t border-border">
                            <Link
                              to="/tours"
                              className="flex items-center justify-center gap-2 text-sm font-medium text-secondary hover:underline"
                            >
                              View All Tours →
                            </Link>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-medium transition-all px-4 py-2 rounded-lg hover:bg-muted/50 group
                    ${isActive(link.path) ? "text-secondary bg-secondary/10" : "text-foreground hover:text-secondary"}`}
                >
                  {link.name}
                  {/* Hover underline animation */}
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              )
            )}
          </div>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search button */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted/50"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>

            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">{phoneFormatted}</span>
            </a>
            <Link to="/contact">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-6 shadow-md hover:shadow-lg transition-all hover:scale-105">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>
            <button
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
              transition={{ duration: 0.3 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-xl overflow-hidden"
            >
              <div className="container py-4 sm:py-6 flex flex-col gap-1 sm:gap-2 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-base font-medium py-3 px-4 rounded-lg transition-colors touch-target
                      ${
                        isActive(link.path)
                          ? "text-secondary bg-secondary/10"
                          : "text-foreground hover:bg-muted/50 hover:text-secondary"
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Tour Categories */}
                <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2 sm:mb-3">
                    Quick Links
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {tourCategories.map((category) => (
                      <Link
                        key={category.path}
                        to={category.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors touch-target relative"
                      >
                        <category.icon className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium truncate">
                          {category.name}
                        </span>
                        {category.badge && (
                          <span
                            className={`absolute top-1 right-1 text-[8px] font-semibold px-1 py-0.5 rounded-full ${
                              category.badge === "New"
                                ? "bg-emerald-500/20 text-emerald-600"
                                : "bg-secondary/20 text-secondary"
                            }`}
                          >
                            {category.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Social links in mobile menu */}
                <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-border">
                  <div className="flex gap-3 px-4 mb-4">
                    {whatsapp && (
                      <a
                        href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-border space-y-3 pb-safe">
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2 touch-target"
                  >
                    <Phone className="w-4 h-4" />
                    {phoneFormatted}
                  </a>
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold h-12 touch-target">
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Search Tours</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="search"
              placeholder="Search for tours, experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button type="submit" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Search className="w-4 h-4" />
            </Button>
          </form>
          <div className="text-sm text-muted-foreground mt-2">
            <p className="font-medium mb-2">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {["Dhow Cruise", "Private Yacht", "Sunset Tour", "BBQ"].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setSearchQuery(term);
                    window.location.href = `/tours?search=${encodeURIComponent(term)}`;
                  }}
                  className="px-3 py-1 rounded-full bg-muted hover:bg-secondary/20 hover:text-secondary transition-colors text-xs"
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
