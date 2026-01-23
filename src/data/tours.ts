// Tour Images
import dhowCruiseMarina from "@/assets/tours/dhow-cruise-marina.jpg";
import megayachtBurjKhalifa from "@/assets/tours/megayacht-burj-khalifa.jpg";
import catamaranBurjAlArab from "@/assets/tours/catamaran-burj-al-arab.jpg";
import yachtSunsetTour from "@/assets/tours/yacht-sunset-tour.jpg";
import yachtLunchDaytime from "@/assets/tours/yacht-lunch-daytime.jpg";
import yachtMoonlight from "@/assets/tours/yacht-moonlight.jpg";
import privateYacht33ft from "@/assets/tours/private-yacht-33ft.jpg";
import privateYacht55ft from "@/assets/tours/private-yacht-55ft.jpg";
import privateYacht80ft from "@/assets/tours/private-yacht-80ft.jpg";
import privateYacht100ft from "@/assets/tours/private-yacht-100ft.jpg";
import yachtBbqExperience from "@/assets/tours/yacht-bbq-experience.jpg";
import yachtSwimming from "@/assets/tours/yacht-swimming.jpg";
// Existing assets
import buffetDining from "@/assets/buffet-dining.jpg";
import tanuraEntertainment from "@/assets/tanura-entertainment.jpg";
import dubaiMarinaNight from "@/assets/dubai-marina-night.jpg";
import yachtInterior from "@/assets/yacht-interior.jpg";

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

