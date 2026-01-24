import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ChevronRight, Star, Clock, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface SavedTour {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviewCount: number;
  duration: string;
  category: string;
}

const categoryLabels: Record<string, string> = {
  "dhow-cruise": "Dhow Cruise",
  "yacht-shared": "Shared Yacht",
  "yacht-private": "Private Charter",
  "megayacht": "Megayacht",
};

const SavedTours = () => {
  const [savedTours, setSavedTours] = useState<SavedTour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSavedTours = async () => {
      setIsLoading(true);
      
      const savedTourIds: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("saved-tour-")) {
          const tourId = key.replace("saved-tour-", "");
          savedTourIds.push(tourId);
        }
      }

      if (savedTourIds.length === 0) {
        setSavedTours([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("tours")
        .select("id, slug, title, subtitle, description, price, original_price, image_url, rating, review_count, duration, category")
        .in("id", savedTourIds);

      if (error) {
        console.error("Error fetching saved tours:", error);
        setIsLoading(false);
        return;
      }

      const tours: SavedTour[] = (data || []).map((tour) => ({
        id: tour.id,
        slug: tour.slug,
        title: tour.title,
        subtitle: tour.subtitle || "",
        description: tour.description || "",
        price: tour.price,
        originalPrice: tour.original_price || tour.price,
        image: tour.image_url || "/placeholder.svg",
        rating: tour.rating || 4.5,
        reviewCount: tour.review_count || 0,
        duration: tour.duration || "2 Hours",
        category: tour.category,
      }));

      setSavedTours(tours);
      setIsLoading(false);
    };

    loadSavedTours();
  }, []);

  const handleRemove = (tourId: string, tourTitle: string) => {
    localStorage.removeItem(`saved-tour-${tourId}`);
    setSavedTours((prev) => prev.filter((t) => t.id !== tourId));
    toast({
      title: "Tour removed",
      description: `${tourTitle} has been removed from your saved tours.`,
    });
  };

  const handleClearAll = () => {
    savedTours.forEach((tour) => {
      localStorage.removeItem(`saved-tour-${tour.id}`);
    });
    setSavedTours([]);
    toast({
      title: "All tours removed",
      description: "Your saved tours list has been cleared.",
    });
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted py-3">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">Saved Tours</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-destructive fill-destructive" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Saved Tours
                </h1>
                <p className="text-muted-foreground">
                  {savedTours.length} {savedTours.length === 1 ? "tour" : "tours"} saved
                </p>
              </div>
            </div>

            {savedTours.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && savedTours.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                No saved tours yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start exploring our amazing tours and save your favorites to plan your perfect Dubai experience.
              </p>
              <Link to="/tours">
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Browse Tours
                </Button>
              </Link>
            </div>
          )}

          {/* Saved Tours Grid */}
          {!isLoading && savedTours.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedTours.map((tour) => {
                const discount = Math.round((1 - tour.price / tour.originalPrice) * 100);
                
                return (
                  <div key={tour.id} className="relative group">
                    <Link to={`/tours/${tour.slug}`}>
                      <div className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        {/* Image */}
                        <div className="relative overflow-hidden aspect-[4/3]">
                          <img
                            src={tour.image}
                            alt={tour.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                          />
                          {discount > 0 && (
                            <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold">
                              {discount}% OFF
                            </div>
                          )}
                          <div className="absolute bottom-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                            <Ship className="w-3 h-3" />
                            {categoryLabels[tour.category] || tour.category}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex-1">
                            <p className="text-secondary text-sm font-medium mb-1">{tour.subtitle}</p>
                            <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                              {tour.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                              {tour.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{tour.duration}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 fill-secondary text-secondary" />
                                <span className="font-medium">{tour.rating}</span>
                                <span className="text-muted-foreground">({tour.reviewCount.toLocaleString()})</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-end justify-between pt-4 border-t border-border mt-auto">
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-foreground">AED {tour.price.toLocaleString()}</span>
                                {tour.originalPrice > tour.price && (
                                  <span className="text-muted-foreground line-through text-sm">
                                    AED {tour.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <p className="text-muted-foreground text-xs">
                                {tour.category === "yacht-private" ? "per charter" : "per person"}
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-secondary hover:text-secondary hover:bg-secondary/10 font-semibold"
                            >
                              Details
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(tour.id, tour.title);
                      }}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/90 hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors shadow-lg z-10"
                      aria-label="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default SavedTours;
