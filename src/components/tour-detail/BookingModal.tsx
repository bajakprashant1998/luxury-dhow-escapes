import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowRight,
  ArrowLeft,
  Minus,
  Plus,
  CalendarIcon,
  Check,
  Loader2,
  AlertCircle,
  Sparkles,
  Ship,
  Users,
  Car,
  Layers,
  MapPin,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendBookingEmail } from "@/lib/sendBookingEmail";
import DiscountCodeInput from "@/components/booking/DiscountCodeInput";
import { Discount } from "@/hooks/useDiscounts";
import { BookingFeatures, defaultBookingFeatures, defaultGuestCategories, defaultQuantityConfig, BookingAddon, mapDbTourToTour, Tour } from "@/lib/tourMapper";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getCategoryPath } from "@/lib/seoUtils";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourTitle: string;
  tourId: string;
  price: number;
  fullYachtPrice?: number | null;
  capacity?: string;
  bookingFeatures?: BookingFeatures;
}

const steps = [
  { number: 1, label: "Select Tour" },
  { number: 2, label: "Your Details" },
  { number: 3, label: "Confirm" },
];

const BookingModal = ({
  isOpen,
  onClose,
  tourTitle,
  tourId,
  price,
  fullYachtPrice,
  capacity,
  bookingFeatures = defaultBookingFeatures
}: BookingModalProps) => {
  // Derive booking type from tour data - no toggle needed
  // Remapped to rely on currentTour state below
  // const isFullYacht = fullYachtPrice && fullYachtPrice > 0;
  // const bookingType = isFullYacht ? "full_yacht" : "per_person";
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // State for dynamic tour selection
  const [selectedTourId, setSelectedTourId] = useState(tourId);

  // Update selectedTourId if prop changes (e.g. navigation)
  useEffect(() => {
    setSelectedTourId(tourId);
  }, [tourId]);

  // Fetch tour details if selectedTourId differs from prop tourId
  const { data: fetchedTour } = useQuery({
    queryKey: ["tour-details", selectedTourId],
    queryFn: async () => {
      if (selectedTourId === tourId) return null;

      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("id", selectedTourId)
        .single();

      if (error) throw error;
      return mapDbTourToTour(data);
    },
    enabled: selectedTourId !== tourId,
  });

  // Unified tour data object
  const currentTour: Partial<Tour> & { title: string; price: number; bookingFeatures: BookingFeatures } = useMemo(() => {
    if (selectedTourId === tourId || !fetchedTour) {
      return {
        id: tourId,
        title: tourTitle,
        price,
        fullYachtPrice,
        capacity,
        bookingFeatures,
      };
    }
    return fetchedTour;
  }, [selectedTourId, tourId, fetchedTour, tourTitle, price, fullYachtPrice, capacity, bookingFeatures]);

  // Derived state from currentTour
  const currentBookingFeatures = currentTour.bookingFeatures || defaultBookingFeatures;
  const currentPrice = currentTour.price;
  const currentFullYachtPrice = currentTour.fullYachtPrice;
  const currentCapacity = currentTour.capacity;
  const isCurrentFullYacht = !!(currentFullYachtPrice && currentFullYachtPrice > 0);
  const currentBookingType = isCurrentFullYacht ? "full_yacht" : "per_person";

  const bookingMode = currentBookingFeatures.booking_mode || "guests";
  const guestCategories = currentBookingFeatures.guest_categories || defaultGuestCategories;
  const quantityConfig = currentBookingFeatures.quantity_config || defaultQuantityConfig;
  const availableAddons = currentBookingFeatures.addons || [];

  // Step 1 state
  const [date, setDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Guest/Quantity/Addon State
  const [guestCounts, setGuestCounts] = useState<Record<number, number>>({});
  const [quantity, setQuantity] = useState(currentBookingFeatures.quantity_config?.min || 1);
  const [selectedAddonIds, setSelectedAddonIds] = useState<Set<string>>(new Set());

  // Step 2 state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Discount state
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);

  // Transfer, deck & travel state
  const [selectedVehicleIdx, setSelectedVehicleIdx] = useState<string>("");
  const [selectedDeck, setSelectedDeck] = useState("");
  const [travelType, setTravelType] = useState<"shared" | "self" | "personal">("shared");

  // Derived Values
  const vehicles = currentBookingFeatures.transfer_vehicles || [];
  const selectedVehicle = selectedVehicleIdx ? vehicles[parseInt(selectedVehicleIdx)] : null;
  const transferCost = selectedVehicle ? selectedVehicle.price : 0;

  // Fetch linked tours
  const linkedTourIds = currentBookingFeatures.linked_tour_ids || [];
  const { data: linkedTours = [] } = useQuery({
    queryKey: ["linked-tours", selectedTourId],
    queryFn: async () => {
      if (linkedTourIds.length === 0) return [];
      const { data, error } = await supabase
        .from("tours")
        .select("id, title, slug, seo_slug, category")
        .in("id", linkedTourIds)
        .eq("status", "active");
      if (error) throw error;
      return data || [];
    },
    enabled: linkedTourIds.length > 0,
  });

  // Re-initialize guest counts/quantity when tour changes or on mount
  useEffect(() => {
    const initial: Record<number, number> = {};
    guestCategories.forEach((cat, i) => {
      initial[i] = cat.min || (i === 0 ? 1 : 0);
    });
    setGuestCounts(initial);
    setQuantity(quantityConfig.min || 1);
    setSelectedAddonIds(new Set());
    // Reset vehicle selection if transfer options change
    setSelectedVehicleIdx("");
    setSelectedDeck("");
    setTravelType("shared");
  }, [selectedTourId, currentBookingFeatures, guestCategories, quantityConfig]);

  // Dynamic price calculation
  const guestBasedPrice = useMemo(() => {
    if (bookingMode !== "guests") return 0;
    return guestCategories.reduce((sum, cat, i) => {
      const count = guestCounts[i] || 0;
      const catPrice = cat.price > 0 ? cat.price : currentPrice;
      return sum + catPrice * count;
    }, 0);
  }, [guestCounts, guestCategories, bookingMode, currentPrice]);

  const quantityBasedPrice = useMemo(() => {
    if (bookingMode !== "quantity") return 0;
    const unitPrice = quantityConfig.price > 0 ? quantityConfig.price : currentPrice;
    return unitPrice * quantity;
  }, [quantity, quantityConfig, bookingMode, currentPrice]);

  const addonsTotal = useMemo(() => {
    return availableAddons
      .filter((a) => selectedAddonIds.has(a.id))
      .reduce((sum, a) => sum + a.price, 0);
  }, [selectedAddonIds, availableAddons]);

  const totalGuests = bookingMode === "guests"
    ? Object.values(guestCounts).reduce((a, b) => a + b, 0)
    : quantity;

  const selfDiscount = ((travelType === "self" || travelType === "personal") && currentBookingFeatures.self_travel_discount)
    ? currentBookingFeatures.self_travel_discount * totalGuests
    : 0;

  const deckSurcharge = (currentBookingFeatures.has_upper_deck && currentBookingFeatures.upper_deck_surcharge && selectedDeck === (currentBookingFeatures.deck_options?.[1] || "Upper Deck"))
    ? currentBookingFeatures.upper_deck_surcharge * totalGuests
    : 0;

  const basePrice = isCurrentFullYacht ? currentFullYachtPrice! : (bookingMode === "guests" ? guestBasedPrice : quantityBasedPrice);
  const subtotal = Math.max(0, basePrice + transferCost + deckSurcharge - selfDiscount + addonsTotal);

  const calculateDiscountAmount = () => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.type === "percentage") {
      return (subtotal * appliedDiscount.value) / 100;
    }
    return Math.min(appliedDiscount.value, subtotal);
  };

  const discountAmount = calculateDiscountAmount();
  const totalPrice = subtotal - discountAmount;

  // Handle step animation
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(1);
        setDate(undefined);
        setName("");
        setEmail("");
        setPhone("");
        setSpecialRequests("");
        setAppliedDiscount(null);
        setSubmitError(null);

        // Reset to prop values
        setSelectedTourId(tourId);
      }, 300);
    }
  }, [isOpen, tourId]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setIsCalendarOpen(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!date) {
        toast({ title: "Please select a date", variant: "destructive" });
        return;
      }
    }
    if (currentStep === 2) {
      if (!name.trim()) {
        toast({ title: "Please enter your name", variant: "destructive" });
        return;
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast({ title: "Please enter a valid email", variant: "destructive" });
        return;
      }
      if (!phone.trim() || phone.length < 8) {
        toast({ title: "Please enter a valid phone number", variant: "destructive" });
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();

      const bookingId = crypto.randomUUID();

      const bookingData: any = {
        id: bookingId,
        tour_id: selectedTourId,
        tour_name: currentTour.title,
        booking_date: format(date!, "yyyy-MM-dd"),
        adults: bookingMode === "guests" ? (guestCounts[0] || 0) : 0,
        children: bookingMode === "guests" ? (guestCounts[1] || 0) : 0,
        infants: bookingMode === "guests" ? (guestCounts[2] || 0) : 0,
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim(),
        special_requests: [
          isCurrentFullYacht ? `[FULL YACHT CHARTER${currentCapacity ? ` - Capacity: ${currentCapacity}` : ''}]` : null,
          bookingMode === "guests"
            ? `[GUESTS: ${guestCategories.map((cat, i) => `${guestCounts[i] || 0} ${cat.name}`).join(', ')}]`
            : `[QUANTITY: ${quantity} x ${quantityConfig.label}]`,
          selectedAddonIds.size > 0
            ? `[ADD-ONS: ${availableAddons.filter(a => selectedAddonIds.has(a.id)).map(a => `${a.name} AED ${a.price}`).join(', ')}]`
            : null,
          currentBookingFeatures.travel_options_enabled ? `[TRAVEL: ${travelType}]` : null,
          selectedVehicle ? `[TRANSFER: ${selectedVehicle.name} - AED ${selectedVehicle.price}]` : null,
          selectedDeck ? `[DECK: ${selectedDeck}${deckSurcharge > 0 ? ` +AED ${deckSurcharge}` : ''}]` : null,
          selfDiscount > 0 ? `[DIRECT TO BOAT DISCOUNT: -AED ${selfDiscount} (${totalGuests} persons × AED ${currentBookingFeatures.self_travel_discount})]` : null,
          specialRequests.trim() || null,
        ].filter(Boolean).join(' ') || null,
        total_price: totalPrice,
        status: "pending",
        booking_type: currentBookingType,
      };

      if (user?.id) {
        bookingData.user_id = user.id;
      }

      // Insert without selecting return data to avoid RLS issues for guest users
      const { error } = await supabase.from("bookings").insert(bookingData);

      if (error) {
        console.error("Booking error:", error);
        if (error.code === "42501") {
          throw new Error("Unable to create booking. Please try again or contact support.");
        }
        throw new Error(error.message);
      }



      // Send confirmation email (don't block on failure)
      if (bookingId) {
        sendBookingEmail(bookingId, "pending")
          .then(result => {
            if (!result.success) {
              console.warn("Email notification failed, but booking was created");
            }
          })
          .catch(console.warn);
      }

      toast({
        title: "🎉 Booking submitted!",
        description: "Check your email for confirmation. We'll contact you shortly."
      });
      onClose();
    } catch (error: any) {
      console.error("Booking submission error:", error);
      setSubmitError(error.message || "Something went wrong. Please try again.");
      toast({
        title: "Booking failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Guest counter component - defined inline without ref to avoid forwardRef warning
  const renderGuestCounter = (
    label: string,
    sublabel: string,
    value: number,
    onChange: (v: number) => void,
    min: number = 0,
    max: number = 10
  ) => (
    <div className="flex-1 min-w-0 border border-border rounded-2xl p-4 transition-all duration-300 hover:border-secondary/50 hover:shadow-md bg-card/50">
      <div className="flex items-center justify-between sm:block">
        <div className="sm:mb-4">
          <p className="font-bold text-foreground text-sm sm:text-base">{label}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{sublabel}</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-0 sm:justify-between">
          <button
            type="button"
            onClick={() => onChange(Math.max(min, value - 1))}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-border flex items-center justify-center hover:bg-muted hover:border-secondary/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed touch-target"
            disabled={value <= min}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xl sm:text-2xl font-bold tabular-nums w-10 text-center">{value}</span>
          <button
            type="button"
            onClick={() => onChange(Math.min(max, value + 1))}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-border flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all touch-target"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] md:max-w-[620px] p-0 gap-0 max-h-[calc(100vh-2rem)] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto rounded-2xl sm:rounded-3xl border-0 shadow-2xl">
        <DialogHeader className="p-5 sm:p-8 pb-0">
          <DialogTitle className="sr-only">Book Your Experience</DialogTitle>
          {/* Progress Steps - Enhanced */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-500",
                      currentStep >= step.number
                        ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/30 scale-105"
                        : "bg-muted text-muted-foreground border-2 border-border"
                    )}
                  >
                    {currentStep > step.number ? <Check className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} /> : step.number}
                  </div>
                  <span className={cn(
                    "text-[11px] sm:text-xs mt-2 transition-all duration-300 font-medium",
                    currentStep >= step.number ? "text-secondary" : "text-muted-foreground"
                  )}>{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-12 sm:w-20 md:w-28 h-1 mx-2 sm:mx-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full bg-secondary rounded-full transition-all duration-700 ease-out",
                        currentStep > step.number ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="p-5 sm:p-8 pt-2 sm:pt-4">
          <div className={cn(
            "transition-all duration-400 ease-out",
            isAnimating ? "opacity-0 translate-x-6" : "opacity-100 translate-x-0"
          )}>
            {/* Step 1: Select Tour */}
            {currentStep === 1 && (
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Choose Your Experience</h2>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">Select your preferred cruise and date</p>
                </div>

                {/* Full Yacht Badge */}
                {isCurrentFullYacht && (
                  <div className="flex items-center gap-3 p-4 bg-secondary/10 border border-secondary/30 rounded-2xl">
                    <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                      <Ship className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Full Yacht Charter</p>
                      <p className="text-sm text-muted-foreground">
                        Private experience {currentCapacity && `• ${currentCapacity}`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tour Selection */}
                <div>
                  <label className="text-sm font-bold text-foreground mb-2 block">Select Tour *</label>
                  <label className="text-sm font-bold text-foreground mb-2 block">Select Tour *</label>
                  <Select defaultValue={selectedTourId} value={selectedTourId} onValueChange={(val) => {
                    setSelectedTourId(val);
                  }}>
                    <SelectTrigger className="h-12 sm:h-14 rounded-xl text-sm sm:text-base border-2 border-border focus:border-secondary">
                      <SelectValue placeholder="Choose your cruise experience" />
                    </SelectTrigger>
                    <SelectContent className="bg-card z-50 rounded-xl">
                      <SelectItem value={tourId}>{tourTitle}</SelectItem>
                      {linkedTours.map((lt) => (
                        <SelectItem key={lt.id} value={lt.id}>{lt.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="text-sm font-bold text-foreground mb-2 block">Preferred Date *</label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 sm:h-14 transition-all text-sm sm:text-base rounded-xl border-2",
                          !date && "text-muted-foreground",
                          date ? "border-secondary/50 bg-secondary/5" : "border-border"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-5 w-5 flex-shrink-0 text-secondary" />
                        <span className="truncate">{date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50 bg-card rounded-xl border-2 border-border" align="center" side="bottom">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        disabled={(d) => d < new Date()}
                        initialFocus
                        className="pointer-events-auto p-3"
                      />
                    </PopoverContent>
                  </Popover>
                </div>


                {/* Dynamic Guest/Quantity Section */}
                {!isCurrentFullYacht && bookingMode === "guests" && (
                  <div>
                    <label className="text-sm font-bold text-foreground mb-3 block">Number of Guests *</label>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      {guestCategories.map((cat, index) => (
                        renderGuestCounter(
                          cat.name,
                          cat.label + (cat.price > 0 ? ` • AED ${cat.price}` : ''),
                          guestCounts[index] || 0,
                          (v) => setGuestCounts(prev => ({ ...prev, [index]: v })),
                          cat.min,
                          cat.max
                        )
                      ))}
                    </div>
                  </div>
                )}

                {!isCurrentFullYacht && bookingMode === "quantity" && (
                  <div>
                    <label className="text-sm font-bold text-foreground mb-3 block">{quantityConfig.label} *</label>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      {renderGuestCounter(
                        quantityConfig.label,
                        quantityConfig.price > 0 ? `AED ${quantityConfig.price} each` : `AED ${currentPrice} each`,
                        quantity,
                        setQuantity,
                        quantityConfig.min,
                        quantityConfig.max
                      )}
                    </div>
                  </div>
                )}

                {/* Add-Ons Selection */}
                {availableAddons.length > 0 && (
                  <div>
                    <label className="text-sm font-bold text-foreground mb-3 block">Add-Ons</label>
                    <div className="space-y-2">
                      {availableAddons.map((addon) => {
                        const isSelected = selectedAddonIds.has(addon.id);
                        return (
                          <button
                            key={addon.id}
                            type="button"
                            onClick={() => {
                              setSelectedAddonIds(prev => {
                                const next = new Set(prev);
                                if (next.has(addon.id)) next.delete(addon.id);
                                else next.add(addon.id);
                                return next;
                              });
                            }}
                            className={cn(
                              "w-full text-left border rounded-2xl p-4 transition-all duration-300",
                              isSelected
                                ? "border-secondary bg-secondary/10 shadow-md"
                                : "border-border bg-card/50 hover:border-secondary/50"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-bold text-sm text-foreground">{addon.name}</p>
                                {addon.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{addon.description}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-foreground">AED {addon.price}</span>
                                <div className={cn(
                                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                  isSelected ? "bg-secondary border-secondary" : "border-border"
                                )}>
                                  {isSelected && <Check className="w-4 h-4 text-secondary-foreground" />}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Travel Type Selection */}
                {currentBookingFeatures.travel_options_enabled && (
                  <div className="border border-border rounded-2xl p-4 bg-card/50">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="w-5 h-5 text-secondary" />
                      <p className="font-bold text-foreground text-sm">Travel Type</p>
                    </div>
                    <RadioGroup
                      value={travelType}
                      onValueChange={(v) => {
                        setTravelType(v as "shared" | "self" | "personal");
                        if (v === "self" || v === "shared") setSelectedVehicleIdx("");
                      }}
                      className="space-y-2"
                    >
                      {[
                        { value: "shared", label: "Shared Transfers", desc: "Group transfer" },
                        { value: "self", label: "Direct To Boat", desc: currentBookingFeatures.self_travel_discount ? `Save AED ${currentBookingFeatures.self_travel_discount}/person` : "Arrive on your own" },
                        { value: "personal", label: "Private Transfers", desc: "Exclusive Vehicle" },
                      ].map((opt) => (
                        <div key={opt.value} className={cn(
                          "flex items-center gap-2 p-3 rounded-xl border transition-colors",
                          travelType === opt.value ? "border-secondary bg-secondary/10" : "border-border"
                        )}>
                          <RadioGroupItem value={opt.value} id={`modal-travel-${opt.value}`} />
                          <Label htmlFor={`modal-travel-${opt.value}`} className="cursor-pointer flex-1">
                            <span className="font-medium text-sm block">{opt.label}</span>
                            <span className="text-xs text-muted-foreground">{opt.desc}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Transfer Vehicle Selection */}
                {currentBookingFeatures.transfer_available !== false && vehicles.length > 0 && travelType === "personal" && (
                  <div className="border border-border rounded-2xl p-4 bg-card/50">
                    <div className="flex items-center gap-3 mb-3">
                      <Car className="w-5 h-5 text-secondary" />
                      <p className="font-bold text-foreground text-sm">
                        {currentBookingFeatures.transfer_label || "Hotel/Residence Transfer"}
                      </p>
                    </div>
                    <Select value={selectedVehicleIdx} onValueChange={setSelectedVehicleIdx}>
                      <SelectTrigger className="rounded-xl border-2">
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                      <SelectContent className="bg-card z-50 rounded-xl">
                        {vehicles.map((v, idx) => (
                          <SelectItem key={idx} value={String(idx)}>
                            {v.name} — AED {v.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Deck Seating Option */}
                {currentBookingFeatures.has_upper_deck && (
                  <div className="border border-border rounded-2xl p-4 bg-card/50">
                    <div className="flex items-center gap-3 mb-3">
                      <Layers className="w-5 h-5 text-secondary" />
                      <p className="font-bold text-foreground text-sm">Preferred Seating</p>
                    </div>
                    <RadioGroup
                      value={selectedDeck}
                      onValueChange={setSelectedDeck}
                      className="flex flex-col sm:flex-row gap-3"
                    >
                      {(currentBookingFeatures.deck_options || ["Lower Deck", "Upper Deck"]).map((option, idx) => (
                        <div key={option} className="flex items-center gap-2">
                          <RadioGroupItem value={option} id={`modal-deck-${option}`} />
                          <Label htmlFor={`modal-deck-${option}`} className="text-sm cursor-pointer">
                            {option}
                            {idx === 1 && currentBookingFeatures.upper_deck_surcharge ? ` (+AED ${currentBookingFeatures.upper_deck_surcharge}/person)` : ''}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Quick Price Preview - Enhanced */}
                <div className="bg-muted/30 border border-border rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                  <span className="text-sm sm:text-base text-muted-foreground font-medium">
                    {isCurrentFullYacht ? "Charter Price" : "Estimated Total"}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-foreground">AED {subtotal.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Step 2: Your Details */}
            {currentStep === 2 && (
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Your Details</h2>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">Enter your contact information</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-foreground mb-2 block">Full Name *</label>
                    <Input
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 sm:h-14 rounded-xl border-2 border-border focus:border-secondary text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-foreground mb-2 block">Email *</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 sm:h-14 rounded-xl border-2 border-border focus:border-secondary text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-foreground mb-2 block">Phone Number *</label>
                    <Input
                      type="tel"
                      placeholder="+971 50 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 sm:h-14 rounded-xl border-2 border-border focus:border-secondary text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-foreground mb-2 block">Special Requests</label>
                    <Textarea
                      placeholder="Any dietary requirements, celebrations, or special needs..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={3}
                      className="min-h-[80px] sm:min-h-[100px] rounded-xl border-2 border-border focus:border-secondary"
                    />
                  </div>
                </div>

                {/* Discount Code */}
                <div className="pt-2">
                  <DiscountCodeInput
                    orderAmount={subtotal}
                    tourId={selectedTourId}
                    onDiscountApplied={setAppliedDiscount}
                    appliedDiscount={appliedDiscount}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {currentStep === 3 && (
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Confirm Booking</h2>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">Review your booking details</p>
                </div>

                <div className="bg-muted/30 border border-border rounded-2xl p-4 sm:p-5 space-y-3">
                  <h3 className="font-bold text-foreground text-base sm:text-lg line-clamp-2">{currentTour.title}</h3>

                  {/* Full Yacht Badge in Summary */}
                  {isCurrentFullYacht && (
                    <div className="flex items-center gap-2 p-2 bg-secondary/10 rounded-xl w-fit">
                      <Ship className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-semibold text-secondary">Full Yacht Charter</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div className="bg-card rounded-xl p-3">
                      <p className="text-muted-foreground text-xs mb-1">Date</p>
                      <p className="font-semibold">{date ? format(date, "EEE, MMM d") : "-"}</p>
                    </div>
                    <div className="bg-card rounded-xl p-3">
                      <p className="text-muted-foreground text-xs mb-1">
                        {isCurrentFullYacht ? "Type" : bookingMode === "quantity" ? "Quantity" : "Guests"}
                      </p>
                      <p className="font-semibold">
                        {isCurrentFullYacht ? (
                          <>Private Charter{currentCapacity && ` (${currentCapacity})`}</>
                        ) : bookingMode === "quantity" ? (
                          <>{quantity} x {quantityConfig.label}</>
                        ) : (
                          <>
                            {guestCategories.map((cat, i) => {
                              const count = guestCounts[i] || 0;
                              if (count === 0) return null;
                              return <span key={i}>{i > 0 && ', '}{count} {cat.name}</span>;
                            })}
                          </>
                        )}
                      </p>
                    </div>
                    <div className="bg-card rounded-xl p-3">
                      <p className="text-muted-foreground text-xs mb-1">Name</p>
                      <p className="font-semibold truncate">{name}</p>
                    </div>
                    <div className="bg-card rounded-xl p-3">
                      <p className="text-muted-foreground text-xs mb-1">Email</p>
                      <p className="font-semibold truncate text-xs">{email}</p>
                    </div>
                    <div className="col-span-2 bg-card rounded-xl p-3">
                      <p className="text-muted-foreground text-xs mb-1">Phone</p>
                      <p className="font-semibold">{phone}</p>
                    </div>
                  </div>
                  {currentBookingFeatures.travel_options_enabled && (
                    <div className="pt-3 border-t border-border flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <p className="text-sm font-medium">{travelType === "shared" ? "Shared Transfers" : travelType === "self" ? "Direct To Boat" : "Private Transfers"}</p>
                    </div>
                  )}
                  {selectedVehicle && (
                    <div className="pt-3 border-t border-border flex items-center gap-2">
                      <Car className="w-4 h-4 text-secondary" />
                      <p className="text-sm font-medium">{selectedVehicle.name} — AED {selectedVehicle.price}</p>
                    </div>
                  )}
                  {selectedDeck && (
                    <div className="pt-3 border-t border-border flex items-center gap-2">
                      <Layers className="w-4 h-4 text-secondary" />
                      <p className="text-sm font-medium">{selectedDeck}</p>
                    </div>
                  )}
                  {specialRequests && (
                    <div className="pt-3 border-t border-border">
                      <p className="text-muted-foreground text-xs mb-1">Special Requests</p>
                      <p className="text-sm line-clamp-2">{specialRequests}</p>
                    </div>
                  )}
                </div>

                {/* Price Breakdown - Enhanced */}
                <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-2xl p-4 sm:p-5 space-y-3">
                  {isCurrentFullYacht ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Ship className="w-4 h-4" />
                        Full Yacht Charter
                      </span>
                      <span className="font-medium">AED {currentFullYachtPrice?.toLocaleString()}</span>
                    </div>
                  ) : bookingMode === "quantity" ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {quantity} × {quantityConfig.label} @ AED {quantityConfig.price > 0 ? quantityConfig.price : currentPrice}
                      </span>
                      <span className="font-medium">AED {quantityBasedPrice.toLocaleString()}</span>
                    </div>
                  ) : (
                    <>
                      {guestCategories.map((cat, i) => {
                        const count = guestCounts[i] || 0;
                        if (count === 0) return null;
                        const catPrice = cat.price > 0 ? cat.price : currentPrice;
                        return (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {count} {cat.name} × AED {catPrice}
                            </span>
                            <span className="font-medium">AED {(catPrice * count).toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </>
                  )}
                  {/* Add-ons in breakdown */}
                  {availableAddons.filter(a => selectedAddonIds.has(a.id)).map((addon) => (
                    <div key={addon.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Gift className="w-4 h-4" />
                        {addon.name}
                      </span>
                      <span className="font-medium">AED {addon.price}</span>
                    </div>
                  ))}
                  {selfDiscount > 0 && (
                    <div className="flex justify-between text-sm text-secondary">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {travelType === "self" ? "Direct To Boat discount" : "Standard transfer removed"}
                      </span>
                      <span className="font-medium">- AED {selfDiscount} ({totalGuests} × {currentBookingFeatures.self_travel_discount})</span>
                    </div>
                  )}
                  {transferCost > 0 && selectedVehicle && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        Transfer ({selectedVehicle.name})
                      </span>
                      <span className="font-medium">AED {transferCost}</span>
                    </div>
                  )}
                  {deckSurcharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Upper deck (+AED {currentBookingFeatures.upper_deck_surcharge}/person)
                      </span>
                      <span className="font-medium">AED {deckSurcharge}</span>
                    </div>
                  )}
                  {appliedDiscount && discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-secondary font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        Discount ({appliedDiscount.code})
                      </span>
                      <span>- AED {discountAmount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t border-secondary/20">
                    <span className="font-bold text-base">Total</span>
                    <div className="text-right">
                      {discountAmount > 0 && (
                        <p className="text-sm text-muted-foreground line-through">AED {subtotal.toLocaleString()}</p>
                      )}
                      <span className="text-2xl sm:text-3xl font-bold text-foreground">AED {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Error display */}
                {submitError && (
                  <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Unable to complete booking</p>
                      <p className="text-destructive/80 mt-0.5">{submitError}</p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  By confirming, you agree to our terms and conditions. Free cancellation up to 24 hours before the tour.
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons - Enhanced */}
          <div className="flex gap-3 sm:gap-4 mt-8 sm:mt-10 pb-safe">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex-1 h-12 sm:h-14 text-sm sm:text-base rounded-xl border-2"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Back
              </Button>
            )}
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                className="flex-1 h-12 sm:h-14 bg-secondary text-secondary-foreground hover:bg-secondary/90 text-sm sm:text-base rounded-xl font-semibold shadow-lg shadow-secondary/30 transition-all hover:shadow-xl hover:shadow-secondary/40"
              >
                Continue to {currentStep === 1 ? "Details" : "Confirm"}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 h-12 sm:h-14 bg-secondary text-secondary-foreground hover:bg-secondary/90 text-sm sm:text-base rounded-xl font-semibold shadow-lg shadow-secondary/30 transition-all hover:shadow-xl hover:shadow-secondary/40"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <Check className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;