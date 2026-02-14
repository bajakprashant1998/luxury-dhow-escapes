

# Rename Booking Labels and Simplify Sidebar

## What Changes

### 1. Label Renames (across all files)

| Current Name | New Name |
|---|---|
| Self-Travel Discount (AED) | Direct To Boat |
| Shared Travelling | Shared Transfers |
| Self Travelling | Direct To Boat |
| Personal Travelling | Private Transfers |
| "Private transfer" (description under Personal Travelling) | Exclusive Vehicle |

### 2. Upper Deck Pricing: Per-Person Calculation

Currently the upper deck surcharge is a flat amount. It will be changed to multiply by the number of guests (adults + children).

- Sidebar: `deckSurcharge = upper_deck_surcharge * (adults + children)`
- Modal: Same calculation
- Display label will show e.g. "+AED 20/person"

### 3. Simplify the Right-Side Booking Sidebar

The sidebar (BookingSidebar.tsx) will be stripped down to show only basic info:
- Price display
- Date picker
- Guest counters (for per-person tours)
- Quick info (availability, duration, etc.)
- Reserve Now / WhatsApp / Phone buttons
- Trust badges and social proof

The following sections will be **removed from the sidebar** (they stay only in the popup modal):
- Travel Type selector (Shared/Direct To Boat/Private Transfers)
- Transfer Vehicle selector
- Deck Preference selector
- Itemized price breakdown (self-discount, transfer cost, deck surcharge lines)

The sidebar total will show only the base price calculation.

### 4. Files to Modify

| File | Changes |
|---|---|
| `src/components/admin/TourForm.tsx` | Rename "Self-Travel Discount (AED)" label to "Direct To Boat Discount (AED)" |
| `src/components/tour-detail/BookingSidebar.tsx` | Remove travel type, vehicle, deck sections and their price logic. Keep only basic booking info. |
| `src/components/tour-detail/BookingModal.tsx` | Rename labels: Shared Transfers, Direct To Boat, Private Transfers, Exclusive Vehicle. Update deck surcharge to per-person calculation. Update confirmation summary labels. |

