
## Single Booking Type per Tour (No Toggle for Customers)

This change removes the customer-facing toggle and makes each tour have a single booking type configured by the admin.

---

### Current Behavior
- Admin sets a price AND optionally a full yacht price
- If full yacht price exists, customers see a toggle to choose between both options

### New Behavior
- Admin selects ONE booking type per tour: "Per Person" OR "Full Yacht"
- Customers only see the booking type configured for that tour (no toggle)

---

### Admin Panel Changes

**File: `src/components/admin/TourForm.tsx`**

Replace the current pricing configuration with a clear booking type selector:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  Pricing & Details                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Booking Type*                                                              │
│  [ Per Person ▼ ]     ← Options: "Per Person" or "Full Yacht"              │
│                                                                             │
│  Price (AED)*  │  Original Price  │  Duration      │  Capacity              │
│  [  150     ]  │  [   200       ] │  [ 2 hours  ]  │  [ Up to 25   ]        │
└─────────────────────────────────────────────────────────────────────────────┘
```

Changes:
- Remove `pricing_type` dropdown (per_person/per_hour) - merge into booking type
- Add/modify "Booking Type" dropdown with clear options:
  - "Per Person" - Price is per individual guest
  - "Full Yacht (Private Charter)" - Price is for entire yacht
- When "Full Yacht" is selected, the Price field represents the full yacht price
- Remove separate `full_yacht_price` input (use main price field instead)

---

### Database Consideration

No database changes needed. We can repurpose the existing `full_yacht_price` column:
- If `full_yacht_price` has a value → booking type is "full_yacht"
- If `full_yacht_price` is NULL/empty → booking type is "per_person"

OR use the existing pricing fields differently:
- "Per Person" mode: Use `price` field (per person)
- "Full Yacht" mode: Use `price` field (per yacht), ignore guest counts

---

### Frontend Changes

**File: `src/components/tour-detail/BookingSidebar.tsx`**

Remove the booking type toggle completely:
- Determine booking type from tour data (based on admin configuration)
- Show only ONE pricing display:
  - Per Person: Show price, guest counters, calculated total
  - Full Yacht: Show fixed yacht price, capacity info, no guest counters

Changes:
1. Remove `bookingType` state and toggle UI
2. Calculate booking type from props: `const isFullYacht = fullYachtPrice && fullYachtPrice > 0`
3. Show appropriate UI based on `isFullYacht`:
   - TRUE: Full yacht price, "Private Charter" badge, capacity info, no guest counters
   - FALSE: Per person price, guest counters for adults/children

**File: `src/components/tour-detail/MobileBookingBar.tsx`**

Same changes:
1. Remove `bookingType` state and toggle buttons
2. Determine from props: `const isFullYacht = fullYachtPrice && fullYachtPrice > 0`
3. Show single price display based on tour configuration

**File: `src/components/tour-detail/BookingModal.tsx`**

Update to use derived booking type:
1. Remove `bookingType` prop - derive from `fullYachtPrice`
2. If full yacht: skip guest counter step, show charter summary
3. If per person: show normal guest selection flow

---

### Summary of Changes

| File | Change |
|------|--------|
| `src/components/admin/TourForm.tsx` | Simplify to single booking type dropdown |
| `src/components/tour-detail/BookingSidebar.tsx` | Remove toggle, derive type from data |
| `src/components/tour-detail/MobileBookingBar.tsx` | Remove toggle, derive type from data |
| `src/components/tour-detail/BookingModal.tsx` | Derive booking type from fullYachtPrice |

---

### User Experience After Change

**Per Person Tour:**
```text
┌─────────────────────────────────┐
│  AED 150                        │
│  per person                     │
│                                 │
│  [Date Picker]                  │
│  Adults: [- 2 +]               │
│  Children: [- 0 +]             │
│                                 │
│  Total: AED 300                │
│  [Reserve Now]                  │
└─────────────────────────────────┘
```

**Full Yacht Tour:**
```text
┌─────────────────────────────────┐
│  🛥️ Private Charter             │
│  AED 2,500                      │
│  per yacht (entire charter)     │
│                                 │
│  👥 Capacity: Up to 25 guests   │
│  ✓ Private experience           │
│  ✓ Exclusive use                │
│                                 │
│  [Date Picker]                  │
│                                 │
│  Total: AED 2,500              │
│  [Reserve Now]                  │
└─────────────────────────────────┘
```

---

### Technical Notes

1. **Backward compatibility**: Tours with `full_yacht_price` set become "Full Yacht" tours
2. **Simple logic**: `isFullYacht = fullYachtPrice && fullYachtPrice > 0`
3. **Admin clarity**: Clear dropdown choice, not two separate price fields
4. **No customer confusion**: One clear price, one booking type per tour
