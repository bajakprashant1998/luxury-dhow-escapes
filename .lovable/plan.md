
# Water Activities & Events Booking Section

## Overview

Add two new sections -- "Water Activities" and "Events & Experiences" -- as a seamless extension of your existing yacht rental website. Since you chose to use the same `tours` table, all existing infrastructure (booking modal, admin tour form, reviews, discounts, gallery) will work automatically with the new listings.

## Strategy: Leverage Existing Architecture

Instead of building parallel systems, we add two new categories to the existing `categories` table and create new listings as rows in the `tours` table. This gives us:
- Existing booking modal and flow (date picker, guest counter, discount codes, email notifications)
- Existing admin panel (add/edit/delete tours, upload images, manage pricing, toggle featured)
- Existing reviews, gallery, and SEO infrastructure
- Zero new RLS policies needed

---

## Step 1: Database -- Add New Categories

Insert two new category rows into the `categories` table:

| Name | Slug | Icon | Description |
|------|------|------|-------------|
| Water Activities | water-activity | waves | Jet ski, flyboarding, parasailing and more thrilling water sports in Dubai |
| Events & Experiences | yacht-event | party-popper | Birthday parties, corporate events, romantic cruises and celebration packages |

## Step 2: SEO URL Routing

Update `src/lib/seoUtils.ts` to add mappings for the new categories:

- `water-activity` maps to path `water-activities` (URL: `/dubai/water-activities`)
- `yacht-event` maps to path `yacht-events` (URL: `/dubai/yacht-events`)

Update `src/lib/tourMapper.ts` to add the new category types to the Tour interface union type.

## Step 3: Navigation -- Add Header Links

Update `src/components/layout/Header.tsx` to add "Water Activities" and "Events" to the Tours dropdown menu, with appropriate icons (Waves, PartyPopper).

## Step 4: New Landing Page -- `/activities`

Create `src/pages/Activities.tsx` -- a dedicated landing page with:

- Hero section with water sports imagery
- Two-tab layout: "Water Activities" and "Events & Experiences"
- Each tab shows a filtered card grid from the `tours` table
- Cards reuse the existing `TourCard` component
- Category filter pills within each tab for sub-filtering
- Smooth Framer Motion animations matching the existing Tours page style
- Mobile-first responsive design with horizontal scroll filters

## Step 5: Add Route to App.tsx

Add `/activities` route to the router alongside the existing routes.

## Step 6: Seed Data -- Insert 24 Listings

Insert all listings into the `tours` table via database insert operations. Each listing gets:

**13 Water Activities:**
Jet Ski Ride, Flyboarding Experience, Parasailing Adventure, Banana Boat Ride, Wakeboarding, Donut Ride, Snorkeling Tour, Deep Sea Fishing, Seabob Ride, Paddle Boarding, Kayaking, Scuba Diving Experience, Luxury Speed Boat Tour

**11 Events & Experiences:**
Birthday Party Yacht Event, Anniversary Celebration Cruise, Corporate Yacht Event, Sunset Romantic Cruise, Bachelor/Bachelorette Party, Wedding Yacht Experience, Proposal Setup Cruise, Family Celebration Cruise, DJ Party Yacht Experience, Luxury Dinner Cruise, New Year/Festival Yacht Party

Each listing includes: title, slug, description, long_description, price, duration, capacity, highlights, included items, excluded items, gallery placeholders, and booking_features JSONB with activity-specific data (equipment info, safety requirements, decoration options, catering add-ons, etc.).

## Step 7: TourCard Visual Enhancements

Update `src/components/TourCard.tsx` to:
- Add category labels for `water-activity` ("Water Activity") and `yacht-event` ("Yacht Event")
- Add appropriate icons (Waves for activities, PartyPopper for events)
- Show "Available" availability badge using the existing badge slot

## Step 8: TourDetail Page -- Activity/Event-Specific Sections

Update `src/pages/TourDetail.tsx` to conditionally render:
- **For Water Activities**: Equipment included section, safety info card, "Add to Yacht Booking" CTA
- **For Events**: Package details, guest capacity card, decoration/catering options from `booking_features` JSONB
- These render from existing data fields -- no schema changes needed

## Step 9: Home Page -- Add Activities Section

Add a new section to `src/pages/Home.tsx` between the existing sections:
- "Water Activities & Events" showcase with 4-6 featured cards
- "View All Activities" CTA button linking to `/activities`
- Uses `useTours()` filtered by the new category slugs

## Step 10: Admin Panel Updates

The admin already supports full CRUD on tours. Updates needed:

- `src/components/admin/TourForm.tsx`: The category dropdown already loads from the database dynamically, so new categories appear automatically. Add conditional fields in the form for activity-specific booking_features (equipment list, safety info, decoration options, catering add-ons).
- `src/pages/admin/Tours.tsx`: Add category filter tabs/pills for quick filtering by Water Activities and Events alongside existing categories.

## Step 11: OG Meta Tags

Update `supabase/functions/render-og/index.ts` to handle the `/activities` page with appropriate meta tags. Tour detail pages already work dynamically.

---

## Technical Details

### Files to Create
- `src/pages/Activities.tsx` -- Main landing page with dual-tab layout

### Files to Modify
- `src/lib/seoUtils.ts` -- Add category path mappings
- `src/lib/tourMapper.ts` -- Extend Tour category type union
- `src/components/layout/Header.tsx` -- Add nav links
- `src/components/TourCard.tsx` -- Add category labels/icons
- `src/pages/TourDetail.tsx` -- Conditional activity/event sections
- `src/pages/Home.tsx` -- Add activities showcase section
- `src/components/admin/TourForm.tsx` -- Activity/event-specific form fields
- `src/App.tsx` -- Add `/activities` route
- `supabase/functions/render-og/index.ts` -- Add activities page meta

### Database Changes
- INSERT 2 rows into `categories` table
- INSERT 24 rows into `tours` table (13 water activities + 11 events)

### No Schema Changes Required
The existing `tours` table schema already supports everything needed:
- `booking_features` JSONB column stores equipment, safety info, decoration options, catering add-ons
- `highlights`, `included`, `excluded` arrays cover activity-specific details
- `capacity`, `duration`, `price`, `full_yacht_price` handle all pricing models
- Existing `categories` + `tours` foreign key relationship works as-is

### Booking System
No changes needed -- the existing `BookingModal` component handles:
- Date & time picker
- Guest count selector
- Discount code input
- Price calculation (per person and full yacht/charter pricing)
- Email confirmation via `send-booking-email` edge function

### What Already Works Without Changes
- Admin add/edit/delete (TourForm loads categories dynamically)
- Image upload (uses existing `tour-images` storage bucket)
- Reviews system
- Discount codes
- Booking management dashboard
- Activity logging
- SEO meta tags for detail pages
- Gallery management
