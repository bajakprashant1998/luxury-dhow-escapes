import { Tables } from "@/integrations/supabase/types";

// Frontend Tour interface (matching TourCard expectations)
export interface Tour {
  id: string;
  slug: string;
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
  category: "dhow-cruise" | "yacht-shared" | "yacht-private" | "megayacht";
  capacity?: string;
  featured: boolean;
}

type DbTour = Tables<"tours">;

// Map database tour to frontend Tour interface
export function mapDbTourToTour(dbTour: DbTour): Tour {
  return {
    id: dbTour.id,
    slug: dbTour.slug,
    title: dbTour.title,
    subtitle: dbTour.subtitle || "",
    description: dbTour.description || "",
    longDescription: dbTour.long_description || dbTour.description || "",
    price: Number(dbTour.price),
    originalPrice: Number(dbTour.original_price) || Number(dbTour.price),
    duration: dbTour.duration || "",
    rating: Number(dbTour.rating) || 4.5,
    reviewCount: dbTour.review_count || 0,
    image: dbTour.image_url || "/placeholder.svg",
    gallery: dbTour.gallery || [],
    highlights: dbTour.highlights || [],
    included: dbTour.included || [],
    excluded: dbTour.excluded || [],
    itinerary: (dbTour.itinerary as { time: string; activity: string }[]) || [],
    faqs: (dbTour.faqs as { question: string; answer: string }[]) || [],
    category: dbTour.category as Tour["category"],
    capacity: dbTour.capacity || undefined,
    featured: dbTour.featured || false,
  };
}

// Map array of database tours
export function mapDbToursToTours(dbTours: DbTour[]): Tour[] {
  return dbTours.map(mapDbTourToTour);
}
