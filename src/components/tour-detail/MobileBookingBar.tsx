import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface MobileBookingBarProps {
  price: number;
  originalPrice: number;
}

const MobileBookingBar = ({ price, originalPrice }: MobileBookingBarProps) => {
  const discount = Math.round((1 - price / originalPrice) * 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border p-4 shadow-2xl lg:hidden">
      <div className="flex items-center justify-between gap-4">
        {/* Price */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">AED {price}</span>
            {originalPrice > price && (
              <span className="text-sm text-muted-foreground line-through">AED {originalPrice}</span>
            )}
          </div>
          {discount > 0 && (
            <span className="text-xs font-medium text-destructive">{discount}% OFF</span>
          )}
          <p className="text-xs text-muted-foreground">per person</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon" className="h-11 w-11">
              <MessageCircle className="w-5 h-5" />
            </Button>
          </a>
          <Link to="/contact">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold h-11 px-6">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileBookingBar;
