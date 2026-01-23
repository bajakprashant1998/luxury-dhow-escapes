import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { 
  Calendar, 
  Clock, 
  Users, 
  Shield, 
  Phone, 
  MessageCircle,
  Minus,
  Plus,
  CalendarIcon,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface BookingSidebarProps {
  price: number;
  originalPrice: number;
  duration: string;
  reviewCount: number;
}

const BookingSidebar = ({ price, originalPrice, duration, reviewCount }: BookingSidebarProps) => {
  const [date, setDate] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const discount = Math.round((1 - price / originalPrice) * 100);
  const totalPrice = price * adults + price * 0.7 * children;
  const spotsLeft = Math.floor(Math.random() * 6) + 3;

  return (
    <div className="sticky top-28 space-y-4">
      {/* Main Booking Card */}
      <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
        {/* Urgency Badge */}
        <div className="flex items-center gap-2 mb-4 p-2 bg-destructive/10 rounded-lg">
          <Flame className="w-4 h-4 text-destructive animate-pulse" />
          <span className="text-sm font-medium text-destructive">
            Only {spotsLeft} spots left today!
          </span>
        </div>

        {/* Price */}
        <div className="mb-6">
          {discount > 0 && (
            <span className="inline-block bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold mb-2">
              {discount}% OFF
            </span>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">AED {price}</span>
            {originalPrice > price && (
              <span className="text-muted-foreground line-through text-lg">AED {originalPrice}</span>
            )}
          </div>
          <p className="text-muted-foreground text-sm">per person</p>
        </div>

        {/* Date Picker */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">Select Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "EEE, MMM d, yyyy") : "Choose your date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50 bg-card" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guest Selectors */}
        <div className="mb-6 space-y-3">
          <label className="text-sm font-medium text-foreground block">Guests</label>
          
          {/* Adults */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium text-sm">Adults</p>
              <p className="text-xs text-muted-foreground">Age 12+</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                disabled={adults <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-semibold">{adults}</span>
              <button
                onClick={() => setAdults(Math.min(10, adults + 1))}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium text-sm">Children</p>
              <p className="text-xs text-muted-foreground">Age 2-11 (30% off)</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                disabled={children <= 0}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-semibold">{children}</span>
              <button
                onClick={() => setChildren(Math.min(6, children + 1))}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Total Price */}
        <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg mb-6">
          <span className="font-medium">Total</span>
          <span className="text-xl font-bold text-foreground">AED {totalPrice.toFixed(0)}</span>
        </div>

        {/* Quick Info */}
        <div className="space-y-3 mb-6 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-secondary" />
            <span className="text-sm text-muted-foreground">Available daily</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-secondary" />
            <span className="text-sm text-muted-foreground">{duration}</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-secondary" />
            <span className="text-sm text-muted-foreground">Hotel pickup included</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-secondary" />
            <span className="text-sm text-muted-foreground">Free cancellation (24h)</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Link to="/contact" className="block">
            <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold h-12 text-lg shadow-lg">
              Reserve Now
            </Button>
          </Link>
          <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="outline" className="w-full h-12">
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp Us
            </Button>
          </a>
          <a href="tel:+971501234567" className="block">
            <Button variant="ghost" className="w-full h-12 text-muted-foreground">
              <Phone className="w-5 h-5 mr-2" />
              +971 50 123 4567
            </Button>
          </a>
        </div>

        {/* Trust Badge */}
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            ✓ Instant Confirmation<br />
            ✓ Best Price Guaranteed
          </p>
        </div>
      </div>

      {/* Social Proof Card */}
      <div className="bg-card rounded-xl p-4 shadow-md border border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-secondary/20 border-2 border-card flex items-center justify-center"
              >
                <span className="text-xs">👤</span>
              </div>
            ))}
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground">{reviewCount.toLocaleString()}+ guests</p>
            <p className="text-muted-foreground text-xs">booked this experience</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSidebar;
