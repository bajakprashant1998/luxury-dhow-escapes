import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail, ChevronDown, Ship, Anchor, Crown, Users } from "lucide-react";
import rentalYachtLogo from "@/assets/rental-yacht-logo.png";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useContactConfig } from "@/hooks/useContactConfig";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { phone, phoneFormatted, email } = useContactConfig();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      path: "/tours?category=dhow-cruise", 
      icon: Ship,
      description: "Traditional wooden vessel dining experience"
    },
    { 
      name: "Shared Yacht Tours", 
      path: "/tours?category=yacht-shared", 
      icon: Users,
      description: "Affordable luxury with live BBQ"
    },
    { 
      name: "Private Charters", 
      path: "/tours?category=yacht-private", 
      icon: Anchor,
      description: "Exclusive yacht experience for groups"
    },
    { 
      name: "Megayacht Dining", 
      path: "/tours?category=megayacht", 
      icon: Crown,
      description: "Premium multi-deck cruise experience"
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-background/98 backdrop-blur-lg shadow-md" 
        : "bg-background/95 backdrop-blur-md"
    } border-b border-border`}>
      {/* Top bar */}
      <div className="hidden md:block bg-primary text-primary-foreground py-2">
        <div className="container flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-secondary transition-colors">
              <Phone className="w-4 h-4" />
              {phoneFormatted}
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-secondary transition-colors">
              <Mail className="w-4 h-4" />
              {email}
            </a>
          </div>
          <div className="flex items-center gap-4 text-secondary font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Instant Confirmation
            </span>
            <span>•</span>
            <span>Best Price Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={rentalYachtLogo} 
              alt="Rental Yacht Dubai" 
              className="w-11 h-11 object-contain rounded-lg"
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl text-primary leading-tight tracking-tight">Rental Yacht</span>
              <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase font-medium">Dubai</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <NavigationMenu key={link.path}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className={`text-sm font-medium transition-colors bg-transparent hover:bg-muted/50 px-4 py-2 rounded-lg
                        ${isActive(link.path) ? "text-secondary" : "text-foreground"}`}>
                        {link.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-[400px] p-4 grid gap-2">
                          <div className="mb-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Explore Our Experiences</p>
                          </div>
                          {tourCategories.map((category) => (
                            <NavigationMenuLink asChild key={category.path}>
                              <Link
                                to={category.path}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                              >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors shrink-0">
                                  <category.icon className="w-5 h-5 text-secondary" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground group-hover:text-secondary transition-colors">{category.name}</p>
                                  <p className="text-sm text-muted-foreground">{category.description}</p>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                          <div className="mt-2 pt-3 border-t border-border">
                            <Link to="/tours" className="flex items-center justify-center gap-2 text-sm font-medium text-secondary hover:underline">
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
                  className={`text-sm font-medium transition-all px-4 py-2 rounded-lg hover:bg-muted/50
                    ${isActive(link.path) 
                      ? "text-secondary bg-secondary/10" 
                      : "text-foreground hover:text-secondary"
                    }`}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">{phoneFormatted}</span>
            </a>
            <Link to="/contact">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-6 shadow-md hover:shadow-lg transition-all">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-xl animate-fade-in">
            <div className="container py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-medium py-3 px-4 rounded-lg transition-colors
                    ${isActive(link.path) ? "text-secondary bg-secondary/10" : "text-foreground hover:bg-muted/50 hover:text-secondary"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile Tour Categories */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-3">Quick Links</p>
                <div className="grid grid-cols-2 gap-2">
                  {tourCategories.map((category) => (
                    <Link 
                      key={category.path}
                      to={category.path} 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <category.icon className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm text-muted-foreground px-4">
                  <Phone className="w-4 h-4" />
                  {phoneFormatted}
                </a>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold h-12">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
