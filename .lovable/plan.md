
# 5 Enhancements: Card Sizing, Transfer Option, Deck Seating, Bold Text Fix, Hero Cards

## 1. Fix Card Sizes in ActivitiesShowcase (Home Page)

**Problem**: The cards in the "Water Activities & Events" section on the homepage may have inconsistent heights because `TourCard` content varies.

**Fix**: In `src/components/home/ActivitiesShowcase.tsx`, ensure all cards in the grid have equal height by adding `h-full` constraints. The `TourCard` component already uses `h-full flex flex-col` internally, so we need to ensure the wrapping `div` elements enforce equal sizing. Add `min-h` or fixed aspect ratio constraints to the card wrapper to ensure visual consistency across all 4 cards.

**File**: `src/components/home/ActivitiesShowcase.tsx`
- Add `h-full` to the grid item wrappers on both mobile scroll and desktop grid
- Ensure the mobile scroll cards also have consistent widths

---

## 2. Transfer Service Option During Booking

**Problem**: Customers should be able to choose whether they want a transfer/pickup service when booking.

**Approach**: Add a `transfer_option` boolean field to `BookingFeatures` and a `transfer_selected` state in the booking flow.

### Changes:

**`src/lib/tourMapper.ts`**
- Add to `BookingFeatures` interface:
  - `transfer_available: boolean` (default: `true`)
  - `transfer_price: number` (default: `0` for free transfer)
  - `transfer_label: string` (default: `"Hotel/Residence Transfer"`)

**`src/components/tour-detail/BookingModal.tsx`**
- Add `transferSelected` state (boolean, default `false`)
- In Step 1, after guest counters: show a toggle/switch asking "Would you like transfer service?" with the label from `bookingFeatures`
- If transfer has a price, show it; if free, show "Complimentary"
- Include transfer selection in `special_requests` field when submitting
- Update price calculation to include transfer price if selected
- Pass `bookingFeatures` as a new prop to BookingModal

**`src/components/tour-detail/BookingSidebar.tsx`**
- Show transfer availability badge in the sidebar features list

**`src/components/admin/TourForm.tsx`**
- In the Booking Sidebar Features card, add:
  - Switch: "Transfer Service Available"
  - Input: "Transfer Price (AED)" (0 = complimentary)
  - Input: "Transfer Label"

---

## 3. Upper Deck / Lower Deck Seating Option

**Problem**: Some yachts have upper decks. Customers should choose their preferred seating during booking.

**Approach**: Add `has_upper_deck` boolean and `deck_options` to `BookingFeatures`.

### Changes:

**`src/lib/tourMapper.ts`**
- Add to `BookingFeatures` interface:
  - `has_upper_deck: boolean` (default: `false`)
  - `deck_options: string[]` (default: `["Lower Deck", "Upper Deck"]`)

**`src/components/tour-detail/BookingModal.tsx`**
- Add `selectedDeck` state (string)
- In Step 1, when `bookingFeatures.has_upper_deck` is true: show a radio group or select dropdown for deck preference
- Include selected deck in `special_requests` on submission
- Show deck selection in Step 3 confirmation summary

**`src/components/admin/TourForm.tsx`**
- In Booking Sidebar Features card, add:
  - Switch: "Has Upper Deck Option"
  - When enabled, show deck option list editor (same add/remove pattern as charter features)

---

## 4. Fix Bold/Markdown Formatting on Frontend

**Problem**: The admin RichTextEditor uses markdown syntax (e.g., `**bold**`, `*italic*`, `## headings`), but the TourDetail page renders `longDescription` as plain text inside a `<p>` tag, ignoring all formatting.

**Fix**: Create a simple markdown renderer that converts the stored markdown into HTML, then use `dangerouslySetInnerHTML` with proper sanitization.

### Changes:

**`src/lib/markdownRenderer.ts`** (new file)
- Export a `renderMarkdown(text: string): string` function
- Reuse the same regex logic from `RichTextEditor.tsx`'s `renderPreview` function (lines 248-286) since it already handles bold, italic, headings, lists, links, blockquotes, and horizontal rules
- This ensures what admin sees in preview matches what displays on the frontend

**`src/pages/TourDetail.tsx`**
- Import `renderMarkdown` from the new utility
- Replace the Overview section's plain text `<p>{tour.longDescription}</p>` with:
  ```
  <div className="prose text-muted-foreground leading-relaxed"
       dangerouslySetInnerHTML={{ __html: renderMarkdown(tour.longDescription) }} />
  ```
- This renders bold, italic, headings, lists, links exactly as formatted in the admin editor

---

## 5. Replace Megayacht Hero Card with Water Sports & Events Cards

**Problem**: The ExperienceCategories section on the homepage shows 4 cards: Dhow Cruises, Shared Yacht, Private Charter, and Megayacht. Replace Megayacht with two new cards: "Water Sports Activities" and "Private/Corporate Event".

**Fix**: Update `src/components/home/ExperienceCategories.tsx`:
- Remove the Megayacht entry from the `experienceCategories` array
- Add two new entries:
  - **Water Sports Activities**: icon `Waves`, link `/activities`, gradient blue-cyan, description "Jet ski, parasailing & more"
  - **Private/Corporate Event**: icon `PartyPopper`, link `/activities?tab=events`, gradient purple-pink, description "Celebrations on the water"
- Update the grid from `grid-cols-2 lg:grid-cols-4` to `grid-cols-2 lg:grid-cols-5` to accommodate 5 cards (or keep 4 by removing Megayacht and adding 2, making it 5 total)
- Import `Waves` and `PartyPopper` icons (already imported as `Crown` can be replaced)

---

## Technical Summary

### New Files
- `src/lib/markdownRenderer.ts` -- Markdown-to-HTML converter

### Files to Modify
- `src/lib/tourMapper.ts` -- Add transfer and deck fields to BookingFeatures interface
- `src/components/home/ActivitiesShowcase.tsx` -- Fix card height consistency
- `src/components/home/ExperienceCategories.tsx` -- Replace Megayacht with 2 new cards
- `src/components/tour-detail/BookingModal.tsx` -- Add transfer toggle and deck selector
- `src/components/tour-detail/BookingSidebar.tsx` -- Show transfer/deck info
- `src/components/admin/TourForm.tsx` -- Add transfer and deck admin fields
- `src/pages/TourDetail.tsx` -- Render markdown in overview section

### No Database Changes Required
All new fields use the existing `booking_features` JSONB column with optional defaults.
