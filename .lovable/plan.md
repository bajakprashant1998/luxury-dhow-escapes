

# Luxury Yacht Landing Page

## Overview
Create a standalone, high-converting landing page at `/entalyachtdubaipromotion-1` that is **not** added to the navigation menu. The page will use the existing brand colors (Deep Navy #1a2d4f + Gold #d4a853) enhanced with black and white for a premium feel, inspired by the reference image.

## What Will Be Built

### Page Structure (7 Sections)

1. **Hero Section** - Full-screen dark background with yacht imagery, bold headline "Experience Luxury Yacht Rental in Dubai", gold CTA button, and an inline mini booking form (name, phone, date, guests) visible above the fold.

2. **Trust + Social Proof** - Stats bar (1000+ guests, 5-star rating, years of experience) followed by 3 customer testimonials pulled from existing testimonial data, with star ratings.

3. **Yacht Experience Showcase** - Grid of premium yacht images (reusing existing assets like private-yacht-55ft, yacht-interior, dubai-marina-night) with short highlight text overlays.

4. **Packages Section** - 3 gold-bordered cards showing real packages from existing tour data (Dhow Cruise, Shared Yacht, Private Charter) with pricing, inclusions, and CTA buttons.

5. **Why Choose Us** - Icon-based grid: Safety Certified, Professional Crew, Instant Confirmation, Luxury Guarantee, Best Price, 24/7 Support.

6. **Urgency Section** - Dark section with "Limited Availability" messaging, scarcity text ("Only X spots left this week"), and a prominent "Reserve Today" CTA.

7. **Final Booking Form** - Full-width section with a larger booking form (name, email, phone, date, guests, message) and headline "Secure Your Luxury Yacht Experience". Form submissions will be saved to the existing `inquiries` table in the database.

### UX Features
- **Sticky CTA button** fixed at the bottom on mobile
- **Smooth scroll animations** using Framer Motion (fade-in on scroll)
- **Mobile-first responsive** design
- **No header/footer** from the main site layout (standalone page)
- WhatsApp link integrated for direct contact

## Technical Details

### Files to Create
- `src/pages/YachtPromoLanding.tsx` - The full landing page component (standalone, no Layout wrapper)

### Files to Modify
- `src/App.tsx` - Add lazy-loaded route for `/entalyachtdubaipromotion-1`

### Key Implementation Details
- Page will NOT use the shared `<Layout>` component (no header/footer/menu)
- Reuse existing image assets from `src/assets/` (yacht-interior, private-yacht-55ft, dubai-marina-night, etc.)
- Reuse existing testimonials from `src/data/testimonials.ts`
- Booking form submissions save to the `inquiries` table via Supabase
- Use `useContactConfig` for WhatsApp/phone links
- Framer Motion `whileInView` for scroll-triggered animations
- Gold accent color: `#d4a853` (existing secondary color)
- Dark background sections using `#0a0a0a` / `#111111`

