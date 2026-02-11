
# Activity-Specific Sections & Admin Fields

## Overview

Add conditional content sections to tour detail pages based on category type, and extend the admin form with matching editable fields. Also includes 3 new feature suggestions to implement alongside.

---

## Part 1: Extend BookingFeatures Interface

**File: `src/lib/tourMapper.ts`**

Add new optional fields to the `BookingFeatures` interface:

```
equipment_list: string[]       // Water activities: life jacket, helmet, wetsuit, etc.
safety_info: string[]          // Water activities: age limits, swimming requirements, medical disclaimers
decoration_options: string[]   // Events: balloon setup, flower arrangements, LED lighting, etc.
catering_options: string[]     // Events: BBQ buffet, fine dining, cocktail packages, etc.
customization_notes: string    // Events: free-text for special requests guidance
```

These are optional (defaulting to empty arrays) so existing tours are unaffected.

---

## Part 2: TourDetail Page -- Conditional Sections

**File: `src/pages/TourDetail.tsx`**

Insert two new conditional card sections between the "Highlights" and "Inclusions" sections:

### For Water Activities (`category === 'water-activity'`):

**Equipment & Gear Card**
- Icon: Shield/Wrench
- Renders `bookingFeatures.equipment_list` as a grid of items with checkmark icons
- Falls back to `included` items if equipment_list is empty (graceful degradation)

**Safety Information Card**
- Icon: AlertTriangle
- Renders `bookingFeatures.safety_info` as a list with warning-style styling
- Yellow/amber accent to draw attention
- Shows age requirements, swimming ability, medical conditions

### For Events (`category === 'yacht-event'`):

**Decoration & Setup Card**
- Icon: Sparkles/PartyPopper
- Renders `bookingFeatures.decoration_options` as selectable-looking pills/tags
- Shows available themes and setup options

**Catering & Dining Card**
- Icon: Utensils/ChefHat
- Renders `bookingFeatures.catering_options` as a styled list
- Shows available food and beverage packages

**Customization Note**
- If `bookingFeatures.customization_notes` exists, show a highlighted info box with guidance on how to customize the event

All sections use the same `motion.div` animation pattern, `bg-card rounded-xl p-6 shadow-md` styling, and `font-display text-2xl font-bold` headings to match existing sections perfectly.

---

## Part 3: Admin Form -- Category-Specific Fields

**File: `src/components/admin/TourForm.tsx`**

Add a new Card section that conditionally renders based on the selected category:

### When category is `water-activity`:
- **Equipment List** -- same add/remove list pattern as highlights (input + Plus button + pill tags)
- **Safety Information** -- same list editor pattern

### When category is `yacht-event`:
- **Decoration Options** -- list editor
- **Catering Options** -- list editor  
- **Customization Notes** -- single textarea field

This card appears between "Booking Sidebar Features" and "Important Information" sections, with a contextual title:
- "Water Activity Details" with Waves icon
- "Event & Experience Details" with PartyPopper icon

Form state initialization reads these new fields from `booking_features` JSONB (defaulting to empty arrays). On submit, they are saved back into the same JSONB column -- no database schema changes needed.

---

## Part 4: New Features (Bonus Implementations)

### Feature A: "Add to Yacht Booking" Cross-Sell CTA
**File: `src/pages/TourDetail.tsx`**

For water activities only, add a styled CTA card below the booking sidebar:
- "Combine with a Yacht Charter" heading
- Brief text: "Add this activity to any yacht booking for a complete Dubai experience"
- "Browse Yachts" button linking to `/tours` filtered by yacht categories
- Uses secondary color accent with a gradient background

### Feature B: Guest Capacity Visual Indicator
**File: `src/pages/TourDetail.tsx`**

For events, enhance the QuickInfoCards area with a visual capacity indicator:
- Show capacity as a prominent badge (e.g., "Up to 50 Guests")
- Add "Minimum X hours" from booking_features
- Use Users icon with event-appropriate styling

### Feature C: Category-Aware Related Tours Section
**File: `src/pages/TourDetail.tsx`**

Update the "You Might Also Like" section title based on category:
- Water activities: "More Water Adventures"
- Events: "More Celebration Packages"  
- Default: "You Might Also Like"

---

## Technical Details

### Files to Modify
- `src/lib/tourMapper.ts` -- Extend BookingFeatures interface with 5 new optional fields
- `src/pages/TourDetail.tsx` -- Add 2-3 conditional sections + cross-sell CTA + dynamic related title
- `src/components/admin/TourForm.tsx` -- Add conditional category-specific form card with list editors

### No Database Changes Required
All new fields are stored in the existing `booking_features` JSONB column. Optional fields default to empty arrays, so all existing tours continue to work without migration.

### Estimated Scope
- ~80 lines added to `tourMapper.ts`
- ~150 lines added to `TourDetail.tsx`
- ~120 lines added to `TourForm.tsx`
