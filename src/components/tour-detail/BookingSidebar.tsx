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
  Check,
  Star,
  Zap,
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
import { BookingFeatures, defaultBookingFeatures, defaultGuestCategories, defaultQuantityConfig } from "@/lib/tourMapper";

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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { phone, phoneFormatted, whatsappLinkWithGreeting } = useContactConfig();

  const bookingMode = bookingFeatures.booking_mode || "guests";
  const guestCategories = bookingFeatures.guest_categories || defaultGuestCategories;
  const quantityConfig = bookingFeatures.quantity_config || defaultQuantityConfig;

  const [guestCounts, setGuestCounts] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    guestCategories.forEach((cat, i) => {
      initial[i] = cat.min || (i === 0 ? 2 : 0);
    });
    return initial;
  });
  const [quantity, setQuantity] = useState(quantityConfig.min || 1);

  const isFullYacht = fullYachtPrice && fullYachtPrice > 0;

  const discount = Math.round((1 - price / originalPrice) * 100);

  const basePrice = isFullYacht
    ? fullYachtPrice
    : bookingMode === "quantity"
      ? (quantityConfig.price > 0 ? quantityConfig.price : price) * quantity
      : guestCategories.reduce((sum, cat, i) => {
        const count = guestCounts[i] || 0;
        const catPrice = cat.price > 0 ? cat.price : price;
        return sum + catPrice * count;
      }, 0);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="sticky top-28 space-y-4">
      {/* Main Booking Card */}
      <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden relative">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-secondary via-secondary/80 to-primary" />

        <div className="p-6 relative">
          {/* Background Gradient */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          {/* Urgency Badge */}
          {bookingFeatures.urgency_enabled && (
            <div className="flex items-center gap-2.5 mb-5 p-3 bg-destructive/8 border border-destructive/20 rounded-xl relative">
              <div className="w-8 h-8 rounded-lg bg-destructive/15 flex items-center justify-center flex-shrink-0">
                <Flame className="w-4 h-4 text-destructive animate-pulse" />
              </div>
              <span className="text-sm font-semibold text-destructive">
                {bookingFeatures.urgency_text}
              </span>
            </div>
          )}

          {/* Price Section */}
          <div className="mb-6 relative">
            {isFullYacht ? (
              <div>
                <span className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-xs font-bold mb-3 uppercase tracking-wide">
                  <Zap className="w-3.5 h-3.5" />
                  Private Charter
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-foreground tracking-tight">
                    AED {fullYachtPrice.toLocaleString()}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mt-1">Per Hour</p>
                {capacity && (
                  <div className="mt-4 p-3.5 bg-secondary/8 border border-secondary/20 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-secondary" />
                      <span className="font-semibold text-foreground">Yacht Capacity: {capacity}</span>
                    </div>
                    {bookingFeatures.charter_features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground ml-6">
                        <Check className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {discount > 0 && (
                  <span className="inline-flex items-center gap-1 bg-destructive text-destructive-foreground px-3 py-1.5 rounded-full text-xs font-bold mb-3 uppercase tracking-wide">
                    {discount}% OFF
                  </span>
                )}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-foreground tracking-tight">
                    AED {price}
                  </span>
                  {originalPrice > price && (
                    <span className="text-muted-foreground line-through text-lg">AED {originalPrice}</span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mt-1">{bookingFeatures.price_label || (pricingType === "per_hour" ? "per hour" : "per person")}</p>
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div className="mb-5 relative">
            <label className="text-sm font-semibold text-foreground mb-2 block">Select Date</label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 rounded-xl border-2 transition-all duration-200",
                    !date && "text-muted-foreground",
                    date ? "border-secondary/50 bg-secondary/5" : "border-border hover:border-secondary/40"
                  )}
                >
                  <CalendarIcon className="mr-2.5 h-4 w-4 text-secondary" />
                  {date ? format(date, "EEE, MMM d, yyyy") : "Choose your date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-card rounded-xl" align="start">
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

          {/* Guest Selectors */}
          {!isFullYacht && bookingMode === "guests" && (
            <div className="mb-5 space-y-2.5 relative">
              <label className="text-sm font-semibold text-foreground block">Guests</label>
              {guestCategories.map((cat, index) => (
                <div key={index} className="flex items-center justify-between p-3.5 bg-muted/40 border border-border/50 rounded-xl hover:border-secondary/30 transition-all duration-200">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.label}</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setGuestCounts(prev => ({ ...prev, [index]: Math.max(cat.min, (prev[index] || 0) - 1) }))}
                      className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center hover:bg-muted hover:border-secondary/50 transition-all disabled:opacity-40 active:scale-95"
                      disabled={(guestCounts[index] || 0) <= cat.min}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center font-bold text-base tabular-nums">
                      {guestCounts[index] || 0}
                    </span>
                    <button
                      onClick={() => setGuestCounts(prev => ({ ...prev, [index]: Math.min(cat.max, (prev[index] || 0) + 1) }))}
                      className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isFullYacht && bookingMode === "quantity" && (
            <div className="mb-5 space-y-2.5 relative">
              <label className="text-sm font-semibold text-foreground block">{quantityConfig.header || quantityConfig.label}</label>
              <div className="flex items-center justify-between p-3.5 bg-muted/40 border border-border/50 rounded-xl hover:border-secondary/30 transition-all duration-200">
                <div>
                  <div className="font-semibold text-sm flex flex-wrap items-baseline gap-1">
                    <span>{quantityConfig.label}</span>
                    {quantityConfig.subtitle && <span className="text-muted-foreground font-normal text-xs">({quantityConfig.subtitle})</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">AED {quantityConfig.price > 0 ? quantityConfig.price : price}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setQuantity(Math.max(quantityConfig.min, quantity - 1))}
                    className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center hover:bg-muted hover:border-secondary/50 transition-all disabled:opacity-40 active:scale-95"
                    disabled={quantity <= quantityConfig.min}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center font-bold text-base tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(quantityConfig.max, quantity + 1))}
                    className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Price Summary */}
          <div className="mb-6 bg-muted/30 border border-border/50 rounded-xl overflow-hidden">
            <div className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {isFullYacht ? "Charter price" : bookingMode === "quantity" ? `${quantity} × ${quantityConfig.label}` : guestCategories.map((cat, i) => (guestCounts[i] || 0) > 0 ? `${guestCounts[i]} ${cat.name}` : '').filter(Boolean).join(' + ')}
                </span>
                <span className="font-medium">AED {basePrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="px-4 py-3 bg-muted/40 border-t border-border/50 flex items-center justify-between">
              <span className="font-semibold text-sm">Total</span>
              <span className="text-2xl font-black text-foreground tracking-tight">
                AED {basePrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quick Info */}
          <div className="space-y-2.5 mb-6 pb-6 border-b border-border relative">
            {[
              { icon: Calendar, text: bookingFeatures.availability_text, show: !!bookingFeatures.availability_text },
              { icon: Clock, text: bookingFeatures.minimum_duration || duration, show: !!(bookingFeatures.minimum_duration || duration) },
              { icon: Users, text: bookingFeatures.hotel_pickup_text, show: bookingFeatures.hotel_pickup && !!bookingFeatures.hotel_pickup_text },
              { icon: Shield, text: bookingFeatures.cancellation_text, show: !!bookingFeatures.cancellation_text },
            ].filter(item => item.show).map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-secondary" />
                </div>
                <span className="text-sm text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="space-y-3 relative">
            <Button
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold h-13 text-base shadow-lg shadow-secondary/25 group hover:shadow-xl hover:shadow-secondary/35 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 rounded-xl"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Reserve Now
            </Button>
            <a href={whatsappLinkWithGreeting(`Hi! I'm interested in booking ${tourTitle}. Can you help?`)} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full h-12 rounded-xl border-2 hover:border-secondary/50 hover:bg-secondary/5 transition-all duration-200">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </Button>
            </a>
            <a href={`tel:${phone}`} className="block">
              <Button variant="ghost" className="w-full h-11 text-muted-foreground hover:text-foreground rounded-xl">
                <Phone className="w-4 h-4 mr-2" />
                {phoneFormatted}
              </Button>
            </a>
          </div>

          {/* Trust Badge */}
          <div className="mt-6 pt-5 border-t border-border">
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-secondary" />
                Instant Confirmation
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-secondary" />
                Best Price
              </span>
            </div>
          </div>
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
            <p className="font-semibold text-foreground flex items-center gap-1">
              {reviewCount.toLocaleString()}+ guests
              <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
            </p>
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
        initialDate={date}
        initialGuestCounts={guestCounts}
        initialQuantity={quantity}
        bookingFeatures={bookingFeatures}
      />
    </div>
  );
});

BookingSidebar.displayName = "BookingSidebar";

export default BookingSidebar;
