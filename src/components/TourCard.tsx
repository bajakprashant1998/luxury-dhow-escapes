import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, Users, ChevronRight, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Tour } from "@/lib/tourMapper";

interface TourCardProps {
  tour: Tour;
  featured?: boolean;
}

const TourCard = ({ tour, featured = false }: TourCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const discount = Math.round((1 - tour.price / tour.originalPrice) * 100);

  const categoryLabels: Record<string, string> = {
    "dhow-cruise": "Dhow Cruise",
    "yacht-shared": "Shared Yacht",
    "yacht-private": "Private Charter",
    "megayacht": "Megayacht",
  };

  return (
    <Link to={`/tours/${tour.slug}`} className="group block">
      <div className={`bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col ${featured ? 'lg:flex-row' : ''}`}>
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? 'lg:w-1/2 lg:min-h-[300px]' : 'aspect-[4/3] sm:aspect-[16/10]'}`}>
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <img
            src={tour.image}
            alt={tour.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={cn(
              "w-full h-full object-cover group-hover:scale-105 transition-all duration-500",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold">
              {discount}% OFF
            </div>
          )}
          {/* Category Badge */}
          <div className="absolute bottom-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
            <Ship className="w-3 h-3" />
            {categoryLabels[tour.category]}
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
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl font-bold text-foreground">AED {tour.price.toLocaleString()}</span>
                {tour.originalPrice > tour.price && (
                  <span className="text-muted-foreground line-through text-xs sm:text-sm">
                    AED {tour.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-[10px] sm:text-xs">
                {tour.category === "yacht-private" ? "per charter" : "per person"}
              </p>
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
};

export default TourCard;
