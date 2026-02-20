import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, Users, ArrowRight, Ship, Ticket, Heart, Award, TrendingUp, Waves, PartyPopper, MapPin } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Tour } from "@/lib/tourMapper";
import { getTourUrl } from "@/lib/seoUtils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

const categoryColors: Record<string, string> = {
  "dhow-cruise": "bg-blue-600/90",
  "yacht-shared": "bg-indigo-600/90",
  "yacht-private": "bg-primary/90",
  "megayacht": "bg-purple-700/90",
  "water-activity": "bg-cyan-600/90",
  "yacht-event": "bg-rose-600/90",
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

  const CategoryIcon = categoryIcons[tour.category] || Ship;
  const catColor = categoryColors[tour.category] || "bg-primary/90";

  return (
    <Link to={getTourUrl(tour)} className="group block h-full">
      <div className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col border border-border/50 hover:border-secondary/20">

        {/* ─── Image Block ─── */}
        <div className="relative overflow-hidden flex-shrink-0">
          <OptimizedImage
            src={tour.image}
            alt={tour.title}
            aspectRatio="16/10"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Dark gradient overlay bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

          {/* Top-left badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discount > 0 && (
              <span className="bg-destructive text-destructive-foreground px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg">
                🔥 {discount}% OFF
              </span>
            )}
            {isBestSeller && (
              <span className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
                <TrendingUp className="w-3 h-3" />
                Best Seller
              </span>
            )}
            {!isBestSeller && isTopRated && (
              <span className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
                <Award className="w-3 h-3" />
                Top Rated
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleSave}
            className={cn(
              "absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md",
              isSaved
                ? "bg-destructive text-destructive-foreground scale-110"
                : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive hover:bg-background hover:scale-110"
            )}
            aria-label={isSaved ? "Remove from saved" : "Save tour"}
          >
            <Heart className={cn("w-4 h-4 transition-transform", isSaved && "fill-current")} />
          </button>

          {/* Bottom overlay: category + rating */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 flex items-end justify-between z-10">
            <span className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-white shadow-lg", catColor)}>
              <CategoryIcon className="w-3 h-3" />
              {categoryLabels[tour.category] || tour.category}
            </span>
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-lg">
              <Star className="w-3 h-3 fill-secondary text-secondary" />
              {tour.rating}
              <span className="text-white/70 font-normal">({tour.reviewCount.toLocaleString()})</span>
            </div>
          </div>
        </div>

        {/* ─── Content Block ─── */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Title */}
          <div className="flex-1 mb-3">
            {tour.subtitle && (
              <p className="text-secondary text-xs font-semibold uppercase tracking-wide mb-1">{tour.subtitle}</p>
            )}
            <h3 className="font-display text-base sm:text-[1.05rem] font-bold text-foreground group-hover:text-secondary transition-colors line-clamp-2 tracking-tight leading-snug mb-2">
              {tour.title}
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {tour.description}
            </p>
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
            <div className="flex items-center gap-1 bg-muted/60 rounded-lg px-2.5 py-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3 text-secondary" />
              {tour.duration}
            </div>
            <div className="flex items-center gap-1 bg-muted/60 rounded-lg px-2.5 py-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 text-secondary" />
              Dubai Marina
            </div>
            {tour.capacity && (
              <div className="flex items-center gap-1 bg-muted/60 rounded-lg px-2.5 py-1 text-xs text-muted-foreground">
                <Users className="w-3 h-3 text-secondary" />
                {tour.capacity}
              </div>
            )}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-border/60 mt-auto gap-2">
            <div className="min-w-0">
              {isPrivateCharter ? (
                <>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                      AED {tour.fullYachtPrice!.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-secondary text-[10px] sm:text-xs font-semibold flex items-center gap-1 mt-0.5">
                    <Ship className="w-3 h-3" />
                    Per Hour
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                      AED {tour.price.toLocaleString()}
                    </span>
                    {tour.originalPrice > tour.price && (
                      <span className="text-muted-foreground line-through text-xs">
                        AED {tour.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-[10px] sm:text-xs flex items-center gap-1 mt-0.5">
                    <Ticket className="w-3 h-3" />
                    {tour.pricingType === "per_hour" ? "per hour" : "per person"}
                  </p>
                </>
              )}
            </div>
            <div className="flex-shrink-0">
              <div className="flex items-center gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg shadow-sm whitespace-nowrap">
                Book Now
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

TourCard.displayName = "TourCard";

export default TourCard;
