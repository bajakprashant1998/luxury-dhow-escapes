import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronUp, Ship } from "lucide-react";
import BookingModal from "./BookingModal";
import { useContactConfig } from "@/hooks/useContactConfig";
import { BookingFeatures, defaultBookingFeatures } from "@/lib/tourMapper";

interface MobileBookingBarProps {
  price: number;
  originalPrice: number;
  tourTitle?: string;
  tourId?: string;
  pricingType?: "per_person" | "per_hour";
  fullYachtPrice?: number | null;
  capacity?: string;
  bookingFeatures?: BookingFeatures;
}

const MobileBookingBar = ({ 
  price, 
  originalPrice, 
  tourTitle = "", 
  tourId = "", 
  pricingType = "per_person",
  fullYachtPrice,
  capacity,
  bookingFeatures = defaultBookingFeatures
}: MobileBookingBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { whatsappLinkWithGreeting } = useContactConfig();
  const discount = Math.round((1 - price / originalPrice) * 100);

  // Derive booking type from tour data - no toggle needed
  const isFullYacht = fullYachtPrice && fullYachtPrice > 0;
  const bookingType = isFullYacht ? "full_yacht" : "per_person";
  const displayPrice = isFullYacht ? fullYachtPrice : price;
  const priceLabel = isFullYacht 
    ? "Per Hour" 
    : (pricingType === "per_hour" ? "per hour" : "per person");

  return (
    <>
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-2xl lg:hidden pb-safe"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.5 }}
      >
        {/* Expandable Info Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-b border-border overflow-hidden"
            >
              <div className="p-4 space-y-3 bg-muted/30">
                {/* Show charter info if full yacht */}
                {isFullYacht && (
                  <div className="pb-3 border-b border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Ship className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Private Charter</p>
                        {capacity && <p className="text-xs text-muted-foreground">{capacity}</p>}
                      </div>
                    </div>
                    {bookingFeatures.charter_features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm ml-7">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-muted-foreground">Instant confirmation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-muted-foreground">{bookingFeatures.cancellation_text}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-muted-foreground">Best price guaranteed</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4">
          {/* Expand Toggle */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-6 bg-card border border-border rounded-t-lg flex items-center justify-center shadow-sm"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </button>

          <div className="flex items-center justify-between gap-4">
            {/* Price */}
            <div>
              <div className="flex items-baseline gap-2">
                <motion.span 
                  className="text-xl font-bold text-foreground"
                  key={displayPrice}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  AED {displayPrice.toLocaleString()}
                </motion.span>
                {!isFullYacht && originalPrice > price && (
                  <span className="text-sm text-muted-foreground line-through">AED {originalPrice}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!isFullYacht && discount > 0 && (
                  <motion.span 
                    className="text-xs font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {discount}% OFF
                  </motion.span>
                )}
                {isFullYacht && (
                  <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                    Private Charter
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{priceLabel}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <motion.a 
                href={whatsappLinkWithGreeting(`Hi! I'm interested in booking ${tourTitle}. Can you help?`)} 
                target="_blank" 
                rel="noopener noreferrer"
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="icon" className="h-11 w-11 touch-target">
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </motion.a>
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => setIsBookingModalOpen(true)}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold h-11 px-5 sm:px-6 shadow-lg touch-target animate-pulse-glow"
                >
                  Book Now
                </Button>
              </motion.div>
            </div>
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
        fullYachtPrice={fullYachtPrice}
        capacity={capacity}
      />
    </>
  );
};

export default MobileBookingBar;