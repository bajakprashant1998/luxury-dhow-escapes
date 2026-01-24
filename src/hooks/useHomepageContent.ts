import { useSiteSetting } from "./useSiteSettings";

export interface HomepageStats {
  guests: string;
  guestsLabel: string;
  rating: string;
  ratingLabel: string;
  experience: string;
  experienceLabel: string;
  support: string;
  supportLabel: string;
}

export interface WhyChooseUsItem {
  icon: string;
  title: string;
  description: string;
}

export interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  stats: HomepageStats;
  whyChooseUs: WhyChooseUsItem[];
  trustIndicators: string[];
}

const DEFAULT_CONTENT: HomepageContent = {
  heroTitle: "Discover Dubai from the Water",
  heroSubtitle: "Premium Yacht & Dhow Cruise Experiences",
  stats: {
    guests: "2M+",
    guestsLabel: "Happy Guests",
    rating: "4.9",
    ratingLabel: "Average Rating",
    experience: "16+",
    experienceLabel: "Years Experience",
    support: "24/7",
    supportLabel: "Customer Support",
  },
  whyChooseUs: [
    { icon: "Shield", title: "Best Price Guarantee", description: "Find it cheaper? We'll match it!" },
    { icon: "Clock", title: "Instant Confirmation", description: "Book now, confirmation in seconds" },
    { icon: "Heart", title: "24/7 Support", description: "We're here whenever you need us" },
    { icon: "Users", title: "2M+ Happy Guests", description: "Join our growing family" },
  ],
  trustIndicators: ["Free Cancellation", "Secure Payment", "Verified Reviews", "Local Expertise"],
};

export function useHomepageContent(): HomepageContent & { isLoading: boolean } {
  const { data: homepageSettings, isLoading } = useSiteSetting("homepage");

  if (!homepageSettings || isLoading) {
    return { ...DEFAULT_CONTENT, isLoading };
  }

  const content: HomepageContent = {
    heroTitle: (homepageSettings.heroTitle as string) || DEFAULT_CONTENT.heroTitle,
    heroSubtitle: (homepageSettings.heroSubtitle as string) || DEFAULT_CONTENT.heroSubtitle,
    stats: {
      guests: (homepageSettings.stats as any)?.guests || DEFAULT_CONTENT.stats.guests,
      guestsLabel: (homepageSettings.stats as any)?.guestsLabel || DEFAULT_CONTENT.stats.guestsLabel,
      rating: (homepageSettings.stats as any)?.rating || DEFAULT_CONTENT.stats.rating,
      ratingLabel: (homepageSettings.stats as any)?.ratingLabel || DEFAULT_CONTENT.stats.ratingLabel,
      experience: (homepageSettings.stats as any)?.experience || DEFAULT_CONTENT.stats.experience,
      experienceLabel: (homepageSettings.stats as any)?.experienceLabel || DEFAULT_CONTENT.stats.experienceLabel,
      support: (homepageSettings.stats as any)?.support || DEFAULT_CONTENT.stats.support,
      supportLabel: (homepageSettings.stats as any)?.supportLabel || DEFAULT_CONTENT.stats.supportLabel,
    },
    whyChooseUs: Array.isArray(homepageSettings.whyChooseUs) 
      ? (homepageSettings.whyChooseUs as unknown as WhyChooseUsItem[]) 
      : DEFAULT_CONTENT.whyChooseUs,
    trustIndicators: Array.isArray(homepageSettings.trustIndicators) 
      ? (homepageSettings.trustIndicators as unknown as string[]) 
      : DEFAULT_CONTENT.trustIndicators,
  };

  return { ...content, isLoading };
}

// Helper to get just the stats
export function useHomepageStats(): HomepageStats & { isLoading: boolean } {
  const { stats, isLoading } = useHomepageContent();
  return { ...stats, isLoading };
}
