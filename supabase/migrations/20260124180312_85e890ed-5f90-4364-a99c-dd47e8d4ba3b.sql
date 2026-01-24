-- Seed initial site settings
INSERT INTO site_settings (key, value) VALUES
('site', '{
  "siteName": "Rental Yacht Dubai",
  "siteDescription": "Premium yacht and dhow cruise experiences in Dubai Marina",
  "contactEmail": "info@rentalyachtdubai.com",
  "whatsappNumber": "+971585725692",
  "address": "Dubai Marina Walk, Dubai, United Arab Emirates"
}'::jsonb),
('homepage', '{
  "heroTitle": "Discover Dubai from the Water",
  "heroSubtitle": "Premium Yacht & Dhow Cruise Experiences",
  "stats": {
    "guests": "2M+",
    "guestsLabel": "Happy Guests",
    "rating": "4.9",
    "ratingLabel": "Average Rating",
    "experience": "16+",
    "experienceLabel": "Years Experience",
    "support": "24/7",
    "supportLabel": "Customer Support"
  },
  "whyChooseUs": [
    {"icon": "Shield", "title": "Best Price Guarantee", "description": "Find it cheaper? We will match it!"},
    {"icon": "Clock", "title": "Instant Confirmation", "description": "Book now, confirmation in seconds"},
    {"icon": "Heart", "title": "24/7 Support", "description": "We are here whenever you need us"},
    {"icon": "Users", "title": "2M+ Happy Guests", "description": "Join our growing family"}
  ],
  "trustIndicators": ["Free Cancellation", "Secure Payment", "Verified Reviews", "Local Expertise"]
}'::jsonb),
('footer', '{
  "copyrightText": "All rights reserved",
  "socialLinks": {
    "facebook": "",
    "instagram": "",
    "twitter": "",
    "tiktok": ""
  }
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- Seed initial reviews from testimonials data
INSERT INTO reviews (customer_name, customer_email, rating, review_text, status, tour_id)
VALUES 
('Sarah Johnson', 'sarah.johnson@example.com', 5, 'This was the highlight of our Dubai trip! The sunset views of the marina were absolutely breathtaking, and the buffet had something for everyone. The Tanura dance was mesmerizing. Highly recommend the upper deck for the best experience!', 'approved', NULL),
('Ahmed Al-Rashid', 'ahmed.alrashid@example.com', 5, 'Brought my whole family including grandparents and kids. Everyone had an amazing time. The staff was incredibly accommodating, and the food quality exceeded our expectations. Will definitely book again!', 'approved', NULL),
('Michael Chen', 'michael.chen@example.com', 5, 'Celebrated our 10th anniversary on the cruise. The ambiance was perfect, the staff made us feel special, and the views were unforgettable. The hotel pickup service was punctual and professional.', 'approved', NULL),
('Emma Williams', 'emma.williams@example.com', 4, 'Excellent experience overall! The buffet variety was impressive, and the entertainment was top-notch. Only minor point was the cruise was quite popular so it felt a bit crowded. Book upper deck for more space!', 'approved', NULL),
('Hans Mueller', 'hans.mueller@example.com', 5, 'We chose BetterView Tourism based on reviews and they delivered! From the seamless booking process to the actual cruise experience, everything was first-class. The marina skyline at night is simply stunning.', 'approved', NULL),
('Priya Sharma', 'priya.sharma@example.com', 5, 'Organized our company team dinner on the private charter. The event coordinator was exceptional, accommodating all our requests. Our team loved it, and many are still talking about the experience!', 'approved', NULL);