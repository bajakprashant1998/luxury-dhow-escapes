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
  deckType: "lower" | "upper" | "private";
  featured: boolean;
}

export const tours: Tour[] = [
  {
    id: "1",
    slug: "dhow-cruise-marina",
    title: "Dhow Cruise Marina Experience",
    subtitle: "Lower Deck Dining",
    description: "Embark on a mesmerizing evening cruise through Dubai Marina aboard a traditional wooden dhow. Enjoy an international buffet dinner while taking in the stunning skyline views.",
    longDescription: "Discover the enchanting beauty of Dubai Marina from the water on this unforgettable dhow cruise experience. Step aboard a beautifully crafted traditional Arabian wooden vessel and set sail through the glittering waters of the marina. As the sun sets and the city lights come alive, you'll be treated to a sumptuous international buffet featuring a diverse selection of cuisines. The evening comes alive with captivating live entertainment, including the mesmerizing Tanura dance performance. This is the perfect way to experience Dubai's modern architectural marvels from a unique perspective while enjoying world-class hospitality.",
    price: 149,
    originalPrice: 199,
    duration: "2-3 Hours",
    rating: 4.8,
    reviewCount: 2847,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800",
      "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800",
      "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800",
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800",
    ],
    highlights: [
      "Scenic 2-3 hour cruise through Dubai Marina",
      "Lavish international buffet dinner",
      "Welcome drinks and refreshments",
      "Live Tanura dance performance",
      "Stunning views of Dubai Marina skyline",
      "Traditional Arabian dhow experience",
      "Photo opportunities with iconic landmarks",
      "Air-conditioned lower deck seating",
    ],
    included: [
      "2-3 hour dhow cruise experience",
      "Welcome drinks (soft drinks, water, tea, coffee)",
      "International buffet dinner",
      "Live entertainment (Tanura dance)",
      "Air-conditioned seating on lower deck",
      "Hotel pickup and drop-off (selected areas)",
      "All taxes and service charges",
    ],
    excluded: [
      "Alcoholic beverages",
      "Personal expenses and tips",
      "Anything not mentioned in inclusions",
      "Travel insurance",
    ],
    itinerary: [
      { time: "6:30 PM", activity: "Hotel pickup from designated meeting points" },
      { time: "7:30 PM", activity: "Arrive at Dubai Marina boarding point" },
      { time: "7:45 PM", activity: "Welcome aboard with refreshing drinks" },
      { time: "8:00 PM", activity: "Cruise departs, enjoy the stunning marina views" },
      { time: "8:30 PM", activity: "International buffet dinner is served" },
      { time: "9:00 PM", activity: "Live Tanura dance performance" },
      { time: "9:30 PM", activity: "Continue cruising with desserts and beverages" },
      { time: "10:00 PM", activity: "Return to boarding point" },
      { time: "10:30 PM", activity: "Drop-off at hotel" },
    ],
    faqs: [
      {
        question: "What should I wear for the cruise?",
        answer: "Smart casual attire is recommended. We suggest comfortable clothing suitable for an evening on the water. During cooler months, bring a light jacket as it can get breezy on the upper deck.",
      },
      {
        question: "Is the cruise suitable for children?",
        answer: "Yes! The cruise is family-friendly and suitable for all ages. Children under 4 years old join for free. Special children's menu options are available.",
      },
      {
        question: "What is the cancellation policy?",
        answer: "Free cancellation up to 24 hours before the experience. Cancellations made within 24 hours are non-refundable.",
      },
      {
        question: "Are vegetarian options available?",
        answer: "Absolutely! Our international buffet includes a variety of vegetarian dishes. Please inform us of any dietary requirements at the time of booking.",
      },
      {
        question: "What time should I arrive?",
        answer: "If you're using your own transport, please arrive at the boarding point 15-20 minutes before departure. For hotel pickups, we'll advise your collection time upon booking confirmation.",
      },
      {
        question: "Is there parking available?",
        answer: "Yes, paid parking is available near Dubai Marina Walk. We recommend arriving early to secure a spot, or opt for our hotel transfer service for convenience.",
      },
    ],
    deckType: "lower",
    featured: true,
  },
  {
    id: "2",
    slug: "dhow-cruise-upper-deck",
    title: "Premium Upper Deck Cruise",
    subtitle: "VIP Rooftop Experience",
    description: "Elevate your experience with premium upper deck seating offering panoramic 360° views of Dubai Marina's spectacular skyline.",
    longDescription: "Take your Dubai Marina cruise to new heights with our Premium Upper Deck Experience. Enjoy all the benefits of our classic dhow cruise with the added luxury of open-air rooftop seating. Feel the gentle breeze as you dine under the stars with unobstructed 360-degree views of the illuminated skyline. This premium experience includes priority seating, enhanced menu options, and a more intimate atmosphere perfect for special occasions.",
    price: 199,
    originalPrice: 249,
    duration: "2-3 Hours",
    rating: 4.9,
    reviewCount: 1523,
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
      "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800",
      "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800",
    ],
    highlights: [
      "Premium open-air upper deck seating",
      "360° panoramic views of Dubai Marina",
      "Enhanced international buffet menu",
      "Welcome drinks and premium beverages",
      "Live entertainment and Tanura show",
      "Priority boarding",
      "Perfect for special occasions",
      "Unforgettable photo opportunities",
    ],
    included: [
      "2-3 hour premium dhow cruise",
      "Priority upper deck seating",
      "Welcome drinks and premium soft beverages",
      "Enhanced international buffet dinner",
      "Live entertainment (Tanura dance)",
      "Hotel pickup and drop-off (selected areas)",
      "All taxes and service charges",
    ],
    excluded: [
      "Alcoholic beverages",
      "Personal expenses and tips",
      "Anything not mentioned in inclusions",
    ],
    itinerary: [
      { time: "6:30 PM", activity: "Hotel pickup from designated meeting points" },
      { time: "7:30 PM", activity: "Priority arrival at boarding point" },
      { time: "7:45 PM", activity: "Welcome aboard with premium refreshments" },
      { time: "8:00 PM", activity: "Cruise departs with upper deck seating" },
      { time: "8:30 PM", activity: "Premium buffet dinner service begins" },
      { time: "9:00 PM", activity: "Live entertainment program" },
      { time: "9:45 PM", activity: "Desserts and final views" },
      { time: "10:00 PM", activity: "Return to marina" },
    ],
    faqs: [
      {
        question: "What's the difference between upper and lower deck?",
        answer: "The upper deck offers open-air seating with 360° views under the stars, while the lower deck is air-conditioned and enclosed. Upper deck guests enjoy priority boarding and an enhanced menu.",
      },
      {
        question: "What if it rains?",
        answer: "In case of inclement weather, upper deck guests will be accommodated on the covered lower deck or offered rescheduling at no extra charge.",
      },
    ],
    deckType: "upper",
    featured: true,
  },
  {
    id: "3",
    slug: "private-charter",
    title: "Private Yacht Charter",
    subtitle: "Exclusive Experience",
    description: "Charter the entire dhow for your private event. Perfect for birthdays, corporate events, proposals, or intimate gatherings.",
    longDescription: "Create an unforgettable private experience with our exclusive yacht charter service. Have the entire traditional dhow to yourself and your guests for a truly personalized celebration. Whether it's a romantic proposal, milestone birthday, corporate team building, or intimate family gathering, our private charter offers complete flexibility to customize your cruise experience.",
    price: 2999,
    originalPrice: 3499,
    duration: "3-4 Hours",
    rating: 5.0,
    reviewCount: 342,
    image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800",
    ],
    highlights: [
      "Exclusive private charter for up to 50 guests",
      "Fully customizable menu and experience",
      "Personal event coordinator",
      "Custom decorations available",
      "Extended cruise duration",
      "Premium sound system",
      "Photography service available",
      "Flexible timing",
    ],
    included: [
      "3-4 hour private cruise",
      "Exclusive use of entire dhow",
      "Customizable buffet menu",
      "Welcome drinks and beverages",
      "Personal event coordinator",
      "Basic decorations",
      "Sound system access",
      "All taxes and service charges",
    ],
    excluded: [
      "Custom decorations (available at extra cost)",
      "Professional photography (available at extra cost)",
      "Special entertainment requests (available at extra cost)",
      "Alcoholic beverages (can be arranged)",
    ],
    itinerary: [
      { time: "Flexible", activity: "Fully customizable schedule based on your preferences" },
    ],
    faqs: [
      {
        question: "How many guests can the private charter accommodate?",
        answer: "Our dhow can comfortably accommodate up to 50 guests for a private charter event.",
      },
      {
        question: "Can we bring our own decorations?",
        answer: "Yes! You're welcome to bring decorations, or we can arrange custom decorations for an additional fee. Please discuss your requirements with our event coordinator.",
      },
      {
        question: "Can we arrange special entertainment?",
        answer: "Absolutely! We can arrange live bands, DJs, additional performers, or any special entertainment. Additional charges apply based on your requirements.",
      },
    ],
    deckType: "private",
    featured: false,
  },
];

export const getTourBySlug = (slug: string): Tour | undefined => {
  return tours.find((tour) => tour.slug === slug);
};

export const getFeaturedTours = (): Tour[] => {
  return tours.filter((tour) => tour.featured);
};
