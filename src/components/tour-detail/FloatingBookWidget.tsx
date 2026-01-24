import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingBookWidgetProps {
  price: number;
  originalPrice: number;
  tourTitle: string;
}

const FloatingBookWidget = ({ price, originalPrice, tourTitle }: FloatingBookWidgetProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show widget after scrolling past 600px (roughly past the booking sidebar)
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const discount = Math.round((1 - price / originalPrice) * 100);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 hidden lg:block transition-all duration-300",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 pointer-events-none"
      )}
    >
      <div className="bg-card rounded-2xl shadow-2xl border border-border p-4 w-72">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground line-clamp-1">{tourTitle}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground">AED {price}</span>
              {originalPrice > price && (
                <span className="text-sm text-muted-foreground line-through">AED {originalPrice}</span>
              )}
            </div>
          </div>
          {discount > 0 && (
            <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-semibold">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* CTAs */}
        <div className="flex gap-2">
          <Link to="/contact" className="flex-1">
            <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold h-10">
              <Calendar className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          </Link>
          <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <MessageCircle className="w-4 h-4" />
            </Button>
          </a>
        </div>

        {/* Trust text */}
        <p className="text-xs text-muted-foreground text-center mt-3">
          ✓ Instant Confirmation • Free Cancellation
        </p>
      </div>
    </div>
  );
};

export default FloatingBookWidget;
