

# Website Audit: Pending Tasks, Current Status, and Feature Suggestions

## Current Website Overview

This is a luxury yacht rental and tour booking platform for Dubai (rentalyachtindubai.com) with a comprehensive admin panel. The site includes tour listings, booking system, live chat, galleries, reviews, and extensive admin management tools.

---

## PART 1: Pending Tasks (From Previous Conversations)

### Admin Panel Pending Tasks

| # | Task | Priority | Status |
|---|------|----------|--------|
| 1 | Add search/filter input to the linked tours checkbox list in admin (for when there are many tours) | Medium | Not started |
| 2 | Add AI-generated suggestions for the SEO slug field (same pattern as slug/subtitle) | Medium | Not started |
| 3 | Add AI-generated suggestions for highlights, included items, and FAQ entries in the tour form | Medium | Not started |
| 4 | Add a "Reset Filters" button on the admin tours page to clear all filters at once | Low | ✅ Done |
| 5 | Add an export to CSV button on the Contact Leads admin page | Medium | ✅ Done |
| 6 | Add email notification to admin when a new contact lead is submitted | High | Not started |
| 7 | Per-person pricing support for guest categories (each category overrides tour base price independently) | Medium | Not started |

### Frontend Pending Tasks

| # | Task | Priority | Status |
|---|------|----------|--------|
| 8 | When selecting a linked tour from booking dropdown, keep popup open and update form dynamically instead of navigating away | High | Not started |
| 9 | Add a quick-view modal on tour cards (tour overview + booking CTA without navigating away) | Medium | Not started |
| 10 | Enhance /tours listing page with hero banner, improved filter UI with category icons, and count badge | Medium | Not started |
| 11 | Add "Recently Viewed" tours section (last 4 tours from localStorage, shown on tour detail pages) | Low | ✅ Done |
| 12 | Floating comparison bar to compare up to 3 tours side-by-side (price, duration, rating, inclusions) | Low | Not started |
| 13 | Add a smooth-scroll "Back to Top" button (appears after scrolling 500px) | Low | ✅ Done |
| 14 | Improve WhatsApp integration with floating chat popup + pre-filled tour inquiry messages | Medium | Not started |
| 15 | Add a promo announcement bar at the top of the site for limited-time offers | Medium | Partially done (rotating promo messages exist in Header) |

---

## PART 2: Current Issues and Gaps

### A. Functional Gaps
- **No email notifications** for new bookings, inquiries, or contact leads to admin
- **No "Recently Viewed"** or browsing history for visitors — ✅ Done
- **No customer accounts** -- visitors can't view their booking history
- **Search functionality** in the header opens a dialog but may not have robust results page
- **Dashboard "Add Tour" quick action** links to `/admin/tours/new` but actual route is `/admin/tours/add` — ✅ Fixed

### B. UX/Performance Gaps
- Multiple Suspense boundaries on homepage could cause visual "popping" as sections load independently
- No skeleton loaders for tour cards in the /tours listing page during data fetch
- No empty state illustration for saved tours page when no tours are saved

---

## PART 3: New Feature Suggestions (Relevant to Yacht/Tour Business)

### High-Impact Features

1. **Availability Calendar per Tour**
   - Show a visual calendar on tour detail pages with available/unavailable dates
   - Admin can block dates, set capacity limits per day
   - Prevents double-bookings and improves user confidence
   - New database table: `tour_availability` (tour_id, date, slots_available, is_blocked)

2. **Automated Booking Confirmation Emails**
   - Send confirmation email to customer immediately after booking
   - Send notification email to admin for new bookings
   - Use the existing `send-booking-email` edge function (already exists but may not be triggered automatically)

3. **Customer Portal / My Bookings**
   - Let returning customers log in and view their booking history
   - Download booking receipts / vouchers as PDF
   - Leverages existing auth system and bookings table (already has `user_id` column)

4. **Multi-Currency Display**
   - Show prices in AED, USD, EUR, GBP based on visitor preference
   - Uses a simple exchange rate stored in `site_settings`
   - Important for international Dubai tourists

5. **Seasonal / Dynamic Pricing**
   - Admin sets price multipliers for peak seasons (Dec-Jan, summer holidays)
   - Automatic price adjustments based on booking date
   - New fields in `booking_features` JSONB: `seasonal_pricing: [{start, end, multiplier}]`

### Medium-Impact Features

6. **Photo Reviews from Customers**
   - Allow customers to upload photos with their reviews
   - Creates authentic social proof content
   - Admin moderation before publishing

7. **Group Booking / Corporate Inquiry Form**
   - Separate form for large groups (20+ people) or corporate events
   - Captures company name, event type, estimated headcount, budget range
   - Routes to admin as high-priority lead

8. **Referral / Loyalty Program**
   - Generate unique referral codes for past customers
   - Track referral bookings and award discount credits
   - New tables: `referral_codes`, `referral_bookings`

9. **Blog / Travel Guide Section**
   - SEO-rich content pages about Dubai marina, yacht etiquette, best routes
   - Admin WYSIWYG editor for creating/managing blog posts
   - Internal linking to relevant tours for conversion

10. **Multi-Language Support (Arabic, Russian, Chinese)**
    - Key target markets for Dubai tourism
    - At minimum: Arabic (local), Russian, and Chinese translations
    - Language switcher in header

### Quick Wins

11. **"Back to Top" floating button** -- ✅ Done
12. **Recently Viewed tours** -- ✅ Done
13. **Tour comparison tool** -- select up to 3 tours for side-by-side comparison
14. **Social sharing buttons** on tour detail pages (WhatsApp, Instagram, Facebook)
15. **Booking countdown timer** -- "X people viewing this tour right now" or "Only Y spots left today"

---

## Recommended Priority Order

If you want to work through these systematically, here is the suggested sequence:

1. ~~Fix the Dashboard quick action link (`/admin/tours/new` to `/admin/tours/add`)~~ ✅
2. Admin email notifications for new bookings and contact leads
3. ~~Contact Leads CSV export~~ ✅
4. ~~Reset Filters button on admin tours page~~ ✅
5. ~~Recently Viewed tours section~~ ✅
6. ~~Back to Top button~~ ✅
7. Availability calendar
8. Customer portal / My Bookings
9. AI suggestions for highlights and FAQs
10. Blog / Travel Guide section
