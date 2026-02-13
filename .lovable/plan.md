
# Seasonal Tour Toggle and Duplicate Feature

## 1. Quick On/Off Toggle in Admin Tours Table

**Current State**: The tours table shows a "Status" column that only displays "Featured" or "Active" badges -- it never shows "Draft" or "Archived" status, and there's no way to quickly toggle a tour on or off without editing it.

**Changes to `src/pages/admin/Tours.tsx`**:
- Replace the current Status column badge (lines 309-319) with a **Switch toggle** that instantly activates/deactivates a tour
- When toggled OFF, the tour status changes to `"draft"` (hidden from website)
- When toggled ON, the tour status changes to `"active"` (visible on website)  
- Add a `handleToggleStatus` function that updates the database and refreshes the local state
- Show a colored dot indicator next to the switch: green for active, gray for draft/archived
- Add a status filter dropdown option (Active / Draft / Archived / All) alongside the existing category filter
- Update the stats cards to show inactive count as well

## 2. Duplicate/Copy Tour Feature

**Changes to `src/pages/admin/Tours.tsx`**:
- Add a "Duplicate" menu item in the existing dropdown menu (between "Edit" and "Delete")
- Import the `Copy` icon from lucide-react
- Add a `handleDuplicate` function that:
  1. Fetches the full tour data by ID
  2. Creates a new tour with all the same fields but:
     - New generated UUID (handled by DB default)
     - Title prefixed with "Copy of "
     - Slug appended with `-copy` (and a timestamp suffix to avoid conflicts)
     - seo_slug set to null (to be regenerated)
     - Status set to `"draft"` so it doesn't go live immediately
     - featured set to false
  3. Shows a success toast with a link to edit the new tour
  4. Refreshes the tours list

## 3. Status Filter Enhancement

**Changes to `src/pages/admin/Tours.tsx`**:
- Add a new `statusFilter` state variable (default: `"all"`)
- Add a second filter dropdown for Status: All / Active / Draft / Archived
- Update `filteredTours` to also filter by status when not "all"

## Files Modified
- `src/pages/admin/Tours.tsx` -- Toggle switch, duplicate action, status filter

## No Database Changes Required
The `status` column already exists on the `tours` table with text type supporting any value. The frontend `useTours` hook already filters by `status = 'active'`, so setting status to `"draft"` automatically hides tours from the website.