export const tours: Tour[] = [
  // DHOW CRUISES
  {
    id: "1",
    slug: "dhow-cruise-marina",
    title: "Dhow Cruise Dubai Marina",
    subtitle: "Sharing Basis Cruise",
    description: "Experience the timeless charm of a traditional wooden dhow as you glide through the stunning Dubai Marina. Enjoy a delightful dinner cruise with breathtaking skyline views.",
    longDescription: "A dhow is a traditional wooden sailing vessel that has graced Arabian waters for centuries. Step aboard and journey through Dubai Marina's glittering waterways while enjoying an authentic cultural experience. Watch the magnificent skyline transform as day turns to night, savor a delicious international buffet dinner, and be entertained by captivating live performances including the mesmerizing Tanura dance. This sharing basis cruise offers an affordable yet unforgettable way to experience Dubai's modern marvels from the water.",
    price: 120,
    originalPrice: 180,
    duration: "2 Hours",
    rating: 4.9,
    reviewCount: 3245,
    image: dhowCruiseMarina,
    gallery: [
      dhowCruiseMarina,
      dubaiMarinaNight,
      buffetDining,
      tanuraEntertainment,
      yachtInterior,
    ],
    highlights: [
      "Traditional wooden dhow cruise experience",
      "2-hour scenic journey through Dubai Marina",
      "International buffet dinner included",
      "Live Tanura dance performance",
      "Welcome drinks and refreshments",
      "Stunning views of Marina skyline",
      "Air-conditioned lower deck seating",
      "Perfect for couples and families",
    ],
    included: [
      "2-hour dhow cruise in Dubai Marina",
      "Welcome drinks (soft drinks, water, tea, coffee)",
      "International buffet dinner",
      "Live entertainment and Tanura show",
      "Air-conditioned seating",
      "All taxes and service charges",
    ],
    excluded: [
      "Hotel transfers (available at extra cost)",
      "Alcoholic beverages",
      "Personal expenses and gratuities",
      "Travel insurance",
    ],
    itinerary: [
      { time: "7:00 PM", activity: "Arrive at Dubai Marina boarding point" },
      { time: "7:15 PM", activity: "Welcome aboard with refreshing drinks" },
      { time: "7:30 PM", activity: "Cruise departs through Dubai Marina" },
      { time: "8:00 PM", activity: "Buffet dinner service begins" },
      { time: "8:30 PM", activity: "Live Tanura dance performance" },
      { time: "9:00 PM", activity: "Enjoy desserts and scenic views" },
      { time: "9:30 PM", activity: "Return to boarding point" },
    ],
    faqs: [
      {
        question: "What is a dhow?",
        answer: "A dhow is a traditional wooden sailing vessel that has been used in the Arabian Gulf region for centuries. Modern dhows are motorized and equipped with modern amenities while maintaining their classic charm.",
      },
      {
        question: "Is the cruise suitable for children?",
        answer: "Yes! The cruise is family-friendly and suitable for all ages. Children under 4 years old are free of charge.",
      },
      {
        question: "What should I wear?",
        answer: "Smart casual attire is recommended. Comfortable shoes are advised as the deck can be slippery.",
      },
      {
        question: "What is the cancellation policy?",
        answer: "Free cancellation up to 24 hours before the cruise. Cancellations within 24 hours are non-refundable.",
      },
    ],
    category: "dhow-cruise",
    featured: true,
  },
  {
    id: "2",
    slug: "catamaran-dinner-cruise",
    title: "Catamaran Dinner Cruise Marina",
    subtitle: "With Hotel Transfers",
    description: "Enjoy a relaxing 2-hour cruise on a modern catamaran through Dubai Marina, complete with delicious dinner and stunning views of iconic landmarks.",
    longDescription: "Experience Dubai Marina like never before aboard our luxury catamaran. This 2-hour dinner cruise offers the perfect blend of comfort and elegance as you sail past Dubai's most iconic sights including the magnificent Marina towers and Palm Jumeirah views. Enjoy complimentary water and a delicious multi-course dinner while taking in the breathtaking scenery. The catamaran's spacious decks provide ample opportunity for stunning photographs and memorable moments.",
    price: 180,
    originalPrice: 220,
    duration: "2 Hours",
    rating: 4.8,
    reviewCount: 1823,
    image: catamaranBurjAlArab,
    gallery: [
      catamaranBurjAlArab,
      dubaiMarinaNight,
      buffetDining,
      yachtInterior,
    ],
    highlights: [
      "Modern luxury catamaran experience",
      "2-hour cruise through Dubai Marina",
      "Delicious dinner included",
      "Complimentary water and beverages",
      "Hotel pickup and drop-off included",
      "Views of iconic Dubai landmarks",
      "Spacious deck for photography",
      "Ideal for romantic evenings",
    ],
    included: [
      "2-hour catamaran cruise",
      "Multi-course dinner",
      "Complimentary water and soft drinks",
      "Hotel pickup and drop-off",
      "All taxes and service charges",
    ],
    excluded: [
      "Alcoholic beverages",
      "Personal expenses",
      "Gratuities",
    ],
    itinerary: [
      { time: "6:00 PM", activity: "Hotel pickup" },
      { time: "7:00 PM", activity: "Arrive at marina and board catamaran" },
      { time: "7:15 PM", activity: "Welcome drinks and cruise departure" },
      { time: "7:45 PM", activity: "Dinner service begins" },
      { time: "9:00 PM", activity: "Return to marina" },
      { time: "9:30 PM", activity: "Hotel drop-off" },
    ],
    faqs: [
      {
        question: "What's included in the dinner?",
        answer: "A multi-course dinner featuring international cuisine with vegetarian options available upon request.",
      },
      {
        question: "Are transfers included?",
        answer: "Yes, hotel pickup and drop-off is included in the package from selected areas in Dubai.",
      },
    ],
    category: "dhow-cruise",
    featured: true,
  },
  // MEGAYACHT
  {
    id: "3",
    slug: "lotus-megayacht-dinner",
    title: "Royal Lotus Megayacht Dinner",
    subtitle: "Sharing Basis Cruise",
    description: "Embark on a city sightseeing cruise aboard a magnificent megayacht and indulge in a variety of flavors with your buffet dinner while sailing past Dubai's most iconic sights.",
    longDescription: "Experience the pinnacle of luxury cruising aboard the Royal Lotus Megayacht. This stunning vessel offers an unparalleled dining experience as you sail through Dubai's waters. Explore multiple decks of this magnificent yacht while enjoying a lavish international buffet dinner. Watch the city's most iconic landmarks glide by, from the Burj Al Arab to the Palm Jumeirah, all while being pampered with world-class service. The megayacht features elegant interiors, open-air decks, and entertainment that creates an unforgettable evening.",
    price: 275,
    originalPrice: 299,
    duration: "3 Hours",
    rating: 4.9,
    reviewCount: 2156,
    image: megayachtBurjKhalifa,
    gallery: [
      megayachtBurjKhalifa,
      yachtInterior,
      buffetDining,
      dubaiMarinaNight,
    ],
    highlights: [
      "Luxury megayacht experience",
      "3-hour scenic cruise",
      "Lavish international buffet",
      "Multiple deck access",
      "Views of Burj Al Arab & Palm Jumeirah",
      "Live entertainment",
      "Premium service",
      "Photo opportunities galore",
    ],
    included: [
      "3-hour megayacht cruise",
      "International buffet dinner",
      "Welcome drinks",
      "Live entertainment",
      "Access to all decks",
      "All taxes and charges",
    ],
    excluded: [
      "Hotel transfers",
      "Alcoholic beverages",
      "Personal expenses",
    ],
    itinerary: [
      { time: "7:00 PM", activity: "Arrive at boarding point" },
      { time: "7:15 PM", activity: "Welcome aboard with drinks" },
      { time: "7:30 PM", activity: "Cruise departs" },
      { time: "8:00 PM", activity: "Buffet dinner opens" },
      { time: "9:00 PM", activity: "Live entertainment" },
      { time: "10:00 PM", activity: "Return to port" },
    ],
    faqs: [
      {
        question: "How big is the megayacht?",
        answer: "The Royal Lotus is a magnificent multi-deck yacht with capacity for hundreds of guests, featuring dining halls, lounges, and open-air viewing decks.",
      },
    ],
    category: "megayacht",
    featured: true,
  },
  // SHARED YACHT EXPERIENCES
  {
    id: "4",
    slug: "xclusive-yacht-lunch-bbq",
    title: "Xclusive Shared Yacht - Lunch Tour",
    subtitle: "Live BBQ Experience",
    description: "Embark on an amazing daytime adventure aboard a luxury shared yacht with live BBQ as you cruise along Dubai's famous shoreline.",
    longDescription: "The Xclusive Luxury Shared Yachts Lunch Tour in Dubai will take you on an amazing adventure. As you cruise along Dubai's famous shoreline, climb aboard our luxurious yacht and enjoy freshly prepared live BBQ while taking in spectacular views of the coastline, Burj Al Arab, and Atlantis The Palm. The open deck provides perfect sun-soaking opportunities while our crew ensures you're pampered throughout the journey. This is the ultimate daytime escape for those seeking luxury on the water.",
    price: 360,
    originalPrice: 395,
    duration: "2 Hours",
    rating: 4.8,
    reviewCount: 956,
    image: yachtLunchDaytime,
    gallery: [
      yachtLunchDaytime,
      yachtBbqExperience,
      yachtSwimming,
      catamaranBurjAlArab,
    ],
    highlights: [
      "Luxury shared yacht experience",
      "Live BBQ freshly prepared onboard",
      "Views of Burj Al Arab & Atlantis",
      "Sun deck access",
      "Professional crew service",
      "2-hour coastal cruise",
      "Refreshments included",
      "Swimming opportunity (weather permitting)",
    ],
    included: [
      "2-hour yacht cruise",
      "Live BBQ lunch",
      "Soft drinks and water",
      "Towels and basic amenities",
    ],
    excluded: [
      "Hotel transfers",
      "Alcoholic beverages",
      "Personal expenses",
    ],
    itinerary: [
      { time: "12:00 PM", activity: "Arrive at Dubai Marina" },
      { time: "12:15 PM", activity: "Board yacht and welcome drinks" },
      { time: "12:30 PM", activity: "Cruise departs" },
      { time: "1:00 PM", activity: "Live BBQ service" },
      { time: "2:00 PM", activity: "Return to marina" },
    ],
    faqs: [
      {
        question: "Can we swim during the cruise?",
        answer: "Yes, weather permitting, there may be a swimming stop where guests can take a dip in the Arabian Gulf.",
      },
      {
        question: "What can I expect on a yacht tour Dubai?",
        answer: "You can expect a scenic luxury cruise with live BBQ, highlighting Dubai's iconic coastline and landmarks including Burj Al Arab and Palm Jumeirah.",
      },
      {
        question: "Where does the yacht depart from?",
        answer: "We depart from Dubai Marina. The boarding point is at Xclusive Marina - Behind Al Majara Tower.",
      },
      {
        question: "What yacht will we cruise on?",
        answer: "Typically we cruise on a 65ft luxury catamaran or an 86ft yacht. However, based on our schedule, another yacht of similar size may be used.",
      },
      {
        question: "Is this a private yacht?",
        answer: "No, this is a shared yacht experience with other guests joining you on board.",
      },
      {
        question: "What time should we arrive?",
        answer: "Please arrive 20-30 minutes prior to your cruise and notify the operations team when you arrive.",
      },
      {
        question: "What is the child policy?",
        answer: "Children under 2 years go free. Ages 2-11 require a child ticket. Children below 12 must be accompanied by adults on board.",
      },
    ],
    category: "yacht-shared",
    featured: false,
  },
  {
    id: "5",
    slug: "xclusive-yacht-sunset-bbq",
    title: "Xclusive Shared Yacht - Sunset Tour",
    subtitle: "Live BBQ Experience",
    description: "Take a magical 2-hour sunset tour in Dubai aboard a luxury shared yacht. Watch the metropolitan skyline transform as the sun sets.",
    longDescription: "Take a magical 2-hour sunset tour in Dubai with our Xclusive Luxury Shared Yachts. Watch the metropolitan skyline change as the sun sets and cruise along on an opulent yacht. The golden hour provides spectacular photo opportunities as Dubai's landmarks are bathed in warm light. Enjoy freshly prepared live BBQ while the sky transforms into a canvas of oranges and purples. As darkness falls, witness the city lights come alive from the best seat in town - the water.",
    price: 280,
    originalPrice: 310,
    duration: "2 Hours",
    rating: 4.9,
    reviewCount: 1234,
    image: yachtSunsetTour,
    gallery: [
      yachtSunsetTour,
      yachtBbqExperience,
      dubaiMarinaNight,
      yachtSwimming,
    ],
    highlights: [
      "Magical sunset views",
      "Luxury shared yacht",
      "Live BBQ dinner",
      "Golden hour photography",
      "Dubai skyline at dusk",
      "2-hour cruise",
      "Romantic atmosphere",
      "City lights experience",
    ],
    included: [
      "2-hour sunset yacht cruise",
      "Live BBQ dinner",
      "Soft drinks and water",
      "Onboard amenities",
    ],
    excluded: [
      "Hotel transfers",
      "Alcoholic beverages",
    ],
    itinerary: [
      { time: "5:00 PM", activity: "Arrive at marina" },
      { time: "5:15 PM", activity: "Board yacht" },
      { time: "5:30 PM", activity: "Cruise departs for sunset" },
      { time: "6:00 PM", activity: "Sunset viewing and BBQ" },
      { time: "7:00 PM", activity: "Return as city lights up" },
    ],
    faqs: [
      {
        question: "What can I expect on a yacht tour Dubai?",
        answer: "You can expect a scenic luxury cruise with live BBQ, highlighting Dubai's iconic coastline and landmarks including Burj Al Arab and Palm Jumeirah.",
      },
      {
        question: "Where does the yacht depart from?",
        answer: "We depart from Dubai Marina. The boarding point is at Xclusive Marina - Behind Al Majara Tower.",
      },
      {
        question: "What yacht will we cruise on?",
        answer: "Typically we cruise on a 65ft luxury catamaran or an 86ft yacht. However, based on our schedule, another yacht of similar size may be used.",
      },
      {
        question: "Is this a private yacht?",
        answer: "No, this is a shared yacht experience with other guests joining you on board.",
      },
      {
        question: "What time should we arrive?",
        answer: "Please arrive 20-30 minutes prior to your cruise and notify the operations team when you arrive.",
      },
      {
        question: "What is the cancellation policy?",
        answer: "For a full refund, cancel at least 24 hours in advance. No-shows and late cancellations are non-refundable.",
      },
    ],
    category: "yacht-shared",
    featured: true,
  },
  {
    id: "6",
    slug: "xclusive-yacht-moonlight-bbq",
    title: "Xclusive Shared Yacht - Moonlight Tour",
    subtitle: "Live BBQ Experience",
    description: "Join us for an unforgettable evening on the sea with a 2-hour moonlight tour aboard our luxury shared yacht in Dubai.",
    longDescription: "Join us for an unforgettable evening on the sea when you embark on our 2-hour Moonlight Tour on our Xclusive Luxury Shared Yachts in Dubai. Navigate the glittering skyline of Dubai under the stars while enjoying live BBQ and excellent service. The illuminated towers, the reflection of city lights on the water, and the cool evening breeze create a magical atmosphere perfect for relaxation and celebration.",
    price: 180,
    originalPrice: 210,
    duration: "2 Hours",
    rating: 4.7,
    reviewCount: 876,
    image: yachtMoonlight,
    gallery: [
      yachtMoonlight,
      dubaiMarinaNight,
      yachtBbqExperience,
      yachtInterior,
    ],
    highlights: [
      "Nighttime yacht cruise",
      "Glittering Dubai skyline",
      "Live BBQ dinner",
      "Cool evening breeze",
      "City lights reflection",
      "Starlit atmosphere",
      "2-hour experience",
      "Perfect for groups",
    ],
    included: [
      "2-hour moonlight yacht cruise",
      "Live BBQ dinner",
      "Soft drinks and water",
    ],
    excluded: [
      "Hotel transfers",
      "Alcoholic beverages",
    ],
    itinerary: [
      { time: "8:00 PM", activity: "Arrive at marina" },
      { time: "8:15 PM", activity: "Board yacht" },
      { time: "8:30 PM", activity: "Cruise departs" },
      { time: "9:00 PM", activity: "BBQ dinner under the stars" },
      { time: "10:00 PM", activity: "Return to marina" },
    ],
    faqs: [
      {
        question: "What can I expect on a yacht tour Dubai?",
        answer: "You can expect a scenic luxury cruise with live BBQ, highlighting Dubai's iconic coastline and landmarks including Burj Al Arab and Palm Jumeirah.",
      },
      {
        question: "Where does the yacht depart from?",
        answer: "We depart from Dubai Marina. The boarding point is at Xclusive Marina - Behind Al Majara Tower.",
      },
      {
        question: "What yacht will we cruise on?",
        answer: "Typically we cruise on a 65ft luxury catamaran or an 86ft yacht. However, based on our schedule, another yacht of similar size may be used.",
      },
      {
        question: "Is this a private yacht?",
        answer: "No, this is a shared yacht experience with other guests joining you on board.",
      },
      {
        question: "What time should we arrive?",
        answer: "Please arrive 20-30 minutes prior to your cruise and notify the operations team when you arrive.",
      },
      {
        question: "What is the cancellation policy?",
        answer: "For a full refund, cancel at least 24 hours in advance. No-shows and late cancellations are non-refundable.",
      },
      {
        question: "What is the child policy?",
        answer: "Children under 2 years go free. Ages 2-11 require a child ticket. Children below 12 must be accompanied by adults on board.",
      },
    ],
    category: "yacht-shared",
    featured: false,
  },
  // PRIVATE YACHT CHARTERS
  {
    id: "7",
    slug: "33-ft-yacht-private",
    title: "33 Feet Yacht Private Charter",
    subtitle: "Intimate Private Experience",
    description: "Sail across the beautiful waters of Dubai on this cozy 33-foot yacht. Perfect for intimate gatherings and couples seeking privacy.",
    longDescription: "The 33 Ft Yacht Private Charter from BetterView Tourism is the perfect way to sail across the beautiful seas of Dubai. It's a great option for anyone who wants a private and economical yachting experience. This compact yet comfortable yacht is ideal for couples, small families, or close friends looking for an exclusive experience without the premium price tag.",
    price: 450,
    originalPrice: 550,
    duration: "2 Hours",
    rating: 4.8,
    reviewCount: 234,
    image: privateYacht33ft,
    gallery: [
      privateYacht33ft,
      yachtSwimming,
      dubaiMarinaNight,
    ],
    highlights: [
      "Private yacht charter",
      "Capacity: up to 8 guests",
      "Cozy and intimate setting",
      "Professional captain and crew",
      "Flexible route",
      "Swimming stop available",
      "Budget-friendly private option",
      "2-hour cruise",
    ],
    included: [
      "2-hour private yacht charter",
      "Professional captain and crew",
      "Soft drinks and water",
      "Fishing equipment (on request)",
      "Swimming gear",
    ],
    excluded: [
      "Food and catering",
      "Hotel transfers",
      "Alcoholic beverages",
    ],
    itinerary: [
      { time: "Flexible", activity: "Customizable based on your preference" },
    ],
    faqs: [
      {
        question: "How many guests can this yacht accommodate?",
        answer: "The 33-foot yacht can comfortably accommodate up to 8 guests.",
      },
    ],
    category: "yacht-private",
    capacity: "Up to 8 guests",
    featured: false,
  },
  {
    id: "8",
    slug: "36-ft-yacht-private",
    title: "36 Feet Yacht Private Charter",
    subtitle: "Economy Private Charter",
    description: "An excellent choice for those seeking a private yacht experience at an affordable price. Cruise Dubai's waters in style.",
    longDescription: "The 36 Ft Yacht Private Charter from BetterView Tourism offers an excellent balance of privacy and affordability. Enjoy your own private vessel as you cruise along Dubai's stunning coastline, with views of iconic landmarks and the beautiful Arabian Gulf. Perfect for small celebrations, family outings, or simply a day of relaxation on the water.",
    price: 450,
    originalPrice: 500,
    duration: "2 Hours",
    rating: 4.7,
    reviewCount: 312,
    image: privateYacht33ft,
    gallery: [
      privateYacht33ft,
      yachtSwimming,
      dubaiMarinaNight,
    ],
    highlights: [
      "Private charter experience",
      "Capacity: up to 10 guests",
      "Affordable luxury",
      "Experienced crew",
      "Flexible itinerary",
      "Swimming and fishing",
      "Coastal views",
      "Perfect for small groups",
    ],
    included: [
      "2-hour private yacht charter",
      "Captain and crew",
      "Soft drinks and water",
      "Basic amenities",
    ],
    excluded: [
      "Food (can be arranged)",
      "Hotel transfers",
    ],
    itinerary: [
      { time: "Flexible", activity: "Customizable schedule" },
    ],
    faqs: [],
    category: "yacht-private",
    capacity: "Up to 10 guests",
    featured: false,
  },
  {
    id: "9",
    slug: "42-ft-yacht-private",
    title: "42 Feet Yacht Private Charter",
    subtitle: "Balanced Elegance & Comfort",
    description: "The perfect balance of elegance and comfort for small parties, romantic getaways, or family trips.",
    longDescription: "BetterView Tourism's 42 Ft Yacht Private Charter offers the right balance of elegance and comfort. It's great for small parties, romantic getaways, or family trips. This sleek yacht features comfortable seating areas, a sundeck for relaxation, and modern amenities to ensure your cruise is nothing short of exceptional.",
    price: 550,
    originalPrice: 650,
    duration: "2 Hours",
    rating: 4.8,
    reviewCount: 445,
    image: privateYacht55ft,
    gallery: [
      privateYacht55ft,
      yachtSwimming,
      yachtInterior,
      dubaiMarinaNight,
    ],
    highlights: [
      "Elegant private yacht",
      "Capacity: up to 12 guests",
      "Sundeck for relaxation",
      "Modern amenities",
      "Professional service",
      "Romantic atmosphere",
      "Family-friendly",
      "Swimming stops",
    ],
    included: [
      "2-hour private charter",
      "Captain and crew",
      "Refreshments",
      "Towels and amenities",
    ],
    excluded: [
      "Catering services",
      "Hotel transfers",
    ],
    itinerary: [
      { time: "Flexible", activity: "Your choice of timing" },
    ],
    faqs: [],
    category: "yacht-private",
    capacity: "Up to 12 guests",
    featured: false,
  },
  {
    id: "10",
    slug: "44-ft-yacht-private",
    title: "44 Feet Yacht Private Charter",
    subtitle: "Spacious & Elegant",
    description: "A wonderful opportunity for a spacious and elegant cruising experience in Dubai aboard this mid-sized luxury yacht.",
    longDescription: "The 44-feet yacht private charter by BetterView Tourism offers you a wonderful opportunity for a spacious and elegant cruising experience in Dubai. This mid-sized luxury yacht provides ample space for movement, comfortable lounging areas, and stunning views from every angle. Whether you're celebrating a special occasion or simply treating yourself to a day of luxury, this yacht delivers an exceptional experience.",
    price: 600,
    originalPrice: 700,
    duration: "2 Hours",
    rating: 4.8,
    reviewCount: 389,
    image: privateYacht55ft,
    gallery: [
      privateYacht55ft,
      yachtInterior,
      yachtSwimming,
      dubaiMarinaNight,
    ],
    highlights: [
      "Spacious mid-sized yacht",
      "Capacity: up to 15 guests",
      "Elegant interior",
      "Multiple seating areas",
      "Professional crew",
      "Premium experience",
      "Perfect for celebrations",
      "Coastal scenic route",
    ],
    included: [
      "2-hour private yacht charter",
      "Experienced crew",
      "Soft drinks and water",
      "Onboard amenities",
    ],
    excluded: [
      "Food and catering",
      "Alcoholic beverages",
      "Hotel pickup",
    ],
    itinerary: [
      { time: "Flexible", activity: "Customizable to your preferences" },
    ],
    faqs: [],
    category: "yacht-private",
    capacity: "Up to 15 guests",
    featured: false,
  },
  {
    id: "11",
    slug: "55-ft-yacht-private",
    title: "55 Feet Yacht Private Charter",
    subtitle: "Mid-Size Luxury Vessel",
    description: "Discover elegant cruising aboard this mid-size luxury vessel, ideal for birthdays, anniversaries, private parties, and special celebrations.",
    longDescription: "Discover the world of elegant cruising with BetterView Tourism's 55-foot Yacht Private Charter, a mid-size luxury vessel ideal for birthdays, anniversaries, private parties, special occasions, and memorable moments. The yacht features luxurious interiors, comfortable outdoor spaces, and all the amenities needed for an unforgettable celebration on the water.",
    price: 650,
    originalPrice: 750,
    duration: "2 Hours",
    rating: 4.9,
    reviewCount: 523,
    image: privateYacht55ft,
    gallery: [
      privateYacht55ft,
      yachtInterior,
      yachtSwimming,
      dubaiMarinaNight,
    ],
    highlights: [
      "Mid-size luxury yacht",
      "Capacity: up to 18 guests",
      "Ideal for celebrations",
      "Luxurious interiors",
      "Outdoor deck space",
      "Full amenities",
      "Professional service",
      "Memorable experience",
    ],
    included: [
      "2-hour private yacht charter",
      "Captain and crew",
      "Refreshments",
      "Music system",
      "Swimming equipment",
    ],
    excluded: [
      "Catering",
      "Decorations",
      "Hotel transfers",
    ],
    itinerary: [
      { time: "Flexible", activity: "Tailored to your needs" },
    ],
    faqs: [],
    category: "yacht-private",
    capacity: "Up to 18 guests",
    featured: false,
  },
  {
    id: "12",
    slug: "60-ft-yacht-private",
    title: "60 Feet Yacht Private Charter",
    subtitle: "Family & Group Gatherings",
    description: "Enjoy a lovely cruise along Dubai's famous coastline on this spacious yacht, great for family get-togethers and group celebrations.",
    longDescription: "Get on board the 60 Ft Yacht Private Charter with BetterView Tourism and enjoy a lovely cruise along Dubai's famous coastline. This big yacht is great for family get-togethers, corporate events, or friend celebrations. With multiple decks, spacious lounging areas, and premium service, your group will enjoy every moment of this exclusive cruising experience.",
    price: 750,
    originalPrice: 850,
    duration: "2 Hours",
    rating: 4.8,
    reviewCount: 412,
    image: privateYacht80ft,
    gallery: [
      privateYacht80ft,
      yachtInterior,
      yachtSwimming,
      dubaiMarinaNight,
    ],
    highlights: [
      "Spacious 60-foot yacht",
      "Capacity: up to 22 guests",
      "Multiple decks",
      "Perfect for groups",
      "Corporate events",
      "Family celebrations",
      "Premium amenities",
      "Scenic coastal cruise",
    ],
    included: [
      "2-hour private charter",
      "Full crew service",
      "Refreshments",
      "All amenities",
    ],
    excluded: [
      "Catering packages",
      "Custom decorations",
      "Hotel transfers",
    ],
    itinerary: [
      { time: "Flexible", activity: "Your choice" },
    ],
    faqs: [],
    category: "yacht-private",
    capacity: "Up to 22 guests",
    featured: false,
  },
  {
    id: "13",
    slug: "64-ft-yacht-private",
    title: "64 Feet Yacht Private Charter",
    subtitle: "High-End Private Experience",
    description: "A great alternative for high-end private parties, family vacations, romantic cruises, or celebrations.",
    longDescription: "BetterView Tourism's 64 Ft Yacht Private Charter is a great alternative for high-end private parties, family vacations, romantic cruises, or celebrations. This yacht is perfectly sized to provide intimacy while offering generous space for your guests to move around, relax, and enjoy the stunning Dubai coastline.",
    price: 750,
    originalPrice: 800,
    duration: "2 Hours",
    rating: 4.9,
    reviewCount: 367,
    image: privateYacht80ft,
    gallery: [
      privateYacht80ft,
      yachtInterior,
      yachtSwimming,
      dubaiMarinaNight,
    ],
    highlights: [
      "64-foot luxury yacht",
      "Capacity: up to 25 guests",
      "High-end experience",
      "Intimate yet spacious",
      "Premium service",
      "Ideal for celebrations",
      "Modern amenities",
      "Dubai coastline views",
    ],
    included: [
      "2-hour private charter",
      "Professional crew",
      "Beverages",
      "Full amenities access",
    ],
    excluded: [
      "Food service",
      "Hotel pickup",
    ],
    itinerary: [
      { time: "Flexible", activity: "Customizable" },
    ],
    faqs: [],
    category: "yacht-private",
    capacity: "Up to 25 guests",
    featured: false,
  },
  {
    id: "14",
    slug: "70-ft-yacht-private",
    title: "70 Feet Yacht Private Charter",
    subtitle: "Style, Comfort & Space",
    description: "The perfect way to enjoy an amazing yachting experience combining style, comfort, and space for larger groups.",
    longDescription: "BetterView Tourism's 70 Ft Yacht Private Charter is the perfect way to enjoy an amazing yachting experience. It combines style, comfort, and space in a way that makes it the best choice for larger groups and special occasions. The generous deck space, elegant interiors, and professional service create memories that last a lifetime.",
    price: 850,
    originalPrice: 1000,
    duration: "2 Hours",
    rating: 4.9,
    reviewCount: 289,
    image: privateYacht80ft,
    gallery: [
      privateYacht80ft,
      yachtInterior,
      yachtSwimming,
      dubaiMarinaNight,
    ],
    highlights: [
      "70-foot premium yacht",
      "Capacity: up to 30 guests",
      "Generous deck space",
      "Elegant interiors",
      "Professional crew",
      "Perfect for large groups",
      "Special occasion ready",
      "Luxury amenities",
    ],
    included: [
      "2-hour private yacht charter",
      "Full crew",
      "Refreshments",
      "Premium amenities",
    ],
    excluded: [
      "Catering",
      "Decorations",
      "Transfers",
    ],
    itinerary: [
      { time: "Flexible", activity: "Your preference" },
    ],
    faqs: [],
    category: "yacht-private",
    capacity: "Up to 30 guests",
    featured: false,
  },
  {
    id: "15",
    slug: "88-ft-yacht-private",
    title: "88 Feet Yacht Private Charter",
    subtitle: "Elite Celebrations",
    description: "Embark on an extraordinary journey with this luxury experience designed for elite celebrations and high-end events.",
    longDescription: "Embark on an extraordinary journey with BetterView Tourism's 88 Ft Yacht Private Charter, a luxury experience designed for elite celebrations, high-end events, and unforgettable moments. This magnificent vessel offers multiple entertainment areas, luxurious accommodations, and the highest level of service for discerning guests.",
    price: 1350,
    originalPrice: 1500,
    duration: "2 Hours",
    rating: 5.0,
    reviewCount: 178,
    image: privateYacht100ft,
    gallery: [
      privateYacht100ft,
      yachtInterior,
      megayachtBurjKhalifa,
      dubaiMarinaNight,
    ],
    highlights: [
      "88-foot luxury yacht",
      "Capacity: up to 40 guests",
      "Multiple entertainment areas",
      "Elite-level service",
      "High-end celebrations",
      "Luxurious accommodations",
      "Premium sound system",
      "Unforgettable experience",
    ],
    included: [
      "2-hour private charter",
      "Elite crew service",
      "Premium refreshments",
      "All luxury amenities",
    ],
    excluded: [
      "Custom catering",
      "Event decorations",
      "Hotel transfers",
    ],
    itinerary: [
      { time: "Flexible", activity: "Fully customizable" },
    ],
    faqs: [],
    category: "yacht-private",
    capacity: "Up to 40 guests",
    featured: true,
  },
  {
    id: "16",
    slug: "100-ft-yacht-private",
    title: "100 Feet Yacht Private Charter",
    subtitle: "Ultimate Luxury Experience",
    description: "The most luxurious way to travel. An elite cruising experience for those who want nothing but the best.",
    longDescription: "BetterView Tourism's 100 Ft Yacht Private Charter is the most luxurious way to travel. It's an elite cruising experience for people who want nothing but the best. This beautiful mega-yacht features expansive decks, multiple lounges, state-of-the-art entertainment systems, and service that rivals the finest hotels. Perfect for lavish parties, corporate retreats, or milestone celebrations.",
    price: 1800,
    originalPrice: 2150,
    duration: "2 Hours",
    rating: 5.0,
    reviewCount: 134,
    image: privateYacht100ft,
    gallery: [
      privateYacht100ft,
      megayachtBurjKhalifa,
      yachtInterior,
      dubaiMarinaNight,
    ],
    highlights: [
      "100-foot mega yacht",
      "Capacity: up to 50 guests",
      "Ultimate luxury experience",
      "Expansive decks",
      "Multiple lounges",
      "State-of-the-art entertainment",
      "5-star service",
      "Lavish celebrations",
    ],
    included: [
      "2-hour private mega yacht charter",
      "Premium crew and service",
      "Luxury refreshments",
      "Full access to all amenities",
    ],
    excluded: [
      "Gourmet catering",
      "Custom event setup",
      "Hotel transfers",
    ],
    itinerary: [
      { time: "Flexible", activity: "Completely customizable" },
    ],
    faqs: [
      {
        question: "Can we extend the cruise duration?",
        answer: "Yes, additional hours can be booked at a premium rate. Contact us for pricing.",
      },
    ],
    category: "yacht-private",
    capacity: "Up to 50 guests",
    featured: true,
  },
];

export const getTourBySlug = (slug: string): Tour | undefined => {
  return tours.find((tour) => tour.slug === slug);
};

export const getFeaturedTours = (): Tour[] => {
  return tours.filter((tour) => tour.featured);
};

export const getToursByCategory = (category: Tour["category"]): Tour[] => {
  return tours.filter((tour) => tour.category === category);
};

export const categories = [
  { id: "all", label: "All Experiences" },
  { id: "dhow-cruise", label: "Dhow Cruises" },
  { id: "yacht-shared", label: "Shared Yacht Tours" },
  { id: "yacht-private", label: "Private Yacht Charters" },
  { id: "megayacht", label: "Megayacht Dining" },
];
