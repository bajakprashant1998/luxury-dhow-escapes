import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Anchor, Ship, Sparkles, MapPin, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTours } from "@/hooks/useTours";

interface TourSearchBoxProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  variant?: "hero" | "inline";
}

const popularSearches = [
  { label: "Dhow Cruise", icon: Anchor },
  { label: "Private Yacht", icon: Ship },
  { label: "Sunset Tour", icon: Sparkles },
];

const TourSearchBox = ({ initialQuery = "", onSearch, variant = "hero" }: TourSearchBoxProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { data: tours = [] } = useTours();

  // Compute suggestions
  const suggestions = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return tours
      .filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description?.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, tours]);

  const showDropdown = isFocused && suggestions.length > 0;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset active index when suggestions change
  useEffect(() => { setActiveIndex(-1); }, [suggestions]);

  const executeSearch = useCallback(
    (term: string) => {
      setIsFocused(false);
      if (onSearch) {
        onSearch(term);
      } else {
        navigate(term ? `/tours?search=${encodeURIComponent(term)}` : "/tours");
      }
    },
    [onSearch, navigate]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        setQuery(suggestions[activeIndex].title);
        executeSearch(suggestions[activeIndex].title);
      } else {
        executeSearch(query.trim());
      }
    },
    [query, activeIndex, suggestions, executeSearch]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(i => (i < suggestions.length - 1 ? i + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(i => (i > 0 ? i - 1 : suggestions.length - 1));
      } else if (e.key === "Escape") {
        setIsFocused(false);
      }
    },
    [showDropdown, suggestions.length]
  );

  const handleSelectSuggestion = useCallback(
    (title: string) => {
      setQuery(title);
      executeSearch(title);
    },
    [executeSearch]
  );

  const handleQuickSearch = useCallback(
    (term: string) => {
      setQuery(term);
      executeSearch(term);
    },
    [executeSearch]
  );

  const isHero = variant === "hero";

  return (
    <section className={isHero ? "relative py-14 md:py-20 overflow-hidden bg-gradient-to-b from-muted/40 to-background" : "pb-6"}>
      {isHero && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>
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

          {/* Search Form with Autocomplete */}
          <div ref={wrapperRef} className="relative">
            <form onSubmit={handleSubmit}>
              <div className={`flex items-center bg-card border-2 border-border shadow-lg hover:shadow-xl hover:border-secondary/50 transition-all duration-300 focus-within:border-secondary focus-within:shadow-xl overflow-hidden ${showDropdown ? "rounded-t-2xl rounded-b-none" : "rounded-2xl"}`}>
                <div className="flex items-center pl-5 text-muted-foreground">
                  <Search className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <Input
                  type="text"
                  placeholder="Search by tour name, category, or keyword..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onKeyDown={handleKeyDown}
                  role="combobox"
                  aria-expanded={showDropdown}
                  aria-autocomplete="list"
                  aria-controls="search-suggestions"
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

            {/* Autocomplete Dropdown */}
            <AnimatePresence>
              {showDropdown && (
                <motion.ul
                  id="search-suggestions"
                  role="listbox"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 z-50 bg-card border-2 border-t-0 border-secondary rounded-b-2xl shadow-xl max-h-80 overflow-y-auto"
                >
                  {suggestions.map((tour, index) => (
                    <li
                      key={tour.id}
                      role="option"
                      aria-selected={index === activeIndex}
                      onMouseDown={() => handleSelectSuggestion(tour.title)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors text-left ${
                        index === activeIndex
                          ? "bg-secondary/15"
                          : "hover:bg-muted/60"
                      } ${index < suggestions.length - 1 ? "border-b border-border/50" : ""}`}
                    >
                      {/* Tour thumbnail */}
                      {tour.image ? (
                        <img
                          src={tour.image}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Ship className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">
                          {tour.title}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          {tour.duration && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {tour.duration}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Dubai
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-secondary flex-shrink-0">
                        AED {tour.price}
                      </span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

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
