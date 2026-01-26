
## Add Pricing Type Option (Per Person / Per Hour) to Admin and Frontend

This implementation adds a configurable pricing type field so admins can specify whether tour prices are charged "per person" or "per hour".

### Database Changes

**Add new column to `tours` table:**
```sql
ALTER TABLE tours ADD COLUMN pricing_type text DEFAULT 'per_person';
```
- Column: `pricing_type`
- Type: `text`
- Values: `per_person` or `per_hour`
- Default: `per_person`

---

### Admin Panel Changes

**File: `src/components/admin/TourForm.tsx`**

Add a pricing type dropdown in the "Pricing & Details" card section:

```text
┌─────────────────────────────────────────────────────────────┐
│  Pricing & Details                                          │
├─────────────────────────────────────────────────────────────┤
│  Price (AED)*  │  Original Price  │  Pricing Type           │
│  [  150     ]  │  [   200       ] │  [ Per Person  ▼]       │
│                                                             │
│  Duration      │  Capacity                                  │
│  [ 2 hours  ]  │  [ Up to 10   ]                           │
└─────────────────────────────────────────────────────────────┘
```

**Changes:**
1. Add `pricing_type` to form state (default: `per_person`)
2. Add a `Select` dropdown with options:
   - "Per Person" (value: `per_person`)
   - "Per Hour" (value: `per_hour`)
3. Include `pricing_type` in the `tourData` object on submit

---

### Type & Mapper Updates

**File: `src/lib/tourMapper.ts`**

Add `pricingType` to the `Tour` interface:
```typescript
export interface Tour {
  // ... existing fields
  pricingType: "per_person" | "per_hour";
}
```

Update the mapping function:
```typescript
pricingType: (dbTour.pricing_type as Tour["pricingType"]) || "per_person",
```

---

### Frontend Display Updates

**File: `src/components/TourCard.tsx`**

Replace hardcoded logic at line 107:
```typescript
// Before (hardcoded based on category)
{tour.category === "yacht-private" ? "per charter" : "per person"}

// After (dynamic from database)
{tour.pricingType === "per_hour" ? "per hour" : "per person"}
```

**File: `src/components/tour-detail/BookingSidebar.tsx`**

Add `pricingType` prop and display dynamic text at line 119:
```typescript
// Props
interface BookingSidebarProps {
  // ... existing props
  pricingType?: "per_person" | "per_hour";
}

// Display
<p className="text-muted-foreground text-sm">
  {pricingType === "per_hour" ? "per hour" : "per person"}
</p>
```

**File: `src/components/tour-detail/MobileBookingBar.tsx`**

Add `pricingType` prop and update line 98:
```typescript
interface MobileBookingBarProps {
  // ... existing props
  pricingType?: "per_person" | "per_hour";
}

<span className="text-xs text-muted-foreground">
  {pricingType === "per_hour" ? "per hour" : "per person"}
</span>
```

**File: `src/components/tour-detail/FloatingBookWidget.tsx`**

Add `pricingType` prop for consistency in the floating widget.

---

### Tour Detail Page Update

**File: `src/pages/TourDetail.tsx`**

Pass `pricingType` to child components:
```typescript
<BookingSidebar
  // ... existing props
  pricingType={tour.pricingType}
/>

<MobileBookingBar
  // ... existing props
  pricingType={tour.pricingType}
/>
```

---

### Summary of Files to Modify

| File | Change |
|------|--------|
| Database migration | Add `pricing_type` column |
| `src/components/admin/TourForm.tsx` | Add pricing type selector |
| `src/lib/tourMapper.ts` | Add `pricingType` to interface and mapper |
| `src/components/TourCard.tsx` | Use dynamic pricing type text |
| `src/components/tour-detail/BookingSidebar.tsx` | Add prop, display dynamic text |
| `src/components/tour-detail/MobileBookingBar.tsx` | Add prop, display dynamic text |
| `src/components/tour-detail/FloatingBookWidget.tsx` | Add prop for consistency |
| `src/pages/TourDetail.tsx` | Pass `pricingType` to components |

---

### Technical Notes

- Default value ensures backward compatibility - all existing tours will show "per person"
- The admin can now choose pricing type when creating or editing any tour
- Frontend components dynamically display the correct text based on database value
