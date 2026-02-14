

# Dynamic Travel Options, Transfer Vehicles, and Deck Pricing

## Overview

This plan adds five interconnected features -- all fully controlled from the admin panel and reflected in the customer booking experience.

## 1. New Data Fields (in `booking_features` JSONB)

No database migration needed -- these are stored in the existing `booking_features` JSONB column on the `tours` table.

New fields to add to `BookingFeatures` interface in `src/lib/tourMapper.ts`:

```text
travel_options_enabled: boolean          -- Enable the 3 travel types
self_travel_discount: number             -- AED amount to deduct for self-travel
transfer_vehicles: [                     -- Array of vehicle options
  { name: "6-Seater", price: 150 },
  { name: "14-Seater", price: 250 },
  { name: "22-Seater", price: 400 }
]
upper_deck_surcharge: number             -- Extra AED for upper deck selection
```

## 2. Admin Panel -- Tour Form Updates

**File**: `src/components/admin/TourForm.tsx`

### Travel Options Section (new card or inside Booking Features card)
- Toggle: "Enable Travel Type Selection"
- Input: "Self-Travel Discount (AED)" -- the amount to deduct when customer picks Self Travelling

### Transfer Vehicle Management
- When "Transfer Service Available" is ON, show a repeatable vehicle list:
  - Each row: Vehicle Name (text input) + Price in AED (number input) + Remove button
  - "+ Add Vehicle" button to add more rows
- Replaces the current single `transfer_price` field with multi-vehicle pricing

### Upper Deck Pricing
- When "Has Upper Deck Option" is ON, show a new field:
  - "Upper Deck Surcharge (AED)" -- extra cost added when customer selects upper deck

## 3. Booking Sidebar Updates

**File**: `src/components/tour-detail/BookingSidebar.tsx`

### Travel Type Selector (new section, after date picker)
- Three radio cards: "Shared Travelling", "Self Travelling", "Personal Travelling"
- Default: Shared Travelling
- When "Self Travelling" is selected, the total price is reduced by the admin-set discount amount

### Transfer Vehicle Dropdown (replaces current static transfer info)
- When transfer is toggled ON by the customer, show a dropdown with the admin-configured vehicles
- Each option shows: vehicle name + price (e.g., "6-Seater -- AED 150")
- Selected vehicle price is added to the total

### Deck Pricing (update existing deck selector)
- The existing deck radio buttons remain
- When "Upper Deck" is selected, the surcharge is added to the total and shown as a line item
- Display the surcharge amount next to the Upper Deck option label

### Price Breakdown (update total section)
- Show itemized breakdown:
  - Base price (per person x guests, or per hour)
  - Self-travel discount (if selected, shown as negative)
  - Transfer vehicle (if selected, with vehicle name)
  - Upper deck surcharge (if selected)
  - Total

## 4. Booking Modal Updates

**File**: `src/components/tour-detail/BookingModal.tsx`

- Mirror the same travel type, transfer vehicle, and deck surcharge logic
- Pass selected options into the booking special_requests field for admin visibility
- Update total price calculation to include all add-ons/discounts

## 5. Price Calculation Logic

```text
basePrice = (per_person) ? price * adults + price * 0.7 * children
          : (full_yacht) ? fullYachtPrice

selfDiscount = (travelType === "self") ? -self_travel_discount : 0
transferCost = (transferSelected) ? selectedVehicle.price : 0
deckSurcharge = (selectedDeck === "Upper Deck") ? upper_deck_surcharge : 0

totalPrice = basePrice + selfDiscount + transferCost + deckSurcharge
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/lib/tourMapper.ts` | Add new fields to `BookingFeatures` interface and defaults |
| `src/components/admin/TourForm.tsx` | Add travel options toggle, self-travel discount input, vehicle list manager, upper deck surcharge input |
| `src/components/tour-detail/BookingSidebar.tsx` | Add travel type radio cards, transfer vehicle dropdown, deck surcharge display, itemized price breakdown |
| `src/components/tour-detail/BookingModal.tsx` | Add travel type selector, vehicle dropdown, deck surcharge, updated price calc, pass selections to booking data |

## No Database Changes Required

All new data lives inside the existing `booking_features` JSONB column, which already supports arbitrary keys.

