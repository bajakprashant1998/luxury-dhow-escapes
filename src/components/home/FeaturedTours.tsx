import { Link } from "react-router-dom";
import { memo } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TourCard from "@/components/TourCard";
import { useFeaturedTours } from "@/hooks/useTours";

const FeaturedTours = memo(() => {
  const { data: featuredTours = [], isLoading } = useFeaturedTours();

  return (
    <section className="py-12 sm:py-24 bg-muted/20">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-12">
          <div>
            <p className="text-secondary font-bold tracking-widest uppercase mb-2 sm:mb-3 text-xs sm:text-sm">
              Popular Experiences
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              Featured Tours
            </h2>
            <p className="text-muted-foreground mt-1.5 sm:mt-2 text-sm sm:text-base max-w-xl">
              Handpicked experiences loved by thousands of guests in Dubai
            </p>
          </div>
          <Link to="/tours" className="mt-6 md:mt-0">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold group shadow-lg">
              View All Tours
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-md">
                <Skeleton className="aspect-[16/10] w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-4 pt-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tours Grid */}
        {!isLoading && featuredTours.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {featuredTours.slice(0, 12).map((tour) => (
              <div key={tour.id} className="h-full">
                <TourCard tour={tour} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && featuredTours.length === 0 && (
          <div className="text-center py-16 bg-muted/30 rounded-2xl">
            <p className="text-muted-foreground mb-4">No featured tours available at the moment.</p>
            <Link to="/tours">
              <Button>Browse All Tours</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
});

FeaturedTours.displayName = "FeaturedTours";

export default FeaturedTours;
