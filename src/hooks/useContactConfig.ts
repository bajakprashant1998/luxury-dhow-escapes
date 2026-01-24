import { useSiteSetting } from "./useSiteSettings";

export interface ContactConfig {
  phone: string;
  phoneFormatted: string;
  email: string;
  whatsapp: string;
  whatsappLink: string;
  whatsappLinkWithGreeting: (greeting?: string) => string;
  address: string;
}

const DEFAULT_CONFIG: ContactConfig = {
  phone: "+971585725692",
  phoneFormatted: "+971 58 572 5692",
  email: "info@rentalyachtdubai.com",
  whatsapp: "+971585725692",
  whatsappLink: "https://wa.me/971585725692",
  whatsappLinkWithGreeting: (greeting = "Hi! I'm interested in your yacht and dhow cruise experiences. Can you help me with booking?") => 
    `https://wa.me/971585725692?text=${encodeURIComponent(greeting)}`,
  address: "Dubai Marina Walk, Dubai, United Arab Emirates",
};

export function useContactConfig(): ContactConfig & { isLoading: boolean } {
  const { data: siteSettings, isLoading } = useSiteSetting("site");

  if (!siteSettings || isLoading) {
    return { ...DEFAULT_CONFIG, isLoading };
  }

  const phone = (siteSettings.whatsappNumber as string) || DEFAULT_CONFIG.phone;
  const phoneClean = phone.replace(/\D/g, "");
  
  // Format phone for display (e.g., +971 58 572 5692)
  const formatPhone = (num: string): string => {
    const clean = num.replace(/\D/g, "");
    if (clean.startsWith("971") && clean.length === 12) {
      return `+${clean.slice(0, 3)} ${clean.slice(3, 5)} ${clean.slice(5, 8)} ${clean.slice(8)}`;
    }
    return num;
  };

  const config: ContactConfig = {
    phone: phone.startsWith("+") ? phone : `+${phone}`,
    phoneFormatted: formatPhone(phone),
    email: (siteSettings.contactEmail as string) || DEFAULT_CONFIG.email,
    whatsapp: phone,
    whatsappLink: `https://wa.me/${phoneClean}`,
    whatsappLinkWithGreeting: (greeting = "Hi! I'm interested in your yacht and dhow cruise experiences. Can you help me with booking?") => 
      `https://wa.me/${phoneClean}?text=${encodeURIComponent(greeting)}`,
    address: (siteSettings.address as string) || DEFAULT_CONFIG.address,
  };

  return { ...config, isLoading };
}

// Static helper for components that can't use hooks (e.g., metadata)
export const getDefaultContactConfig = (): ContactConfig => DEFAULT_CONFIG;
