
# Plan: Editable "Important Information" Section from Admin Panel

## Overview

The "Important Information" section on tour detail pages (with Cancellation, What to Bring, and Good to Know tabs) is currently hardcoded. This plan adds the ability to customize this content per tour through the admin panel's tour edit form.

---

## Current State

The tour detail page shows three tabs with static content:
- **Cancellation**: Free cancellation policy text
- **What to Bring**: List of items guests should bring
- **Good to Know**: Arrival times, accessibility, dress code, etc.

This content cannot be customized per tour - all tours display the same information.

---

## Solution

Extend the existing `BookingFeatures` pattern to include "Important Information" content. This approach:
- Reuses the existing JSONB column (`booking_features`) on the `tours` table
- Follows the established pattern for editable tour content
- Requires no database migrations

---

## Technical Implementation

### 1. Update Tour Mapper Interface

Extend `BookingFeatures` in `src/lib/tourMapper.ts`:

```
BookingFeatures {
  // ... existing fields ...
  
  // NEW: Important Information content
  cancellation_info: string[];
  what_to_bring: string[];
  good_to_know: string[];
}
```

With sensible defaults matching the current hardcoded content.

---

### 2. Add Editor to Admin Tour Form

Add a new "Important Information" card to `src/components/admin/TourForm.tsx`:

```text
+--------------------------------------+
|  Important Information               |
+--------------------------------------+
|                                      |
|  Cancellation Policy                 |
|  [+ Free cancellation up to 24h...] |
|  [+ Full refund for cancellations..] |
|  [+ No refund for no-shows...]       |
|  [Add item]                          |
|                                      |
|  What to Bring                       |
|  [• Comfortable shoes...]            |
|  [• Camera or smartphone...]         |
|  [Add item]                          |
|                                      |
|  Good to Know                        |
|  [• Arrive 20-30 minutes before...] |
|  [• Not wheelchair accessible...]    |
|  [Add item]                          |
|                                      |
|  [Reset to Defaults]                 |
+--------------------------------------+
```

Each section allows adding, removing, and reordering items.

---

### 3. Update Tour Detail Page

Modify `src/pages/TourDetail.tsx` to read from `tour.bookingFeatures` instead of displaying hardcoded content:

```
Before:
<p>✓ Free cancellation up to 24 hours...</p>

After:
{tour.bookingFeatures.cancellation_info.map((item, i) => (
  <p key={i}>{item}</p>
))}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/lib/tourMapper.ts` | Add 3 new array fields to BookingFeatures interface and defaults |
| `src/components/admin/TourForm.tsx` | Add "Important Information" card with 3 list editors |
| `src/pages/TourDetail.tsx` | Replace hardcoded content with dynamic data from bookingFeatures |

---

## Default Content

The following defaults will be used for new tours and as reset values:

**Cancellation Info:**
- ✓ Free cancellation up to 24 hours before the start time
- ✓ Full refund for cancellations made within the free period
- ✗ No refund for no-shows or late cancellations

**What to Bring:**
- Comfortable shoes and smart casual attire
- Camera or smartphone for photos
- Light jacket (air conditioning on lower deck)
- Valid ID for verification

**Good to Know:**
- Arrive 20-30 minutes before departure
- Not wheelchair accessible
- Vegetarian options available upon request
- Dress code: Smart casual (no shorts/flip-flops)

---

## User Experience

1. **Admin Panel**: Navigate to Tours > Edit Tour > scroll to "Important Information" card
2. **Edit Content**: Add, remove, or modify items in each of the three lists
3. **Reset**: Click "Reset to Defaults" to restore standard content
4. **Preview**: Changes reflect immediately on the tour detail page after saving

---

## Summary

- **No database changes** - uses existing JSONB column
- **Follows existing patterns** - same approach as Booking Sidebar Features
- **Per-tour customization** - each tour can have unique Important Information
- **Sensible defaults** - new tours get standard content automatically
