import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Filter, Ship, Anchor, Crown, Users, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/layout/Layout";
import TourCard from "@/components/TourCard";
import { useTours } from "@/hooks/useTours";
import { useActiveCategories } from "@/hooks/useCategories";
import { getCategoryFromPath, getCategoryUrl } from "@/lib/seoUtils";

const categoryIcons: Record<string, React.ReactNode> = {
  "all": <Filter className="w-4 h-4" />,
  "dhow-cruise": <Anchor className="w-4 h-4" />,
  "yacht-shared": <Users className="w-4 h-4" />,
  "yacht-private": <Ship className="w-4 h-4" />,
  "megayacht": <Crown className="w-4 h-4" />,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.2, 1] as const,
    },
  },
};

const Tours = () => {
  const { categoryPath } = useParams<{ categoryPath?: string }>();
  const [searchParams] = useSearchParams();
  
  // Determine selected category from URL
  const getCategoryFromUrl = (): string => {
    // New SEO-friendly URL: /dubai/:categoryPath
    if (categoryPath) {
      return getCategoryFromPath(categoryPath);
    }
    // Legacy URL: /tours?category=xxx
    const queryCategory = searchParams.get("category");
    if (queryCategory) {
      return queryCategory;
    }
    return "all";
  };

  const [selectedCategory, setSelectedCategory] = useState(getCategoryFromUrl());
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high">("popular");
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const { data: tours = [], isLoading: toursLoading, error: toursError } = useTours();
  const { data: dbCategories = [], isLoading: categoriesLoading } = useActiveCategories();

  // Update selected category when URL changes
  useEffect(() => {
    setSelectedCategory(getCategoryFromUrl());
  }, [categoryPath, searchParams]);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build categories array with "All Tours" option using SEO-friendly URLs
  const categories: Array<{ id: string; label: string; slug: string; description?: string | null; count?: number; url: string }> = [
    { id: "all", label: "All Tours", slug: "all", count: tours.length, url: "/tours" },
    ...dbCategories.map((cat) => ({
      id: cat.slug,
      label: cat.name,
      slug: cat.slug,
      description: cat.description,
      count: tours.filter(t => t.category === cat.slug).length,
      url: getCategoryUrl(cat.slug),
    })),
  ];

  const filteredTours = selectedCategory === "all" 
    ? tours 
    : tours.filter(tour => tour.category === selectedCategory);

  const sortedTours = [...filteredTours].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "popular":
      default:
        return b.reviewCount - a.reviewCount;
    }
  });

  // Get selected category description
  const selectedCategoryData = categories.find((c) => c.id === selectedCategory);

  const isLoading = toursLoading || categoriesLoading;

  return (
    <Layout>
      {/* Hero Section with Parallax Effect */}
      <section className="relative py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden">
        {/* Background with parallax */}
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary z-10" />
          <img
            src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1920"
            alt="Dubai Marina"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-secondary/30 rounded-full"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: "100%",
                opacity: 0 
              }}
              animate={{ 
                y: "-20%",
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="container relative z-20">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.p 
              className="text-secondary font-semibold tracking-wider uppercase mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Explore Our Experiences
            </motion.p>
            <motion.h1 
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Dhow Cruises & Yacht Charters
            </motion.h1>
            <motion.p 
              className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Choose from our selection of carefully curated cruise experiences. 
              From traditional dhow cruises to luxury private yacht charters, 
              find the perfect voyage for your Dubai adventure.
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-primary-foreground/40 rounded-full flex items-start justify-center p-1"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className="w-1.5 h-2.5 bg-secondary rounded-full"
              animate={{ opacity: [1, 0.3, 1], y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="py-6 sm:py-8 bg-cream border-b border-border">
        <div className="container px-4 sm:px-6">
          {/* Horizontal scroll on mobile, centered wrap on desktop */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide snap-x-mandatory pb-2 sm:pb-0 sm:flex-wrap sm:justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
            {categoriesLoading ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-10 w-28 sm:w-32 rounded-full flex-shrink-0" />
                ))}
              </>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  to={category.url}
                >
                  <motion.button
                    className={`relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full font-medium transition-all flex-shrink-0 snap-start touch-target text-sm sm:text-base whitespace-nowrap ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-card text-foreground hover:bg-muted border border-border"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    layout
                  >
                    {categoryIcons[category.id] || <Filter className="w-4 h-4" />}
                    <span>{category.label}</span>
                    {category.count !== undefined && category.count > 0 && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        selectedCategory === category.id 
                          ? "bg-primary-foreground/20" 
                          : "bg-muted"
                      }`}>
                        {category.count}
                      </span>
                    )}
                    {selectedCategory === category.id && (
                      <motion.div
                        className="absolute inset-0 bg-primary rounded-full -z-10"
                        layoutId="categoryBackground"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-8 sm:py-12">
        <div className="container px-4 sm:px-6">
          {/* Stats Bar */}
          <motion.div 
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm sm:text-base text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{sortedTours.length}</span> experiences
            </p>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary flex-1 sm:flex-none h-10 touch-target transition-all hover:border-secondary"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </motion.div>

          {/* Category Description */}
          <AnimatePresence mode="wait">
            {selectedCategory !== "all" && selectedCategoryData?.description && (
              <motion.div 
                key={selectedCategory}
                className="mb-8 p-6 bg-gradient-to-r from-cream to-cream/50 rounded-xl border border-border/50"
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{selectedCategoryData.label}</span> — {selectedCategoryData.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div 
                  key={i} 
                  className="bg-card rounded-xl overflow-hidden shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Skeleton className="aspect-[4/3] w-full shimmer" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-4 pt-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex justify-between pt-4 border-t border-border">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Error State */}
          {toursError && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-destructive mb-4">Failed to load tours. Please try again.</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </motion.div>
          )}

          {/* Tours Grid with Staggered Animation */}
          {!isLoading && !toursError && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={selectedCategory} // Re-animate when category changes
            >
              <AnimatePresence mode="popLayout">
                {sortedTours.map((tour, index) => (
                  <motion.div
                    key={tour.id}
                    variants={itemVariants}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TourCard tour={tour} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && !toursError && sortedTours.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted-foreground">No tours found in this category.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Special Requests */}
      <section className="py-16 bg-cream relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="container relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Looking for Something Special?
            </h2>
            <p className="text-muted-foreground mb-8">
              Whether it's a surprise proposal, corporate event, or custom celebration, 
              we can create a tailored experience just for you. Contact us to discuss your requirements.
            </p>
            <Link to="/contact">
              <Button 
                size="lg" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold group"
              >
                Request Custom Package
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-40 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Tours;
