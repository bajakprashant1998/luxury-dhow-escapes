import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Anchor, Ship, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TourSearchBoxProps {
  /** Initial search value (e.g. from URL params) */
  initialQuery?: string;
  /** If provided, triggers local filtering instead of navigation */
  onSearch?: (query: string) => void;
  /** Compact variant for Tours page (no decorative bg) */
  variant?: "hero" | "inline";
}

const popularSearches = [
  { label: "Dhow Cruise", icon: Anchor },
  { label: "Private Yacht", icon: Ship },
  { label: "Sunset Tour", icon: Sparkles },
];

const TourSearchBox = ({ initialQuery = "", onSearch, variant = "hero" }: TourSearchBoxProps) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (onSearch) {
        onSearch(trimmed);
      } else {
        navigate(trimmed ? `/tours?search=${encodeURIComponent(trimmed)}` : "/tours");
      }
    },
    [query, onSearch, navigate]
  );

  const handleQuickSearch = useCallback(
    (term: string) => {
      setQuery(term);
      if (onSearch) {
        onSearch(term);
      } else {
        navigate(`/tours?search=${encodeURIComponent(term)}`);
      }
    },
    [onSearch, navigate]
  );

  const isHero = variant === "hero";

  return (
    <section className={isHero ? "relative py-14 md:py-20 overflow-hidden bg-gradient-to-b from-muted/40 to-background" : "pb-6"}>
      {/* Decorative background for hero variant */}
      {isHero && (
        <>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          </div>
        </>
      )}

      <div className="container relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {isHero && (
            <>
              <p className="text-secondary font-bold tracking-widest uppercase mb-3 text-sm">
                Find Your Perfect Experience
              </p>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight mb-3">
                Search Tours & Cruises
              </h2>
              <p className="text-muted-foreground mb-8 text-base max-w-xl mx-auto">
                Discover dhow cruises, yacht charters, and luxury marine experiences in Dubai
              </p>
            </>
          )}

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center bg-card border-2 border-border rounded-2xl shadow-lg hover:shadow-xl hover:border-secondary/50 transition-all duration-300 focus-within:border-secondary focus-within:shadow-xl overflow-hidden">
              <div className="flex items-center pl-5 text-muted-foreground">
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <Input
                type="text"
                placeholder="Search by tour name, category, or keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-0 bg-transparent text-base md:text-lg py-5 md:py-7 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
              />
              <div className="pr-2 md:pr-3">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold rounded-xl px-6 md:px-8 h-10 md:h-12 text-sm md:text-base"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
            <span className="text-xs text-muted-foreground font-medium">Popular:</span>
            {popularSearches.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleQuickSearch(label)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-muted hover:bg-secondary/20 hover:text-secondary-foreground text-muted-foreground transition-colors"
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TourSearchBox;
