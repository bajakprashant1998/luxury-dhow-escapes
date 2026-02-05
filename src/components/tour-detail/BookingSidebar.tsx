import { useState, memo } from "react";
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
  Flame,
  Sparkles,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BookingModal from "./BookingModal";
import { useContactConfig } from "@/hooks/useContactConfig";
import { BookingFeatures, defaultBookingFeatures } from "@/lib/tourMapper";

interface BookingSidebarProps {
  price: number;
  originalPrice: number;
  duration: string;
  reviewCount: number;
  tourTitle: string;
  tourId: string;
  pricingType?: "per_person" | "per_hour";
  fullYachtPrice?: number | null;
  capacity?: string;
  bookingFeatures?: BookingFeatures;
}

const BookingSidebar = memo(({ 
  price, 
  originalPrice, 
  duration, 
  reviewCount, 
  tourTitle, 
  tourId, 
  pricingType = "per_person",
  fullYachtPrice,
  capacity,
  bookingFeatures = defaultBookingFeatures
}: BookingSidebarProps) => {
  const [date, setDate] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { phone, phoneFormatted, whatsappLinkWithGreeting } = useContactConfig();

  // Derive booking type from tour data - no toggle needed
  const isFullYacht = fullYachtPrice && fullYachtPrice > 0;
  const bookingType = isFullYacht ? "full_yacht" : "per_person";

  const discount = Math.round((1 - price / originalPrice) * 100);
  
  // Calculate total based on booking type
  const totalPrice = isFullYacht
    ? fullYachtPrice
    : price * adults + price * 0.7 * children;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="sticky top-28 space-y-4">
      {/* Main Booking Card */}
      <div className="bg-card rounded-2xl p-6 shadow-xl border border-border overflow-hidden relative hover:shadow-2xl transition-shadow duration-300">
        {/* Background Gradient */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        {/* Urgency Badge */}
        {bookingFeatures.urgency_enabled && (
          <div className="flex items-center gap-2 mb-4 p-2.5 bg-destructive/10 rounded-xl relative">
            <div className="animate-pulse">
              <Flame className="w-4 h-4 text-destructive" />
            </div>
            <span className="text-sm font-medium text-destructive">
              {bookingFeatures.urgency_text}
            </span>
          </div>
        )}


        {/* Price */}
        <div className="mb-6 relative">
          {isFullYacht ? (
            <div>
              <span className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold mb-2">
                Private Charter
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">
                  AED {fullYachtPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">Per Hour</p>
              {capacity && (
                <div className="mt-3 p-3 bg-secondary/10 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-secondary" />
                    <span className="font-medium">Yacht Capacity: {capacity}</span>
                  </div>
                  {bookingFeatures.charter_features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-secondary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {discount > 0 && (
                <span className="inline-block bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold mb-2">
                  {discount}% OFF
                </span>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">
                  AED {price}
                </span>
                {originalPrice > price && (
                  <span className="text-muted-foreground line-through text-lg">AED {originalPrice}</span>
                )}
              </div>
              <p className="text-muted-foreground text-sm">{pricingType === "per_hour" ? "per hour" : "per person"}</p>
            </div>
          )}
        </div>

        {/* Date Picker */}
        <div className="mb-4 relative">
          <label className="text-sm font-medium text-foreground mb-2 block">Select Date</label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12 hover:border-secondary/50 transition-colors",
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
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guest Selectors - Only show for per_person booking */}
        {!isFullYacht && (
            <div className="mb-6 space-y-3 relative">
              <label className="text-sm font-medium text-foreground block">Guests</label>
              
              {/* Adults */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors">
                <div>
                  <p className="font-medium text-sm">Adults</p>
                  <p className="text-xs text-muted-foreground">Age 12+</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-secondary/50 transition-all disabled:opacity-50 active:scale-95"
                    disabled={adults <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-semibold">
                    {adults}
                  </span>
                  <button
                    onClick={() => setAdults(Math.min(10, adults + 1))}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-secondary/50 transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors">
                <div>
                  <p className="font-medium text-sm">Children</p>
                  <p className="text-xs text-muted-foreground">Age 2-11 (30% off)</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-secondary/50 transition-all disabled:opacity-50 active:scale-95"
                    disabled={children <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-semibold">
                    {children}
                  </span>
                  <button
                    onClick={() => setChildren(Math.min(6, children + 1))}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-secondary/50 transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Total Price */}
        <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-xl mb-6 relative overflow-hidden">
          <span className="font-medium">Total</span>
          <span className="text-xl font-bold text-foreground">
            AED {totalPrice.toLocaleString()}
          </span>
        </div>

        {/* Quick Info */}
        <div className="space-y-3 mb-6 pb-6 border-b border-border relative">
          {[
            { icon: Calendar, text: bookingFeatures.availability_text, show: true },
            { icon: Clock, text: bookingFeatures.minimum_duration || duration, show: true },
            { icon: Users, text: bookingFeatures.hotel_pickup_text, show: bookingFeatures.hotel_pickup },
            { icon: Shield, text: bookingFeatures.cancellation_text, show: true },
          ].filter(item => item.show).map((item, index) => (
            <div 
              key={index}
              className="flex items-center gap-3"
            >
              <item.icon className="w-5 h-5 text-secondary" />
              <span className="text-sm text-muted-foreground">{item.text}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="space-y-3 relative">
          <div>
            <Button 
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold h-12 text-lg shadow-lg group hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Reserve Now
            </Button>
          </div>
          <a href={whatsappLinkWithGreeting(`Hi! I'm interested in booking ${tourTitle}. Can you help?`)} target="_blank" rel="noopener noreferrer" className="block">
            <div>
              <Button variant="outline" className="w-full h-12 hover:border-secondary/50 hover:scale-[1.02] active:scale-[0.98] transition-transform">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </Button>
            </div>
          </a>
          <a href={`tel:${phone}`} className="block">
            <Button variant="ghost" className="w-full h-12 text-muted-foreground hover:text-foreground">
              <Phone className="w-5 h-5 mr-2" />
              {phoneFormatted}
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
      <div className="bg-card rounded-xl p-4 shadow-md border border-border/50 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['J', 'M', 'S'].map((initial, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-primary border-2 border-card flex items-center justify-center text-primary-foreground font-semibold text-xs"
              >
                {initial}
              </div>
            ))}
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground">{reviewCount.toLocaleString()}+ guests</p>
            <p className="text-muted-foreground text-xs">booked this experience</p>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tourTitle={tourTitle}
        tourId={tourId}
        price={price}
        fullYachtPrice={fullYachtPrice}
        capacity={capacity}
      />
    </div>
  );
});

BookingSidebar.displayName = "BookingSidebar";

export default BookingSidebar;