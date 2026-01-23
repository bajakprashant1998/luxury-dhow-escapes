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
  Plus
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
import Layout from "@/components/layout/Layout";
import { tours } from "@/data/tours";
import { useToast } from "@/hooks/use-toast";

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
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [selectedTour, setSelectedTour] = useState<string>("");

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
      title: "Booking Request Submitted!",
      description: "We'll contact you shortly to confirm your reservation.",
    });
    form.reset();
    setAdults(2);
    setChildren(0);
    setInfants(0);
    setSelectedTour("");
  };

  const tour = tours.find((t) => t.id === selectedTour);
  const totalPrice = tour
    ? tour.price * adults + tour.price * 0.5 * children
    : 0;

  // Generate date options for next 30 days
  const dateOptions = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split("T")[0];
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920"
            alt="Dubai Marina"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <p className="text-secondary font-semibold tracking-wider uppercase mb-4">
              Book Your Experience
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Reserve Your Cruise
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Complete the form below to book your dhow cruise experience. 
              Our team will confirm your reservation within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl p-8 shadow-lg">
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Booking Details
                </h2>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Tour Selection */}
                    <FormField
                      control={form.control}
                      name="tourId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Tour *</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedTour(value);
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose your cruise experience" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tours.map((tour) => (
                                <SelectItem key={tour.id} value={tour.id}>
                                  {tour.title} - AED {tour.price}
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
                          <FormLabel>Preferred Date *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a date" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {dateOptions.map((date) => (
                                <SelectItem key={date} value={date}>
                                  {new Date(date).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
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
                      <FormLabel className="mb-4 block">Number of Guests *</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Adults */}
                        <div className="bg-muted rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Adults</span>
                            <span className="text-sm text-muted-foreground">12+ years</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newValue = Math.max(1, adults - 1);
                                setAdults(newValue);
                                form.setValue("adults", newValue);
                              }}
                              disabled={adults <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-semibold text-lg">{adults}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
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
                        <div className="bg-muted rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Children</span>
                            <span className="text-sm text-muted-foreground">4-11 years</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newValue = Math.max(0, children - 1);
                                setChildren(newValue);
                                form.setValue("children", newValue);
                              }}
                              disabled={children <= 0}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-semibold text-lg">{children}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newValue = children + 1;
                                setChildren(newValue);
                                form.setValue("children", newValue);
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">50% off adult price</p>
                        </div>

                        {/* Infants */}
                        <div className="bg-muted rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Infants</span>
                            <span className="text-sm text-muted-foreground">0-3 years</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newValue = Math.max(0, infants - 1);
                                setInfants(newValue);
                                form.setValue("infants", newValue);
                              }}
                              disabled={infants <= 0}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-semibold text-lg">{infants}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newValue = infants + 1;
                                setInfants(newValue);
                                form.setValue("infants", newValue);
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">Free</p>
                        </div>
                      </div>
                    </div>

                    <hr className="border-border" />

                    {/* Contact Information */}
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      Contact Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John Smith" {...field} />
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
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="+971 50 123 4567" {...field} />
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
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" type="email" {...field} />
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
                          <FormLabel>Special Requests</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any dietary requirements, celebrations, or special requests..."
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Price Summary */}
                    {tour && (
                      <div className="bg-cream rounded-lg p-6">
                        <h4 className="font-semibold text-foreground mb-4">Price Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Adults ({adults} × AED {tour.price})</span>
                            <span>AED {adults * tour.price}</span>
                          </div>
                          {children > 0 && (
                            <div className="flex justify-between">
                              <span>Children ({children} × AED {tour.price * 0.5})</span>
                              <span>AED {children * tour.price * 0.5}</span>
                            </div>
                          )}
                          {infants > 0 && (
                            <div className="flex justify-between text-muted-foreground">
                              <span>Infants ({infants})</span>
                              <span>Free</span>
                            </div>
                          )}
                          <hr className="border-border my-2" />
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span className="text-secondary">AED {totalPrice}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-lg h-14"
                    >
                      Submit Booking Request
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      ✓ Instant confirmation • ✓ Free cancellation up to 24h • ✓ Best price guaranteed
                    </p>
                  </form>
                </Form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Info Card */}
              <div className="bg-card rounded-xl p-6 shadow-lg">
                <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                  Contact Us Directly
                </h3>
                <div className="space-y-4">
                  <a
                    href="tel:+971501234567"
                    className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Call Us</p>
                      <p className="text-sm text-muted-foreground">+971 50 123 4567</p>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/971501234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">Quick Response</p>
                    </div>
                  </a>

                  <a
                    href="mailto:info@betterviewtourism.com"
                    className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email Us</p>
                      <p className="text-sm text-muted-foreground">info@betterviewtourism.com</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Office Location */}
              <div className="bg-card rounded-xl p-6 shadow-lg">
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  Our Office
                </h3>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-secondary mt-1" />
                  <div>
                    <p className="text-foreground">Dubai Marina Walk</p>
                    <p className="text-muted-foreground text-sm">Dubai, United Arab Emirates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-secondary mt-1" />
                  <div>
                    <p className="text-foreground">Open Daily</p>
                    <p className="text-muted-foreground text-sm">9:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-primary rounded-xl p-6 text-primary-foreground">
                <h3 className="font-display text-lg font-semibold mb-4">Book with Confidence</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    Instant confirmation
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    Free cancellation (24h notice)
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    Best price guaranteed
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    Secure payment options
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    24/7 customer support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
