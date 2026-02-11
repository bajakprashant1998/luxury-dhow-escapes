import { Tables } from "@/integrations/supabase/types";

// Booking features interface
export interface BookingFeatures {
  urgency_enabled: boolean;
  urgency_text: string;
  availability_text: string;
  minimum_duration: string;
  hotel_pickup: boolean;
  hotel_pickup_text: string;
  cancellation_text: string;
  charter_features: string[];
  // Important Information section content
  cancellation_info: string[];
  what_to_bring: string[];
  good_to_know: string[];
  // Water activity fields
  equipment_list?: string[];
  safety_info?: string[];
  // Event fields
  decoration_options?: string[];
  catering_options?: string[];
  customization_notes?: string;
}

// Default Important Information content
export const defaultCancellationInfo = [
  "✓ Free cancellation up to 24 hours before the start time",
  "✓ Full refund for cancellations made within the free period",
  "✗ No refund for no-shows or late cancellations",
];

export const defaultWhatToBring = [
  "• Comfortable shoes and smart casual attire",
  "• Camera or smartphone for photos",
  "• Light jacket (air conditioning on lower deck)",
  "• Valid ID for verification",
];

export const defaultGoodToKnow = [
  "• Arrive 20-30 minutes before departure",
  "• Not wheelchair accessible",
  "• Vegetarian options available upon request",
  "• Dress code: Smart casual (no shorts/flip-flops)",
];

// Default booking features
export const defaultBookingFeatures: BookingFeatures = {
  urgency_enabled: true,
  urgency_text: "Only few spots left today!",
  availability_text: "Available daily",
  minimum_duration: "Minimum 2 Hours Required",
  hotel_pickup: true,
  hotel_pickup_text: "Hotel pickup included",
  cancellation_text: "Free cancellation (24h)",
  charter_features: ["Private experience", "Exclusive use"],
  cancellation_info: defaultCancellationInfo,
  what_to_bring: defaultWhatToBring,
  good_to_know: defaultGoodToKnow,
};

// Frontend Tour interface (matching TourCard expectations)
export interface Tour {
  id: string;
  slug: string;
  seoSlug: string | null;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice: number;
  duration: string;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: { time: string; activity: string }[];
  faqs: { question: string; answer: string }[];
  category: "dhow-cruise" | "yacht-shared" | "yacht-private" | "megayacht" | "water-activity" | "yacht-event";
  capacity?: string;
  featured: boolean;
  pricingType: "per_person" | "per_hour";
  fullYachtPrice: number | null;
  bookingFeatures: BookingFeatures;
}

type DbTour = Tables<"tours">;

// Map database tour to frontend Tour interface
export function mapDbTourToTour(dbTour: DbTour): Tour {
  // Parse booking features from database or use defaults
  const dbBookingFeatures = (dbTour as any).booking_features as BookingFeatures | null;
  const bookingFeatures: BookingFeatures = dbBookingFeatures
    ? { ...defaultBookingFeatures, ...dbBookingFeatures }
    : defaultBookingFeatures;

  return {
    id: dbTour.id,
    slug: dbTour.slug,
    seoSlug: (dbTour as any).seo_slug || null,
    title: dbTour.title,
    subtitle: dbTour.subtitle || "",
    description: dbTour.description || "",
    longDescription: dbTour.long_description || dbTour.description || "",
    price: Number(dbTour.price),
    originalPrice: Number(dbTour.original_price) || Number(dbTour.price),
    duration: dbTour.duration || "",
    rating: Number(dbTour.rating) || 4.5,
    reviewCount: dbTour.review_count || 0,
    image: normalizeImagePath(dbTour.image_url || dbTour.gallery?.[0] || null),
    gallery: (dbTour.gallery || []).map(normalizeImagePath),
    highlights: dbTour.highlights || [],
    included: dbTour.included || [],
    excluded: dbTour.excluded || [],
    itinerary: (dbTour.itinerary as { time: string; activity: string }[]) || [],
    faqs: (dbTour.faqs as { question: string; answer: string }[]) || [],
    category: dbTour.category as Tour["category"],
    capacity: dbTour.capacity || undefined,
    featured: dbTour.featured || false,
    pricingType: ((dbTour as any).pricing_type as Tour["pricingType"]) || "per_person",
    fullYachtPrice: (dbTour as any).full_yacht_price ? Number((dbTour as any).full_yacht_price) : null,
    bookingFeatures,
  };
}

// Helper to normalize image paths
// Ensure all tour images point to /assets/tours/ instead of just /tours/
function normalizeImagePath(path: string | null): string {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("/tours/")) {
    return "/assets" + path;
  }
  return path;
}

// Map array of database tours
export function mapDbToursToTours(dbTours: DbTour[]): Tour[] {
  return dbTours.map(mapDbTourToTour);
}
