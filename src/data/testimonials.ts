export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  avatar?: string;
  tourName: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    location: "United Kingdom",
    rating: 5,
    date: "January 2024",
    title: "Magical evening on the water!",
    content: "This was the highlight of our Dubai trip! The sunset views of the marina were absolutely breathtaking, and the buffet had something for everyone. The Tanura dance was mesmerizing. Highly recommend the upper deck for the best experience!",
    tourName: "Premium Upper Deck Cruise",
  },
  {
    id: "2",
    name: "Ahmed Al-Rashid",
    location: "Saudi Arabia",
    rating: 5,
    date: "December 2023",
    title: "Perfect family experience",
    content: "Brought my whole family including grandparents and kids. Everyone had an amazing time. The staff was incredibly accommodating, and the food quality exceeded our expectations. Will definitely book again!",
    tourName: "Dhow Cruise Marina Experience",
  },
  {
    id: "3",
    name: "Michael Chen",
    location: "Australia",
    rating: 5,
    date: "January 2024",
    title: "Romantic anniversary dinner",
    content: "Celebrated our 10th anniversary on the cruise. The ambiance was perfect, the staff made us feel special, and the views were unforgettable. The hotel pickup service was punctual and professional.",
    tourName: "Premium Upper Deck Cruise",
  },
  {
    id: "4",
    name: "Emma Williams",
    location: "Canada",
    rating: 4,
    date: "November 2023",
    title: "Great value for money",
    content: "Excellent experience overall! The buffet variety was impressive, and the entertainment was top-notch. Only minor point was the cruise was quite popular so it felt a bit crowded. Book upper deck for more space!",
    tourName: "Dhow Cruise Marina Experience",
  },
  {
    id: "5",
    name: "Hans Mueller",
    location: "Germany",
    rating: 5,
    date: "December 2023",
    title: "Beyond expectations",
    content: "We chose BetterView Tourism based on reviews and they delivered! From the seamless booking process to the actual cruise experience, everything was first-class. The marina skyline at night is simply stunning.",
    tourName: "Dhow Cruise Marina Experience",
  },
  {
    id: "6",
    name: "Priya Sharma",
    location: "India",
    rating: 5,
    date: "January 2024",
    title: "Unforgettable corporate event",
    content: "Organized our company team dinner on the private charter. The event coordinator was exceptional, accommodating all our requests. Our team loved it, and many are still talking about the experience!",
    tourName: "Private Yacht Charter",
  },
];
