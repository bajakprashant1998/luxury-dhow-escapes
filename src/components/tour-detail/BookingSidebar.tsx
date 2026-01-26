import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Ticket,
  Ship,
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import BookingModal from "./BookingModal";
import { useContactConfig } from "@/hooks/useContactConfig";

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
}

const BookingSidebar = ({ 
  price, 
  originalPrice, 
  duration, 
  reviewCount, 
  tourTitle, 
  tourId, 
  pricingType = "per_person",
  fullYachtPrice,
  capacity
}: BookingSidebarProps) => {
  const [date, setDate] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"per_person" | "full_yacht">("per_person");
  const { phone, phoneFormatted, whatsappLinkWithGreeting } = useContactConfig();

  const discount = Math.round((1 - price / originalPrice) * 100);
  
  // Calculate total based on booking type
  const totalPrice = bookingType === "full_yacht" && fullYachtPrice
    ? fullYachtPrice
    : price * adults + price * 0.7 * children;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setIsCalendarOpen(false);
    }
  };

  const showBookingTypeToggle = fullYachtPrice && fullYachtPrice > 0;

  return (
    <motion.div 
      className="sticky top-28 space-y-4"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Main Booking Card */}
      <motion.div 
        className="bg-card rounded-2xl p-6 shadow-xl border border-border overflow-hidden relative"
        whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
        transition={{ duration: 0.3 }}
      >
        {/* Background Gradient */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        {/* Urgency Badge */}
        <motion.div 
          className="flex items-center gap-2 mb-4 p-2.5 bg-destructive/10 rounded-xl relative"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Flame className="w-4 h-4 text-destructive" />
          </motion.div>
          <span className="text-sm font-medium text-destructive">
            Only few spots left today!
          </span>
        </motion.div>

        {/* Booking Type Toggle */}
        {showBookingTypeToggle && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label className="text-sm font-medium text-foreground mb-3 block">Select Booking Type</label>
            <ToggleGroup 
              type="single" 
              value={bookingType} 
              onValueChange={(value) => value && setBookingType(value as "per_person" | "full_yacht")}
              className="grid grid-cols-2 gap-2 w-full"
            >
              <ToggleGroupItem 
                value="per_person" 
                className={cn(
                  "flex flex-col items-center gap-1 py-3 px-4 h-auto rounded-xl border-2 transition-all",
                  bookingType === "per_person" 
                    ? "border-secondary bg-secondary/10 text-secondary" 
                    : "border-border hover:border-secondary/50"
                )}
              >
                <Ticket className="w-5 h-5" />
                <span className="text-xs font-semibold">Per Person</span>
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="full_yacht" 
                className={cn(
                  "flex flex-col items-center gap-1 py-3 px-4 h-auto rounded-xl border-2 transition-all",
                  bookingType === "full_yacht" 
                    ? "border-secondary bg-secondary/10 text-secondary" 
                    : "border-border hover:border-secondary/50"
                )}
              >
                <Ship className="w-5 h-5" />
                <span className="text-xs font-semibold">Full Yacht</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </motion.div>
        )}

        {/* Price */}
        <motion.div 
          className="mb-6 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {bookingType === "full_yacht" && fullYachtPrice ? (
              <motion.div
                key="full-yacht-price"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <motion.span 
                  className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Private Charter
                </motion.span>
                <div className="flex items-baseline gap-2">
                  <motion.span 
                    className="text-3xl font-bold text-foreground"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    AED {fullYachtPrice.toLocaleString()}
                  </motion.span>
                </div>
                <p className="text-muted-foreground text-sm">per yacht (entire charter)</p>
                {capacity && (
                  <div className="mt-3 p-3 bg-secondary/10 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-secondary" />
                      <span className="font-medium">Yacht Capacity: {capacity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-secondary" />
                      <span>Private experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-secondary" />
                      <span>Exclusive use</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="per-person-price"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {discount > 0 && (
                  <motion.span 
                    className="inline-block bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, delay: 0.5 }}
                  >
                    {discount}% OFF
                  </motion.span>
                )}
                <div className="flex items-baseline gap-2">
                  <motion.span 
                    className="text-3xl font-bold text-foreground"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    AED {price}
                  </motion.span>
                  {originalPrice > price && (
                    <span className="text-muted-foreground line-through text-lg">AED {originalPrice}</span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">{pricingType === "per_hour" ? "per hour" : "per person"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

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
        <AnimatePresence>
          {bookingType === "per_person" && (
            <motion.div 
              className="mb-6 space-y-3 relative"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="text-sm font-medium text-foreground block">Guests</label>
              
              {/* Adults */}
              <motion.div 
                className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors"
                whileHover={{ scale: 1.01 }}
              >
                <div>
                  <p className="font-medium text-sm">Adults</p>
                  <p className="text-xs text-muted-foreground">Age 12+</p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-secondary/50 transition-all disabled:opacity-50"
                    disabled={adults <= 1}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <motion.span 
                    className="w-6 text-center font-semibold"
                    key={adults}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  >
                    {adults}
                  </motion.span>
                  <motion.button
                    onClick={() => setAdults(Math.min(10, adults + 1))}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-secondary/50 transition-all"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Children */}
              <motion.div 
                className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors"
                whileHover={{ scale: 1.01 }}
              >
                <div>
                  <p className="font-medium text-sm">Children</p>
                  <p className="text-xs text-muted-foreground">Age 2-11 (30% off)</p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-secondary/50 transition-all disabled:opacity-50"
                    disabled={children <= 0}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <motion.span 
                    className="w-6 text-center font-semibold"
                    key={children}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  >
                    {children}
                  </motion.span>
                  <motion.button
                    onClick={() => setChildren(Math.min(6, children + 1))}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-secondary/50 transition-all"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Total Price */}
        <motion.div 
          className="flex items-center justify-between p-4 bg-secondary/10 rounded-xl mb-6 relative overflow-hidden"
          layout
        >
          <span className="font-medium">Total</span>
          <motion.span 
            className="text-xl font-bold text-foreground"
            key={totalPrice}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            AED {totalPrice.toLocaleString()}
          </motion.span>
        </motion.div>

        {/* Quick Info */}
        <div className="space-y-3 mb-6 pb-6 border-b border-border relative">
          {[
            { icon: Calendar, text: "Available daily" },
            { icon: Clock, text: duration },
            { icon: Users, text: "Hotel pickup included" },
            { icon: Shield, text: "Free cancellation (24h)" },
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <item.icon className="w-5 h-5 text-secondary" />
              <span className="text-sm text-muted-foreground">{item.text}</span>
            </motion.div>
          ))}
        </div>

        {/* CTAs */}
        <div className="space-y-3 relative">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold h-12 text-lg shadow-lg group"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Reserve Now
            </Button>
          </motion.div>
          <a href={whatsappLinkWithGreeting(`Hi! I'm interested in booking ${tourTitle}. Can you help?`)} target="_blank" rel="noopener noreferrer" className="block">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" className="w-full h-12 hover:border-secondary/50">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </Button>
            </motion.div>
          </a>
          <a href={`tel:${phone}`} className="block">
            <Button variant="ghost" className="w-full h-12 text-muted-foreground hover:text-foreground">
              <Phone className="w-5 h-5 mr-2" />
              {phoneFormatted}
            </Button>
          </a>
        </div>

        {/* Trust Badge */}
        <motion.div 
          className="mt-6 pt-6 border-t border-border text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-sm text-muted-foreground">
            ✓ Instant Confirmation<br />
            ✓ Best Price Guaranteed
          </p>
        </motion.div>
      </motion.div>

      {/* Social Proof Card */}
      <motion.div 
        className="bg-card rounded-xl p-4 shadow-md border border-border/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ y: -2, boxShadow: "0 10px 20px -5px rgba(0,0,0,0.1)" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['J', 'M', 'S'].map((initial, i) => (
              <motion.div
                key={i}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-primary border-2 border-card flex items-center justify-center text-primary-foreground font-semibold text-xs"
                initial={{ scale: 0, x: -10 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
              >
                {initial}
              </motion.div>
            ))}
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground">{reviewCount.toLocaleString()}+ guests</p>
            <p className="text-muted-foreground text-xs">booked this experience</p>
          </div>
        </div>
      </motion.div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tourTitle={tourTitle}
        tourId={tourId}
        price={price}
        bookingType={bookingType}
        fullYachtPrice={fullYachtPrice}
        capacity={capacity}
      />
    </motion.div>
  );
};

export default BookingSidebar;