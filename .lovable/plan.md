

# Configurable Booking Options: Guests, Quantity, and Add-Ons

## Overview

This plan adds three admin-configurable booking options per tour/activity, all stored in the existing `booking_features` JSONB column on the `tours` table -- no database migration needed.

---

## 1. Data Model (inside `booking_features` JSONB)

New fields added to the `BookingFeatures` interface in `src/lib/tourMapper.ts`:

```text
booking_mode: "guests" | "quantity"    (default: "guests")

guest_categories: [
  { name: "Adult", label: "12+ years", price: 150, min: 1, max: 10 },
  { name: "Child", label: "4-11 years", price: 75, min: 0, max: 10 },
  { name: "Infant", label: "0-3 years", price: 0, min: 0, max: 5 }
]

quantity_config: {
  label: "Number of Tickets",
  price: 150,
  min: 1,
  max: 50
}

addons: [
  { id: "uuid", name: "Champagne Package", price: 200, description: "Premium champagne..." },
  { id: "uuid", name: "Photography", price: 350, description: "Professional photos..." }
]
```

---

## 2. Admin Panel Changes (`TourForm.tsx`)

A new **"Booking Options"** card will be added to the tour form with three collapsible sections:

### A. Booking Mode Toggle
- Radio selector: **"Guest Categories"** vs **"Quantity Only"**
- Switching modes shows/hides the relevant configuration below

### B. Guest Categories Editor (when mode = "guests")
- Table-style editor with rows for each category
- Each row: **Name** (text input), **Label** (text input), **Price** (number), **Min** (number), **Max** (number)
- "Add Category" button to add more rows
- Delete button per row (minimum 1 category required)
- Pre-populated with Adult/Child/Infant defaults

### C. Quantity Config (when mode = "quantity")
- **Label** field (e.g., "Number of Tickets", "Number of Jetskis")
- **Price per unit** (AED)
- **Min / Max** quantity limits

### D. Add-Ons Editor (always visible, both modes)
- List of add-on items with:
  - **Name** (text input)
  - **Price** (number input)
  - **Description** (text input)
- "Add New Add-On" button
- Delete button per add-on
- Auto-generates unique IDs for each add-on

---

## 3. Booking Modal Changes (`BookingModal.tsx`)

### Dynamic Guest/Quantity Section (Step 1)
- **If `booking_mode === "guests"`**: Render guest counters dynamically from `guest_categories` array instead of hardcoded Adult/Child/Infant. Each counter uses the admin-defined name, label, price, min, and max.
- **If `booking_mode === "quantity"`**: Render a single quantity counter using the admin-defined label and price.

### Add-Ons Section (Step 1, below guests/quantity)
- Display available add-ons as selectable cards with checkbox toggle
- Each card shows: name, price, description
- Selected add-ons are added to the total price

### Price Calculation Update
- **Guest mode**: Sum of (category.price x count) for each category
- **Quantity mode**: quantity_config.price x quantity
- **Add-ons**: Sum of selected add-on prices
- Total = base + transfer + deck surcharge - discounts + add-ons

---

## 4. Booking Sidebar Changes (`BookingSidebar.tsx`)

- **Guest mode**: Show dynamic counters from `guest_categories` instead of hardcoded Adult/Child
- **Quantity mode**: Show single quantity counter
- Base price calculation updated to use the new dynamic data

---

## 5. Booking Submission Changes

- Store selected add-ons in `special_requests` field (or as structured JSON within it)
- Store guest category breakdown (e.g., `[GUESTS: 2 Adult, 1 Child]`) or `[QUANTITY: 3 x Jetski]`
- Include add-on details: `[ADD-ONS: Champagne Package AED 200, Photography AED 350]`

---

## 6. Files to Create/Modify

| File | Action |
|------|--------|
| `src/lib/tourMapper.ts` | Add new interfaces and defaults to `BookingFeatures` |
| `src/components/admin/TourForm.tsx` | Add "Booking Options" card with guest categories, quantity config, and add-ons editors |
| `src/components/tour-detail/BookingModal.tsx` | Dynamic rendering based on `booking_mode`, add-on selection, updated price calc |
| `src/components/tour-detail/BookingSidebar.tsx` | Dynamic guest/quantity counters, updated base price calc |

No database migration is required -- all data is stored in the existing `booking_features` JSONB column.

---

## 7. Default Behavior (Backward Compatibility)

- Existing tours without the new fields will default to `booking_mode: "guests"` with the standard Adult/Child/Infant categories and no add-ons
- The `mapDbTourToTour` function already merges defaults with stored data, so existing tours continue to work unchanged

