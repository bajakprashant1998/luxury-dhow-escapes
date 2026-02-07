import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Minus,
  Plus,
  Shield,
  Star,
  CreditCard,
  Headphones,
  Ship,
  Sparkles,
  PartyPopper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Layout from "@/components/layout/Layout";
import { tours } from "@/data/tours";
import { useToast } from "@/hooks/use-toast";
import heroDhowCruise from "@/assets/hero-dhow-cruise.webp";
import DiscountCodeInput from "@/components/booking/DiscountCodeInput";
import { Discount } from "@/hooks/useDiscounts";
import { useContactConfig } from "@/hooks/useContactConfig";
import { supabase } from "@/integrations/supabase/client";
import { sendBookingEmail } from "@/lib/sendBookingEmail";

const bookingSchema = z.object({
  tourId: z.string().min(1, "Please select a tour"),
  date: z.string().min(1, "Please select a date"),
  adults: z.number().min(1, "At least 1 adult is required"),
  children: z.number().min(0),
  infants: z.number().min(0),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

// Confetti component
const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ['#d4a853', '#1a2d4f', '#f0e6d3', '#4a7c59', '#c44536'][Math.floor(Math.random() * 5)],
          }}
          initial={{
            top: -20,
            rotate: 0,
            opacity: 1
          }}
          animate={{
            top: '100vh',
            rotate: 720,
            opacity: 0
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

const Contact = () => {
  const { toast } = useToast();
  const { phone, phoneFormatted, email, whatsappLinkWithGreeting } = useContactConfig();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [selectedTour, setSelectedTour] = useState<string>("");
  const [step, setStep] = useState(1);
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      tourId: "",
      date: "",
      adults: 2,
      children: 0,
      infants: 0,
      name: "",
      email: "",
      phone: "",
      specialRequests: "",
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);

    try {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();
      const bookingId = crypto.randomUUID();

      const bookingData: any = {
        id: bookingId,
        tour_id: data.tourId,
        tour_name: tours.find(t => t.id === data.tourId)?.title || "Unknown Tour",
        booking_date: data.date,
        adults: data.adults,
        children: data.children,
        infants: data.infants,
        customer_name: data.name,
        customer_email: data.email,
        customer_phone: data.phone,
        special_requests: data.specialRequests || null,
        total_price: finalPrice,
        status: "pending",
        booking_type: "per_person",
      };

      if (user?.id) {
        bookingData.user_id = user.id;
      }

      const { error } = await supabase.from("bookings").insert(bookingData);

      if (error) {
        console.error("Booking error:", error);
        if (error.code === "42501") {
          throw new Error("Unable to create booking. Permission denied.");
        }
        throw new Error(error.message);
      }

      // Send confirmation email
      sendBookingEmail(bookingId, "pending").catch(console.warn);

      console.log("Booking submitted successfully:", bookingId);
      setShowConfetti(true);

      toast({
        title: "🎉 Booking Request Submitted!",
        description: "We'll contact you shortly to confirm your reservation.",
      });

      // Hide confetti after 4 seconds
      setTimeout(() => setShowConfetti(false), 4000);

      form.reset();
      setAdults(2);
      setChildren(0);
      setInfants(0);
      setSelectedTour("");
      setStep(1);
      setAppliedDiscount(null);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tour = tours.find((t) => t.id === selectedTour);
  const totalPrice = tour
    ? tour.price * adults + tour.price * 0.5 * children
    : 0;

  // Calculate discount
  const calculateDiscountAmount = () => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.type === "percentage") {
      return (totalPrice * appliedDiscount.value) / 100;
    }
    return Math.min(appliedDiscount.value, totalPrice);
  };

  const discountAmount = calculateDiscountAmount();
  const finalPrice = totalPrice - discountAmount;

  // Calculate progress percentage
  const progressPercentage = ((step - 1) / 2) * 100;

  // Generate date options for next 30 days
  const dateOptions = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split("T")[0];
  });

  const benefits = [
    { icon: Shield, title: "Best Price Guarantee", description: "Find it cheaper? We'll match it" },
    { icon: Clock, title: "Instant Confirmation", description: "No waiting, book and go" },
    { icon: Headphones, title: "24/7 Support", description: "We're always here for you" },
    { icon: CreditCard, title: "Secure Payment", description: "100% safe transactions" },
  ];

  const faqs = [
    {
      question: "How do I confirm my booking?",
      answer: "After submitting your booking request, our team will contact you within 2 hours to confirm availability and process payment. You'll receive a confirmation email with all details.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, Amex), bank transfers, and cash payment upon arrival. Online payment is recommended to secure your spot.",
    },
    {
      question: "Can I modify or cancel my booking?",
      answer: "Yes! Free cancellation is available up to 24 hours before your cruise. Modifications can be made subject to availability. Contact us as soon as possible for any changes.",
    },
    {
      question: "What should I bring?",
      answer: "We recommend comfortable shoes, a light jacket (AC on lower deck), camera, and valid ID. Smart casual dress code applies - no shorts or flip-flops please.",
    },
    {
      question: "Is hotel pickup included?",
      answer: "Hotel pickup is included with selected tours. Check the tour details or contact us to confirm if your chosen experience includes transfers from your hotel.",
    },
  ];

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <Layout>
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img
            src={heroDhowCruise}
            alt="Dubai Marina"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
        </motion.div>

        <div className="container relative z-10">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary px-4 py-2 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Secure Your Spot Today</span>
            </motion.div>
            <motion.h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Book Your <span className="text-secondary">Dream Cruise</span>
            </motion.h1>
            <motion.p
              className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Complete your reservation in minutes. Our team will confirm within 2 hours and you'll be ready to set sail!
            </motion.p>
          </motion.div>
        </div>

        {/* Floating Stats with Stagger Animation */}
        <div className="absolute  left-0 right-0 translate-y-1/2 z-20">
          <div className="container">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.5 },
                },
              }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-card rounded-xl p-4 shadow-lg border border-border flex items-center gap-3 hover:shadow-xl transition-shadow"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ y: -2 }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <benefit.icon className="w-5 h-5 text-secondary" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{benefit.title}</p>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="pt-24 pb-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Booking Form */}
            <div className="lg:col-span-2">
              <motion.div
                className="bg-card rounded-2xl p-6 md:p-8 shadow-xl border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Progress Steps with Animated Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    {[
                      { num: 1, label: "Select Tour" },
                      { num: 2, label: "Your Details" },
                      { num: 3, label: "Confirm" },
                    ].map((s, index) => (
                      <div key={s.num} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <motion.div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s.num
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted text-muted-foreground"
                              }`}
                            animate={{
                              scale: step === s.num ? 1.1 : 1,
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {step > s.num ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </motion.div>
                            ) : (
                              s.num
                            )}
                          </motion.div>
                          <span className={`text-xs mt-2 hidden sm:block ${step >= s.num ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                            {s.label}
                          </span>
                        </div>
                        {index < 2 && (
                          <div className="flex-1 h-1 mx-2 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              className="h-full bg-secondary"
                              initial={{ width: "0%" }}
                              animate={{
                                width: step > s.num ? "100%" : "0%"
                              }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Progress percentage */}
                  <motion.div
                    className="text-center text-sm text-muted-foreground"
                    key={step}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Step {step} of 3 • {Math.round(progressPercentage + 33.33)}% complete
                  </motion.div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <AnimatePresence mode="wait">
                      {/* Step 1: Tour Selection */}
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          className="space-y-6"
                          variants={stepVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.3 }}
                        >
                          <div>
                            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                              Choose Your Experience
                            </h2>
                            <p className="text-muted-foreground">Select your preferred cruise and date</p>
                          </div>

                          {/* Tour Selection with Preview */}
                          <FormField
                            control={form.control}
                            name="tourId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base">Select Tour *</FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    setSelectedTour(value);
                                  }}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-12">
                                      <SelectValue placeholder="Choose your cruise experience" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-card z-50 max-h-80">
                                    {tours.map((t) => (
                                      <SelectItem key={t.id} value={t.id} className="py-3">
                                        <div className="flex items-center gap-3">
                                          <img
                                            src={t.image}
                                            alt={t.title}
                                            className="w-10 h-10 rounded-lg object-cover"
                                          />
                                          <div className="flex-1">
                                            <p className="font-medium">{t.title}</p>
                                            <p className="text-xs text-muted-foreground">{t.duration}</p>
                                          </div>
                                          <span className="text-secondary font-semibold">AED {t.price}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Selected Tour Preview */}
                          <AnimatePresence>
                            {tour && (
                              <motion.div
                                className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                              >
                                <img src={tour.image} alt={tour.title} className="w-16 h-16 rounded-lg object-cover" />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-foreground">{tour.title}</h4>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    <span>{tour.duration}</span>
                                    <span className="mx-1">•</span>
                                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                                    <span>{tour.rating}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-secondary">AED {tour.price}</p>
                                  <p className="text-xs text-muted-foreground">per person</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Date Selection */}
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base">Preferred Date *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-12">
                                      <SelectValue placeholder="Select a date" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-card z-50">
                                    {dateOptions.map((date) => (
                                      <SelectItem key={date} value={date}>
                                        <div className="flex items-center gap-3">
                                          <Calendar className="w-4 h-4 text-secondary" />
                                          {new Date(date).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Guest Selection with Animations */}
                          <div>
                            <FormLabel className="text-base mb-4 block">Number of Guests *</FormLabel>
                            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3 sm:gap-4">
                              {/* Adults */}
                              <motion.div
                                className="bg-muted/50 rounded-xl p-3 sm:p-4 border border-border"
                                whileHover={{ borderColor: "hsl(var(--secondary))" }}
                              >
                                <div className="flex items-center justify-between sm:block">
                                  <div className="sm:mb-3">
                                    <span className="font-semibold text-foreground text-sm sm:text-base">Adults</span>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground">12+ years</p>
                                  </div>
                                  <div className="flex items-center gap-2 sm:gap-0 sm:justify-between">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-full touch-target"
                                      onClick={() => {
                                        const newValue = Math.max(1, adults - 1);
                                        setAdults(newValue);
                                        form.setValue("adults", newValue);
                                      }}
                                      disabled={adults <= 1}
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                    <motion.span
                                      className="font-bold text-lg sm:text-xl text-foreground w-8 text-center"
                                      key={adults}
                                      initial={{ scale: 1.2 }}
                                      animate={{ scale: 1 }}
                                    >
                                      {adults}
                                    </motion.span>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-full touch-target"
                                      onClick={() => {
                                        const newValue = adults + 1;
                                        setAdults(newValue);
                                        form.setValue("adults", newValue);
                                      }}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>

                              {/* Children */}
                              <motion.div
                                className="bg-muted/50 rounded-xl p-3 sm:p-4 border border-border"
                                whileHover={{ borderColor: "hsl(var(--secondary))" }}
                              >
                                <div className="flex items-center justify-between sm:block">
                                  <div className="sm:mb-3">
                                    <span className="font-semibold text-foreground text-sm sm:text-base">Children</span>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground">4-11 yrs • 50% off</p>
                                  </div>
                                  <div className="flex items-center gap-2 sm:gap-0 sm:justify-between">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-full touch-target"
                                      onClick={() => {
                                        const newValue = Math.max(0, children - 1);
                                        setChildren(newValue);
                                        form.setValue("children", newValue);
                                      }}
                                      disabled={children <= 0}
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                    <motion.span
                                      className="font-bold text-lg sm:text-xl text-foreground w-8 text-center"
                                      key={children}
                                      initial={{ scale: 1.2 }}
                                      animate={{ scale: 1 }}
                                    >
                                      {children}
                                    </motion.span>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-full touch-target"
                                      onClick={() => {
                                        const newValue = children + 1;
                                        setChildren(newValue);
                                        form.setValue("children", newValue);
                                      }}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>

                              {/* Infants */}
                              <motion.div
                                className="bg-muted/50 rounded-xl p-3 sm:p-4 border border-border"
                                whileHover={{ borderColor: "hsl(var(--secondary))" }}
                              >
                                <div className="flex items-center justify-between sm:block">
                                  <div className="sm:mb-3">
                                    <span className="font-semibold text-foreground text-sm sm:text-base">Infants</span>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground">0-3 yrs • Free</p>
                                  </div>
                                  <div className="flex items-center gap-2 sm:gap-0 sm:justify-between">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-full touch-target"
                                      onClick={() => {
                                        const newValue = Math.max(0, infants - 1);
                                        setInfants(newValue);
                                        form.setValue("infants", newValue);
                                      }}
                                      disabled={infants <= 0}
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                    <motion.span
                                      className="font-bold text-lg sm:text-xl text-foreground w-8 text-center"
                                      key={infants}
                                      initial={{ scale: 1.2 }}
                                      animate={{ scale: 1 }}
                                    >
                                      {infants}
                                    </motion.span>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-full touch-target"
                                      onClick={() => {
                                        const newValue = infants + 1;
                                        setInfants(newValue);
                                        form.setValue("infants", newValue);
                                      }}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          </div>

                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <Button
                              type="button"
                              size="lg"
                              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-lg h-14 group"
                              onClick={() => {
                                if (selectedTour && form.getValues("date")) {
                                  setStep(2);
                                } else {
                                  toast({
                                    title: "Please complete all fields",
                                    description: "Select a tour and date to continue.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                            >
                              Continue to Details
                              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </motion.div>
                        </motion.div>
                      )}

                      {/* Step 2: Contact Information */}
                      {step === 2 && (
                        <motion.div
                          key="step2"
                          className="space-y-6"
                          variants={stepVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.3 }}
                        >
                          <div>
                            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                              Your Details
                            </h2>
                            <p className="text-muted-foreground">We'll use this to confirm your booking</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base">Full Name *</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="John Smith"
                                      className="h-12 transition-all focus:ring-2 focus:ring-secondary/30"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base">Phone Number *</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="+971 50 123 4567"
                                      className="h-12 transition-all focus:ring-2 focus:ring-secondary/30"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base">Email Address *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="your@email.com"
                                    type="email"
                                    className="h-12 transition-all focus:ring-2 focus:ring-secondary/30"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="specialRequests"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base">Special Requests (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Any dietary requirements, celebrations, accessibility needs..."
                                    rows={4}
                                    className="transition-all focus:ring-2 focus:ring-secondary/30"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex gap-4">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                className="w-full h-14 group"
                                onClick={() => setStep(1)}
                              >
                                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                Back
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                              <Button
                                type="button"
                                size="lg"
                                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-lg h-14 group"
                                onClick={() => {
                                  const { name, email, phone } = form.getValues();
                                  if (name && email && phone) {
                                    setStep(3);
                                  } else {
                                    toast({
                                      title: "Please complete all fields",
                                      description: "Name, email, and phone are required.",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                              >
                                Review Booking
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Confirmation */}
                      {step === 3 && (
                        <motion.div
                          key="step3"
                          className="space-y-6"
                          variants={stepVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.3 }}
                        >
                          <div>
                            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                              Review & Confirm
                            </h2>
                            <p className="text-muted-foreground">Please review your booking details</p>
                          </div>

                          {/* Booking Summary */}
                          <motion.div
                            className="bg-muted/50 rounded-xl p-6 space-y-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div className="flex items-start gap-4">
                              {tour && (
                                <motion.img
                                  src={tour.image}
                                  alt={tour.title}
                                  className="w-20 h-20 rounded-lg object-cover"
                                  whileHover={{ scale: 1.05 }}
                                />
                              )}
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground">{tour?.title}</h3>
                                <p className="text-sm text-muted-foreground">{tour?.duration}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="w-4 h-4 fill-secondary text-secondary" />
                                  <span className="text-sm font-medium">{tour?.rating}</span>
                                  <span className="text-sm text-muted-foreground">({tour?.reviewCount} reviews)</span>
                                </div>
                              </div>
                            </div>

                            <hr className="border-border" />

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Date</p>
                                <p className="font-medium text-foreground">
                                  {form.getValues("date") && new Date(form.getValues("date")).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Guests</p>
                                <p className="font-medium text-foreground">
                                  {adults} Adult{adults > 1 ? "s" : ""}
                                  {children > 0 && `, ${children} Child${children > 1 ? "ren" : ""}`}
                                  {infants > 0 && `, ${infants} Infant${infants > 1 ? "s" : ""}`}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Name</p>
                                <p className="font-medium text-foreground">{form.getValues("name")}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Contact</p>
                                <p className="font-medium text-foreground">{form.getValues("phone")}</p>
                              </div>
                            </div>
                          </motion.div>

                          {/* Discount Code */}
                          {tour && (
                            <DiscountCodeInput
                              orderAmount={totalPrice}
                              tourId={tour.id}
                              onDiscountApplied={setAppliedDiscount}
                              appliedDiscount={appliedDiscount}
                            />
                          )}

                          {/* Price Summary */}
                          {tour && (
                            <motion.div
                              className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-6 border border-secondary/20"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <h4 className="font-semibold text-foreground mb-4">Price Summary</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Adults ({adults} × AED {tour.price})</span>
                                  <span className="font-medium">AED {adults * tour.price}</span>
                                </div>
                                {children > 0 && (
                                  <div className="flex justify-between">
                                    <span>Children ({children} × AED {tour.price * 0.5})</span>
                                    <span className="font-medium">AED {children * tour.price * 0.5}</span>
                                  </div>
                                )}
                                {infants > 0 && (
                                  <div className="flex justify-between text-muted-foreground">
                                    <span>Infants ({infants})</span>
                                    <span>Free</span>
                                  </div>
                                )}
                                {appliedDiscount && (
                                  <>
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>Subtotal</span>
                                      <span>AED {totalPrice}</span>
                                    </div>
                                    <motion.div
                                      className="flex justify-between text-secondary"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                    >
                                      <span>
                                        Discount ({appliedDiscount.code})
                                      </span>
                                      <span>-AED {discountAmount.toFixed(0)}</span>
                                    </motion.div>
                                  </>
                                )}
                                <hr className="border-border my-3" />
                                <motion.div
                                  className="flex justify-between font-bold text-xl"
                                  initial={{ scale: 0.95 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  <span>Total</span>
                                  <span className="text-secondary">AED {finalPrice.toFixed(0)}</span>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}

                          <div className="flex gap-4">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                className="w-full h-14 group"
                                onClick={() => setStep(2)}
                              >
                                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                Back
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1"
                            >
                              <Button
                                type="submit"
                                size="lg"
                                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-lg h-14 group"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <>
                                    <motion.div
                                      className="w-5 h-5 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full mr-2"
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    Confirm Booking
                                    <CheckCircle2 className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          </div>

                          <motion.p
                            className="text-center text-sm text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            ✓ No payment required now • ✓ Free cancellation up to 24h • ✓ Instant confirmation
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </Form>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Info Card */}
              <motion.div
                className="bg-card rounded-2xl p-6 shadow-lg border border-border"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                  Need Help?
                </h3>
                <div className="space-y-3">
                  <motion.a
                    href={`tel:${phone}`}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors group"
                    whileHover={{ x: 4 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Call Us</p>
                      <p className="text-sm text-muted-foreground">{phoneFormatted}</p>
                    </div>
                  </motion.a>

                  <motion.a
                    href={whatsappLinkWithGreeting()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-accent/10 rounded-xl hover:bg-accent/20 transition-colors group"
                    whileHover={{ x: 4 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">Chat with us now</p>
                    </div>
                    <motion.div
                      className="ml-auto"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="inline-block w-2 h-2 bg-accent rounded-full" />
                    </motion.div>
                  </motion.a>

                  <motion.a
                    href={`mailto:${email}`}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors group"
                    whileHover={{ x: 4 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">{email}</p>
                    </div>
                  </motion.a>
                </div>
              </motion.div>

              {/* Map Card */}
              <motion.div
                className="bg-card rounded-2xl p-6 shadow-lg border border-border"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    Our Location
                  </h3>
                </div>
                <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-4">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.168504346587!2d55.141849!3d25.0836259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6b5402c126e3%3A0xb9511e6655c46d7c!2sDubai%20Marina!5e0!3m2!1sen!2sae!4v1699444800000!5m2!1sen!2sae"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Dubai Marina Location"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Dubai Marina Promenade, Near Pier 7
                </p>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                className="bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-6 text-primary-foreground"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="font-display text-xl font-semibold mb-4">
                  Why Book With Us?
                </h3>
                <ul className="space-y-3">
                  {[
                    "Verified & Licensed Operator",
                    "10+ Years of Excellence",
                    "50,000+ Happy Guests",
                    "Best Price Guarantee",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-cream">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about booking your cruise experience
            </p>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-card rounded-xl px-6 border border-border shadow-sm"
                >
                  <AccordionTrigger className="text-left font-semibold hover:text-secondary transition-colors py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
