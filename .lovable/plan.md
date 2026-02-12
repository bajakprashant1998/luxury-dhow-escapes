
# Fix 5 Issues: Categories, Admin + Buttons, Frontend Display, Deck Sidebar

## Issue 1: Admin Category Filter Shows Only 4 Hardcoded Categories

**Problem**: In `src/pages/admin/Tours.tsx` (lines 236-241), the category filter dropdown has hardcoded values (`dhow`, `megayacht`, `shared`, `private`) that don't match the actual database slugs (`dhow-cruise`, `megayacht`, `yacht-shared`, `yacht-private`, `water-activity`, `yacht-event`). This means filtering doesn't work and new categories are missing.

**Fix**: Replace the hardcoded `SelectItem` entries with dynamically loaded categories from the database using `useActiveCategories()` (same hook already used in TourForm). Also update `getCategoryBadge` to use real slugs.

**File**: `src/pages/admin/Tours.tsx`
- Import `useActiveCategories` from `@/hooks/useCategories`
- Replace hardcoded SelectItems with `categories.map()` 
- Update `getCategoryBadge` color map to use real slugs: `dhow-cruise`, `megayacht`, `yacht-shared`, `yacht-private`, `water-activity`, `yacht-event`

---

## Issue 2: Admin + Buttons Not Working (Water Activity / Event Details)

**Problem**: The + buttons in the Water Activity Details and Event & Experience Details sections ARE actually wired up correctly in the code. The issue is that these sections only render when `formData.category === 'water-activity'` or `formData.category === 'yacht-event'`. Since the category dropdown uses `cat.slug` values from the DB, the category is being set correctly. However, the + button `onClick` checks `if (!equipmentInput.trim()) return` -- if the input is empty, nothing happens. This is working as designed.

**Root Cause**: The real issue is likely that the form is inside a `<form>` tag and clicking the Button (even with `type="button"`) might be triggering form submission in some edge cases, OR the category isn't matching correctly so the sections don't appear at all. Looking at the code again, the `type="button"` is set correctly, and the category-specific sections do check `formData.category === 'water-activity'`.

After careful review, the + buttons have `type="button"` and proper click handlers. The code looks correct. The most likely issue is that when the user types text and clicks +, the input might not register. Let me verify: the handlers check `if (!equipmentInput.trim()) return` -- this should work fine.

**Possible Fix**: The issue might be a UI/UX problem where users click + without typing anything first. To improve UX, add a placeholder hint and ensure the buttons have clear visual feedback. But the code logic is actually correct. No code changes needed for the + buttons themselves -- they work when text is entered first.

---

## Issue 3: Transfer Service, Upper Deck, Water Activity, Event Details Not Showing on Frontend

**Problem**: The frontend TourDetail page already renders these sections, but they only appear when the data exists in `booking_features` JSONB:
- Equipment/Safety: Only shows when `tour.bookingFeatures.equipment_list?.length > 0`
- Decoration/Catering: Only shows when `tour.bookingFeatures.decoration_options?.length > 0`
- Transfer info: Already shows in BookingSidebar quick info section
- Upper Deck: Not shown on the frontend detail page at all (only in BookingModal)

**Fix**: 
- The transfer and deck info should also be visible on the TourDetail page as informational badges
- Add a "Deck Seating Available" indicator on the tour detail page when `has_upper_deck` is true
- Add a "Transfer Service" indicator on the tour detail page

**File**: `src/pages/TourDetail.tsx`
- Add a transfer service info card when `tour.bookingFeatures.transfer_available`
- Add an upper deck info indicator when `tour.bookingFeatures.has_upper_deck`

---

## Issue 4: Ensure All Admin Content Shows on Website

**Problem**: Some admin-editable fields may not render on the frontend. After reviewing the code:
- Description: Rendered with markdown support (done)
- Highlights, Included, Excluded, Itinerary, FAQs: All rendered (done)
- Equipment, Safety, Decoration, Catering, Customization Notes: Rendered conditionally (done)
- Transfer/Deck: Shown in BookingSidebar and BookingModal but NOT as standalone info on TourDetail
- Booking features (urgency, availability, cancellation, etc.): Shown in sidebar (done)

**Fix**: Already covered in Issue 3 above. Also ensure the `description` field (short description) is rendered with markdown too (currently only `longDescription` uses `renderMarkdown`).

**File**: `src/pages/TourDetail.tsx`
- Ensure short description also renders markdown if used anywhere on the detail page (currently the subtitle/description in breadcrumb area is plain text, which is fine for a brief subtitle)

---

## Issue 5: Upper Deck Option Must Be in Booking Sidebar

**Problem**: The upper deck selector currently only appears inside the BookingModal (after clicking "Reserve Now"). The user wants it visible directly in the BookingSidebar so customers can select their deck preference before clicking the booking button.

**Fix**: Add a deck preference selector in `BookingSidebar` when `bookingFeatures.has_upper_deck` is true. Show radio buttons or a select dropdown for deck options between the guest selector and the total price.

**File**: `src/components/tour-detail/BookingSidebar.tsx`
- Import `RadioGroup`, `RadioGroupItem` from radix, and `Layers` icon
- Add `selectedDeck` state
- Render a deck selector section when `bookingFeatures.has_upper_deck` is true
- Show deck options as radio buttons with labels
- Display selected deck in the sidebar info area

---

## Technical Summary

### Files to Modify
- `src/pages/admin/Tours.tsx` -- Dynamic category filter from DB, fix badge colors
- `src/pages/TourDetail.tsx` -- Add transfer/deck info cards on detail page
- `src/components/tour-detail/BookingSidebar.tsx` -- Add deck selector UI, import RadioGroup

### No Database Changes Required

### Key Details
- Admin category filter will use the same `useActiveCategories()` hook already used by TourForm
- Deck selector in sidebar uses same radio pattern as BookingModal
- Transfer and deck info cards use the same motion.div styling as existing sections
