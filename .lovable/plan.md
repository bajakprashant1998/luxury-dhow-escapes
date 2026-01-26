
## Full Yacht Booking Feature Implementation

This plan adds a "Full Yacht Booking (Private Charter)" option alongside the existing "Single Person Ticket" booking, allowing users to rent the entire yacht at a fixed price.

---

### Database Changes

**1. Add `full_yacht_price` column to `tours` table:**
```sql
ALTER TABLE tours ADD COLUMN full_yacht_price numeric DEFAULT NULL;
```
- Stores the fixed price for chartering the entire yacht
- NULL means full yacht booking is not available for this tour

**2. Add `booking_type` column to `bookings` table:**
```sql
ALTER TABLE bookings ADD COLUMN booking_type text DEFAULT 'per_person';
```
- Values: `per_person` or `full_yacht`
- Tracks whether the booking is individual tickets or private charter

---

### Admin Panel Changes

**File: `src/components/admin/TourForm.tsx`**

Add a new input field in the "Pricing & Details" section:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  Pricing & Details                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Price (AED)*  │  Original Price  │  Pricing Type  │  Full Yacht Price      │
│  [  150     ]  │  [   200       ] │  [Per Person▼] │  [   2500           ]  │
│                                                                             │
│  Duration      │  Capacity                                                  │
│  [ 2 hours  ]  │  [ Up to 25   ]                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

Changes:
- Add `fullYachtPrice` state field (optional number)
- Add input with label "Full Yacht Price (AED)" with helper text "Leave empty if not available"
- Include in `tourData` submission object

---

### Type & Mapper Updates

**File: `src/lib/tourMapper.ts`**

Update Tour interface:
```typescript
export interface Tour {
  // ... existing fields
  fullYachtPrice: number | null;  // NEW
}
```

Update mapper function:
```typescript
fullYachtPrice: dbTour.full_yacht_price ? Number(dbTour.full_yacht_price) : null,
```

---

### BookingSidebar Changes

**File: `src/components/tour-detail/BookingSidebar.tsx`**

Add booking type selector UI at the top of the booking form:

```text
┌─────────────────────────────────────────────────┐
│  🔥 Only few spots left today!                  │
├─────────────────────────────────────────────────┤
│  Select Booking Type                            │
│  ┌──────────────────┬──────────────────┐       │
│  │  🎫 Per Person   │  🛥️ Full Yacht  │       │
│  │  ✓ Selected      │                  │       │
│  └──────────────────┴──────────────────┘       │
├─────────────────────────────────────────────────┤
│  💰 PRICE DISPLAY                              │
│  (Changes based on selection)                   │
│                                                 │
│  Per Person: "AED 150 per person"              │
│  Full Yacht: "AED 2,500 per yacht"             │
│              "Capacity: 25 persons"             │
└─────────────────────────────────────────────────┘
```

Implementation details:
- Add `fullYachtPrice` and `capacity` props to interface
- Add `bookingType` state: `'per_person' | 'full_yacht'`
- Only show toggle if `fullYachtPrice` is set
- Guest counters hidden when "Full Yacht" selected
- Total price calculation changes based on booking type
- Pass `bookingType` to BookingModal

---

### BookingModal Changes

**File: `src/components/tour-detail/BookingModal.tsx`**

Update props interface:
```typescript
interface BookingModalProps {
  // ... existing
  bookingType?: 'per_person' | 'full_yacht';
  fullYachtPrice?: number | null;
  capacity?: string;
}
```

**Step 1 Changes (Select Tour):**
- When `bookingType === 'full_yacht'`:
  - Hide guest counter section
  - Show "Full Yacht Booking" badge with capacity info
  - Price preview shows fixed full yacht price

**Step 3 Changes (Confirm):**
- Display booking type in summary
- Price breakdown shows either:
  - Per person calculation (adults × price + children × 50%)
  - OR fixed "Full Yacht Charter: AED X"

**Database submission:**
```typescript
await supabase.from("bookings").insert({
  // ... existing fields
  booking_type: bookingType,  // NEW
  adults: bookingType === 'full_yacht' ? 0 : adults,
  children: bookingType === 'full_yacht' ? 0 : children,
  total_price: bookingType === 'full_yacht' ? fullYachtPrice : totalPrice,
});
```

---

### MobileBookingBar Changes

**File: `src/components/tour-detail/MobileBookingBar.tsx`**

Add props:
```typescript
interface MobileBookingBarProps {
  // ... existing
  fullYachtPrice?: number | null;
  capacity?: string;
}
```

Changes:
- Add small toggle pills for booking type selection
- Price display updates based on selected type
- Pass booking type to BookingModal

---

### TourDetail Page Updates

**File: `src/pages/TourDetail.tsx`**

Pass new props to child components:
```typescript
<BookingSidebar
  // ... existing
  fullYachtPrice={tour.fullYachtPrice}
  capacity={tour.capacity}
/>

<MobileBookingBar
  // ... existing
  fullYachtPrice={tour.fullYachtPrice}
  capacity={tour.capacity}
/>
```

---

### UI/UX Design Details

**Booking Type Toggle Design:**
- Use `ToggleGroup` component with two options
- Visual distinction with icons:
  - 🎫 Ticket icon for "Per Person"
  - 🛥️ Ship icon for "Full Yacht"
- Selected state has secondary color background
- Animation on selection change

**Price Display for Full Yacht:**
```text
┌─────────────────────────────────┐
│  AED 2,500                      │
│  ───────────                    │
│  per yacht (entire charter)     │
│                                 │
│  👥 Yacht Capacity: 25 Persons  │
│  ✓ Private experience           │
│  ✓ Exclusive use                │
└─────────────────────────────────┘
```

**Confirmation Summary for Full Yacht:**
```text
┌─────────────────────────────────┐
│  🛥️ FULL YACHT CHARTER          │
├─────────────────────────────────┤
│  Date: Sat, Jan 27              │
│  Type: Private Charter          │
│  Capacity: Up to 25 guests      │
├─────────────────────────────────┤
│  Total: AED 2,500               │
└─────────────────────────────────┘
```

---

### Summary of Files to Modify

| File | Change |
|------|--------|
| Database migration | Add `full_yacht_price` to tours, `booking_type` to bookings |
| `src/components/admin/TourForm.tsx` | Add Full Yacht Price input field |
| `src/lib/tourMapper.ts` | Add `fullYachtPrice` to interface and mapper |
| `src/components/tour-detail/BookingSidebar.tsx` | Add booking type toggle, conditional UI |
| `src/components/tour-detail/BookingModal.tsx` | Handle full yacht booking flow |
| `src/components/tour-detail/MobileBookingBar.tsx` | Add booking type selection |
| `src/pages/TourDetail.tsx` | Pass new props to components |

---

### Edge Cases Handled

1. **Tour without Full Yacht option:** Toggle not shown, behaves as current
2. **Full Yacht selected but no price set:** Falls back to per-person pricing
3. **Discount codes with Full Yacht:** Discounts apply to full yacht price as well
4. **Admin leaves capacity empty:** Shows "Private Charter" without capacity number
5. **Mobile responsiveness:** Toggle pills stack vertically on small screens
