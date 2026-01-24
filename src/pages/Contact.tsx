import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  Minus,
  Plus,
  Shield,
  Star,
  CreditCard,
  Headphones,
  Ship,
  Sparkles
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
import heroDhowCruise from "@/assets/hero-dhow-cruise.jpg";
import DiscountCodeInput from "@/components/booking/DiscountCodeInput";
import { Discount } from "@/hooks/useDiscounts";
import { useContactConfig } from "@/hooks/useContactConfig";

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

const Contact = () => {
  const { toast } = useToast();
  const { phone, phoneFormatted, email, whatsappLinkWithGreeting } = useContactConfig();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [selectedTour, setSelectedTour] = useState<string>("");
  const [step, setStep] = useState(1);
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);

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

  const onSubmit = (data: BookingFormData) => {
    console.log("Booking submitted:", data);
    toast({
      title: "Booking Request Submitted! 🎉",
      description: "We'll contact you shortly to confirm your reservation.",
    });
    form.reset();
    setAdults(2);
    setChildren(0);
    setInfants(0);
    setSelectedTour("");
    setStep(1);
    setAppliedDiscount(null);
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroDhowCruise}
            alt="Dubai Marina"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Secure Your Spot Today</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Book Your <span className="text-secondary">Dream Cruise</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed">
              Complete your reservation in minutes. Our team will confirm within 2 hours and you'll be ready to set sail!
            </p>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-4 shadow-lg border border-border flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{benefit.title}</p>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="pt-24 pb-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl p-6 md:p-8 shadow-xl border border-border">
                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                  {[
                    { num: 1, label: "Select Tour" },
                    { num: 2, label: "Your Details" },
                    { num: 3, label: "Confirm" },
                  ].map((s, index) => (
                    <div key={s.num} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                            step >= s.num
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                        </div>
                        <span className={`text-xs mt-2 hidden sm:block ${step >= s.num ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                          {s.label}
                        </span>
                      </div>
                      {index < 2 && (
                        <div className={`flex-1 h-1 mx-2 rounded-full transition-colors ${step > s.num ? "bg-secondary" : "bg-muted"}`} />
                      )}
                    </div>
                  ))}
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Step 1: Tour Selection */}
                    {step === 1 && (
                      <div className="space-y-6 animate-fade-in">
                        <div>
                          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                            Choose Your Experience
                          </h2>
                          <p className="text-muted-foreground">Select your preferred cruise and date</p>
                        </div>

                        {/* Tour Selection */}
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
                                <SelectContent className="bg-card z-50">
                                  {tours.map((tour) => (
                                    <SelectItem key={tour.id} value={tour.id}>
                                      <div className="flex items-center gap-3">
                                        <Ship className="w-4 h-4 text-secondary" />
                                        <span>{tour.title}</span>
                                        <span className="text-secondary font-semibold ml-auto">AED {tour.price}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

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

                        {/* Guest Selection */}
                        <div>
                          <FormLabel className="text-base mb-4 block">Number of Guests *</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Adults */}
                            <div className="bg-muted/50 rounded-xl p-4 border border-border">
                              <div className="flex justify-between items-center mb-3">
                                <div>
                                  <span className="font-semibold text-foreground">Adults</span>
                                  <p className="text-xs text-muted-foreground">12+ years</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-10 w-10 rounded-full"
                                  onClick={() => {
                                    const newValue = Math.max(1, adults - 1);
                                    setAdults(newValue);
                                    form.setValue("adults", newValue);
                                  }}
                                  disabled={adults <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="font-bold text-xl text-foreground">{adults}</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-10 w-10 rounded-full"
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

                            {/* Children */}
                            <div className="bg-muted/50 rounded-xl p-4 border border-border">
                              <div className="flex justify-between items-center mb-3">
                                <div>
                                  <span className="font-semibold text-foreground">Children</span>
                                  <p className="text-xs text-muted-foreground">4-11 years • 50% off</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-10 w-10 rounded-full"
                                  onClick={() => {
                                    const newValue = Math.max(0, children - 1);
                                    setChildren(newValue);
                                    form.setValue("children", newValue);
                                  }}
                                  disabled={children <= 0}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="font-bold text-xl text-foreground">{children}</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-10 w-10 rounded-full"
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

                            {/* Infants */}
                            <div className="bg-muted/50 rounded-xl p-4 border border-border">
                              <div className="flex justify-between items-center mb-3">
                                <div>
                                  <span className="font-semibold text-foreground">Infants</span>
                                  <p className="text-xs text-muted-foreground">0-3 years • Free</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-10 w-10 rounded-full"
                                  onClick={() => {
                                    const newValue = Math.max(0, infants - 1);
                                    setInfants(newValue);
                                    form.setValue("infants", newValue);
                                  }}
                                  disabled={infants <= 0}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="font-bold text-xl text-foreground">{infants}</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-10 w-10 rounded-full"
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
                          </div>
                        </div>

                        <Button
                          type="button"
                          size="lg"
                          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-lg h-14"
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
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    )}

                    {/* Step 2: Contact Information */}
                    {step === 2 && (
                      <div className="space-y-6 animate-fade-in">
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
                                  <Input placeholder="John Smith" className="h-12" {...field} />
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
                                  <Input placeholder="+971 50 123 4567" className="h-12" {...field} />
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
                                <Input placeholder="your@email.com" type="email" className="h-12" {...field} />
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
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            className="flex-1 h-14"
                            onClick={() => setStep(1)}
                          >
                            Back
                          </Button>
                          <Button
                            type="button"
                            size="lg"
                            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-lg h-14"
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
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                      <div className="space-y-6 animate-fade-in">
                        <div>
                          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                            Review & Confirm
                          </h2>
                          <p className="text-muted-foreground">Please review your booking details</p>
                        </div>

                        {/* Booking Summary */}
                        <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                          <div className="flex items-start gap-4">
                            {tour && (
                              <img src={tour.image} alt={tour.title} className="w-20 h-20 rounded-lg object-cover" />
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
                        </div>

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
                          <div className="bg-secondary/10 rounded-xl p-6">
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
                                  <div className="flex justify-between text-secondary">
                                    <span>
                                      Discount ({appliedDiscount.code})
                                    </span>
                                    <span>-AED {discountAmount.toFixed(0)}</span>
                                  </div>
                                </>
                              )}
                              <hr className="border-border my-3" />
                              <div className="flex justify-between font-bold text-xl">
                                <span>Total</span>
                                <span className="text-secondary">AED {finalPrice.toFixed(0)}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            className="flex-1 h-14"
                            onClick={() => setStep(2)}
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            size="lg"
                            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-lg h-14"
                          >
                            Confirm Booking
                            <CheckCircle2 className="w-5 h-5 ml-2" />
                          </Button>
                        </div>

                        <p className="text-center text-sm text-muted-foreground">
                          ✓ No payment required now • ✓ Free cancellation up to 24h • ✓ Instant confirmation
                        </p>
                      </div>
                    )}
                  </form>
                </Form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Info Card */}
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                  Need Help?
                </h3>
                <div className="space-y-3">
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Call Us</p>
                      <p className="text-sm text-muted-foreground">{phoneFormatted}</p>
                    </div>
                  </a>

                  <a
                    href={whatsappLinkWithGreeting("Hi! I'd like to inquire about booking a cruise. Can you assist?")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-secondary/10 rounded-xl hover:bg-secondary/20 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">Quick Response</p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Email Us</p>
                      <p className="text-sm text-muted-foreground">{email}</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Office Location */}
              <div className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border">
                {/* Map Embed */}
                <div className="h-40 bg-muted relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.168573476899!2d55.13285531500675!3d25.080419183948297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6b5402c126e3%3A0x7f5cb26c7e6e1a2a!2sDubai%20Marina%20Walk!5e0!3m2!1sen!2sae!4v1620000000000!5m2!1sen!2sae"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Our Location
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Dubai Marina Walk</p>
                        <p className="text-sm text-muted-foreground">Dubai, United Arab Emirates</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-secondary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Open Daily</p>
                        <p className="text-sm text-muted-foreground">9:00 AM - 10:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
                <h3 className="font-display text-lg font-semibold mb-4">Book with Confidence</h3>
                <ul className="space-y-3">
                  {[
                    "Instant confirmation",
                    "Free cancellation (24h notice)",
                    "Best price guaranteed",
                    "Secure payment options",
                    "24/7 customer support",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl font-bold text-foreground mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Got questions? We've got answers.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left font-medium text-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
