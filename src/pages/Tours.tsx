import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Filter, Ship, Anchor, Crown, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/layout/Layout";
import TourCard from "@/components/TourCard";
import { useTours, categories } from "@/hooks/useTours";

const categoryIcons: Record<string, React.ReactNode> = {
  "all": <Filter className="w-4 h-4" />,
  "dhow-cruise": <Anchor className="w-4 h-4" />,
  "yacht-shared": <Users className="w-4 h-4" />,
  "yacht-private": <Ship className="w-4 h-4" />,
  "megayacht": <Crown className="w-4 h-4" />,
};

const Tours = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high">("popular");
  
  const { data: tours = [], isLoading, error } = useTours();

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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1920"
            alt="Dubai Marina"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <p className="text-secondary font-semibold tracking-wider uppercase mb-4">
              Explore Our Experiences
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Dhow Cruises & Yacht Charters
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Choose from our selection of carefully curated cruise experiences. 
              From traditional dhow cruises to luxury private yacht charters, 
              find the perfect voyage for your Dubai adventure.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-cream border-b border-border">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card text-foreground hover:bg-muted border border-border"
                }`}
              >
                {categoryIcons[category.id]}
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-12">
        <div className="container">
          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{sortedTours.length}</span> experiences
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Description */}
          {selectedCategory !== "all" && (
            <div className="mb-8 p-6 bg-cream rounded-xl">
              {selectedCategory === "dhow-cruise" && (
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Traditional Dhow Cruises</span> — Experience the timeless charm of Arabian wooden vessels as you cruise through Dubai Marina with dinner, entertainment, and stunning skyline views.
                </p>
              )}
              {selectedCategory === "yacht-shared" && (
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Shared Yacht Experiences</span> — Join fellow travelers aboard luxury yachts for affordable yet premium experiences with live BBQ, swimming, and spectacular views.
                </p>
              )}
              {selectedCategory === "yacht-private" && (
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Private Yacht Charters</span> — Exclusive use of the entire yacht for your group. Perfect for celebrations, corporate events, or intimate gatherings.
                </p>
              )}
              {selectedCategory === "megayacht" && (
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Megayacht Dining</span> — The ultimate luxury experience aboard magnificent multi-deck vessels with lavish buffets and world-class service.
                </p>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-xl overflow-hidden shadow-md">
                  <Skeleton className="aspect-[4/3] w-full" />
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
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Failed to load tours. Please try again.</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          )}

          {/* Tours Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}

          {!isLoading && !error && sortedTours.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tours found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Special Requests */}
      <section className="py-16 bg-cream">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Looking for Something Special?
            </h2>
            <p className="text-muted-foreground mb-8">
              Whether it's a surprise proposal, corporate event, or custom celebration, 
              we can create a tailored experience just for you. Contact us to discuss your requirements.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold">
                Request Custom Package
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Tours;
