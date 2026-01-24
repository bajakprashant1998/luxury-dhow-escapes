import { useState } from "react";
import { format } from "date-fns";
import { ArrowRight, ArrowLeft, Minus, Plus, CalendarIcon, Check } from "lucide-react";
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

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourTitle: string;
  tourId: string;
  price: number;
}

const steps = [
  { number: 1, label: "Select Tour" },
  { number: 2, label: "Your Details" },
  { number: 3, label: "Confirm" },
];

const BookingModal = ({ isOpen, onClose, tourTitle, tourId, price }: BookingModalProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Step 1 state
  const [date, setDate] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Step 2 state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const totalPrice = price * adults + price * 0.5 * children;

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
      if (!name || !email || !phone) {
        toast({ title: "Please fill in all required fields", variant: "destructive" });
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
    try {
      const { data: bookingData, error } = await supabase.from("bookings").insert({
        tour_id: tourId,
        tour_name: tourTitle,
        booking_date: format(date!, "yyyy-MM-dd"),
        adults,
        children,
        infants,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        special_requests: specialRequests || null,
        total_price: totalPrice,
        status: "pending",
      }).select().single();

      if (error) throw error;

      // Send confirmation email
      if (bookingData?.id) {
        const emailResult = await sendBookingEmail(bookingData.id, "pending");
        if (emailResult.success) {
          console.log("Booking confirmation email sent successfully");
        } else {
          console.warn("Failed to send booking email:", emailResult.error);
        }
      }

      toast({ 
        title: "Booking submitted successfully!", 
        description: "Check your email for confirmation details. We'll contact you shortly." 
      });
      onClose();
      // Reset form
      setCurrentStep(1);
      setDate(undefined);
      setAdults(2);
      setChildren(0);
      setInfants(0);
      setName("");
      setEmail("");
      setPhone("");
      setSpecialRequests("");
    } catch (error) {
      console.error("Booking error:", error);
      toast({ title: "Failed to submit booking", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const GuestCounter = ({ 
    label, 
    sublabel, 
    value, 
    onChange, 
    min = 0, 
    max = 10 
  }: { 
    label: string; 
    sublabel: string; 
    value: number; 
    onChange: (v: number) => void; 
    min?: number; 
    max?: number; 
  }) => (
    <div className="flex-1 border border-border rounded-xl p-4">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground mb-3">{sublabel}</p>
      <div className="flex items-center justify-between">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
          disabled={value <= min}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-xl font-bold">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">Book Your Experience</DialogTitle>
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-colors",
                      currentStep >= step.number
                        ? "bg-secondary text-secondary-foreground border-secondary"
                        : "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-16 sm:w-24 h-0.5 mx-2",
                      currentStep > step.number ? "bg-secondary" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="p-6 pt-4">
          {/* Step 1: Select Tour */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Choose Your Experience</h2>
                <p className="text-muted-foreground">Select your preferred cruise and date</p>
              </div>

              {/* Tour Selection */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Select Tour *</label>
                <Select defaultValue={tourTitle}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose your cruise experience" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    <SelectItem value={tourTitle}>{tourTitle}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Preferred Date *</label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50 bg-card" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      disabled={(d) => d < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guest Counters */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">Number of Guests *</label>
                <div className="flex gap-3">
                  <GuestCounter
                    label="Adults"
                    sublabel="12+ years"
                    value={adults}
                    onChange={setAdults}
                    min={1}
                  />
                  <GuestCounter
                    label="Children"
                    sublabel="4-11 years • 50% off"
                    value={children}
                    onChange={setChildren}
                  />
                  <GuestCounter
                    label="Infants"
                    sublabel="0-3 years • Free"
                    value={infants}
                    onChange={setInfants}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Your Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Your Details</h2>
                <p className="text-muted-foreground">Enter your contact information</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Full Name *</label>
                  <Input
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Email *</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Phone Number *</label>
                  <Input
                    type="tel"
                    placeholder="+971 50 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Special Requests</label>
                  <Textarea
                    placeholder="Any special requirements or requests..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Confirm Booking</h2>
                <p className="text-muted-foreground">Review your booking details</p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-foreground">{tourTitle}</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{date ? format(date, "EEEE, MMM d, yyyy") : "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Guests</p>
                    <p className="font-medium">
                      {adults} Adult{adults > 1 ? "s" : ""}
                      {children > 0 && `, ${children} Child${children > 1 ? "ren" : ""}`}
                      {infants > 0 && `, ${infants} Infant${infants > 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{phone}</p>
                  </div>
                </div>
                {specialRequests && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-muted-foreground text-sm">Special Requests</p>
                    <p className="text-sm">{specialRequests}</p>
                  </div>
                )}
              </div>

              <div className="bg-secondary/10 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Price</span>
                  <span className="text-2xl font-bold text-foreground">AED {totalPrice.toFixed(0)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {adults} adult{adults > 1 ? "s" : ""} × AED {price}
                  {children > 0 && ` + ${children} child${children > 1 ? "ren" : ""} × AED ${(price * 0.5).toFixed(0)}`}
                </p>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                By confirming, you agree to our terms and conditions. Free cancellation up to 24 hours before the tour.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1 h-12">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            {currentStep < 3 ? (
              <Button onClick={handleNext} className="flex-1 h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Continue to {currentStep === 1 ? "Details" : "Confirm"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="flex-1 h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                {isSubmitting ? "Submitting..." : "Confirm Booking"}
                <Check className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
