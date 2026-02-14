import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, Users, ChevronRight, Ship, Ticket, Heart, Award, TrendingUp, Waves, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Tour } from "@/lib/tourMapper";
import { getTourUrl } from "@/lib/seoUtils";
import { toast } from "sonner";

interface TourCardProps {
  tour: Tour;
  featured?: boolean;
}

const categoryLabels: Record<string, string> = {
  "dhow-cruise": "Dhow Cruise",
  "yacht-shared": "Shared Yacht",
  "yacht-private": "Private Charter",
  "megayacht": "Megayacht",
  "water-activity": "Water Activity",
  "yacht-event": "Yacht Event",
};

const categoryIcons: Record<string, typeof Ship> = {
  "dhow-cruise": Ship,
  "yacht-shared": Ship,
  "yacht-private": Ship,
  "megayacht": Ship,
  "water-activity": Waves,
  "yacht-event": PartyPopper,
};

const TourCard = memo(({ tour, featured = false }: TourCardProps) => {
  const [isSaved, setIsSaved] = useState(() => {
    const saved = localStorage.getItem("savedTours");
    if (saved) {
      const savedTours = JSON.parse(saved);
      return savedTours.includes(tour.id);
    }
    return false;
  });

  const discount = Math.round((1 - tour.price / tour.originalPrice) * 100);
  const isPrivateCharter = tour.fullYachtPrice && tour.fullYachtPrice > 0;
  const isTopRated = tour.rating >= 4.8 && tour.reviewCount >= 50;
  const isBestSeller = tour.reviewCount >= 100;

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const saved = localStorage.getItem("savedTours");
    let savedTours: string[] = saved ? JSON.parse(saved) : [];

    if (isSaved) {
      savedTours = savedTours.filter((id) => id !== tour.id);
      toast.success("Removed from saved tours");
    } else {
      savedTours.push(tour.id);
      toast.success("Added to saved tours");
    }

    localStorage.setItem("savedTours", JSON.stringify(savedTours));
    setIsSaved(!isSaved);
  };

  return (
    <Link to={getTourUrl(tour)} className="group block h-full">
      <div className={`bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col ${featured ? 'lg:flex-row' : ''}`}>
        {/* Image with WebP support and srcset */}
        <div className={`relative overflow-hidden ${featured ? 'lg:w-1/2 lg:min-h-[300px]' : ''}`}>
          <OptimizedImage
            src={tour.image}
            alt={tour.title}
            aspectRatio={featured ? undefined : "4/3"}
            sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            className="group-hover:scale-105 transition-transform duration-500"
            containerClassName={featured ? "h-full min-h-[200px]" : ""}
          />

          {/* Wishlist Button */}
          <button
            onClick={handleSave}
            className={`absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isSaved
                ? "bg-destructive text-destructive-foreground"
                : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive hover:bg-background"
              }`}
            aria-label={isSaved ? "Remove from saved" : "Save tour"}
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold z-10">
              {discount}% OFF
            </div>
          )}

          {/* Best Seller / Top Rated Badge */}
          {(isBestSeller || isTopRated) && (
            <div className="absolute top-14 left-4 z-10">
              {isBestSeller ? (
                <div className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <TrendingUp className="w-3 h-3" />
                  Best Seller
                </div>
              ) : isTopRated ? (
                <div className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <Award className="w-3 h-3" />
                  Top Rated
                </div>
              ) : null}
            </div>
          )}

          {/* Private Charter Badge */}
          {isPrivateCharter && !isBestSeller && !isTopRated && (
            <div className="absolute top-14 left-4 bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10 shadow-lg">
              <Ship className="w-3 h-3" />
              Private
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute bottom-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 z-10">
            {(() => { const Icon = categoryIcons[tour.category] || Ship; return <Icon className="w-3 h-3" />; })()}
            {categoryLabels[tour.category] || tour.category}
          </div>
        </div>

        {/* Content */}
        <div className={`p-4 sm:p-5 flex flex-col flex-1 ${featured ? 'lg:w-1/2 lg:p-8' : ''}`}>
          {/* Title & Subtitle */}
          <div className="flex-1">
            <p className="text-secondary text-xs sm:text-sm font-medium mb-1">{tour.subtitle}</p>
            <h3 className="font-display text-base sm:text-lg font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors line-clamp-2">
              {tour.title}
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
              {tour.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-secondary text-secondary" />
                <span className="font-medium">{tour.rating}</span>
                <span className="text-muted-foreground">({tour.reviewCount.toLocaleString()})</span>
              </div>
              {tour.capacity && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{tour.capacity}</span>
                </div>
              )}
            </div>

            {/* Highlights Preview */}
            {featured && (
              <div className="hidden lg:block mb-6">
                <ul className="grid grid-cols-2 gap-2">
                  {tour.highlights.slice(0, 4).map((highlight, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                      <span className="line-clamp-1">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Price & CTA */}
          <div className={`flex items-end justify-between pt-3 sm:pt-4 border-t border-border mt-auto`}>
            <div>
              {isPrivateCharter ? (
                <>
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <span className="text-lg sm:text-xl font-bold text-foreground">AED {tour.fullYachtPrice!.toLocaleString()}</span>
                  </div>
                  <p className="text-secondary text-[10px] sm:text-xs font-medium flex items-center gap-1">
                    <Ship className="w-3 h-3" />
                    Per Hour
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <span className="text-lg sm:text-xl font-bold text-foreground">AED {tour.price.toLocaleString()}</span>
                    {tour.originalPrice > tour.price && (
                      <span className="text-muted-foreground line-through text-xs sm:text-sm">
                        AED {tour.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-[10px] sm:text-xs flex items-center gap-1">
                    <Ticket className="w-3 h-3" />
                    {tour.pricingType === "per_hour" ? "per hour" : "per person"}
                  </p>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-secondary hover:text-secondary hover:bg-secondary/10 font-semibold touch-target px-2 sm:px-3"
            >
              <span className="hidden sm:inline">Details</span>
              <span className="sm:hidden">View</span>
              <ChevronRight className="w-4 h-4 ml-0.5 sm:ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
});

TourCard.displayName = "TourCard";

export default TourCard;
