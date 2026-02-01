
# Implementation Plan: Admin Analytics & Reviews Management

This plan addresses four requests:
1. Create a live Conversion Rate analytics page
2. Track real website visitor counts
3. Add dynamic review management to tour detail pages
4. Fix the /admin/activity-log page

---

## 1. Live Conversion Rate Page

### What We'll Build
A new analytics page at `/admin/analytics` showing real-time conversion metrics:
- Website visitors vs. bookings ratio
- Conversion funnel visualization
- Daily/weekly/monthly trends with charts

### Database Changes
Create a new `page_views` table to track website visits:
- `id` (uuid)
- `session_id` (text) - unique visitor session
- `page_path` (text) - which page was visited
- `referrer` (text, nullable) - where they came from
- `user_agent` (text, nullable)
- `created_at` (timestamp)

### Files to Create
| File | Purpose |
|------|---------|
| `src/pages/admin/Analytics.tsx` | New analytics dashboard page |
| `src/hooks/usePageViews.ts` | Hook to track and fetch page view data |

### Files to Modify
| File | Changes |
|------|---------|
| `src/App.tsx` | Add route for `/admin/analytics` |
| `src/components/layout/Layout.tsx` | Add page view tracking on mount |
| `src/components/admin/AdminSidebar.tsx` | Add Analytics menu item |
| `src/pages/admin/Dashboard.tsx` | Update stats to show real data |

---

## 2. Real Website Visitor Tracking

### How It Works
1. When any page loads, we record a page view to the database
2. Use browser's `sessionStorage` to track unique sessions
3. Calculate visitors, page views, and conversion rates from real data

### Dashboard Integration
Update the "Online Store Visitors" stat card to show:
- Real unique visitor count
- Real conversion rate (bookings / visitors)
- Week-over-week comparison

---

## 3. Tour Detail Reviews Management

### What We'll Build
Replace the hardcoded mock reviews with real database data, plus add admin controls for managing reviews directly on the tour page.

### ReviewsSection Updates
- Fetch real reviews from database filtered by tour_id
- Show "Add Review" button for admins
- Show edit/delete controls for each review (admin only)
- Dialog forms for add/edit review operations

### Files to Modify
| File | Changes |
|------|---------|
| `src/components/tour-detail/ReviewsSection.tsx` | Fetch real reviews, add CRUD functionality |

### Admin Features
- Inline review management without leaving the tour page
- Quick approve/reject buttons
- Delete confirmation dialog

---

## 4. Fix Activity Log Page

### Issue Identified
The activity log page code is correct, but:
1. The `activity_logs` table is empty (no activities recorded yet)
2. RLS policy requires `admin` role - need to verify the logged-in user has this role

### Solution
1. Update the `useLogActivity` hook integration across admin pages to ensure activities are being logged
2. Add fallback message when no logs exist
3. Ensure the current admin user can access the logs

### Files to Review
| File | Action |
|------|--------|
| `src/hooks/useActivityLog.ts` | Already correct |
| `src/pages/admin/ActivityLog.tsx` | Already correct - shows "No activity logs found" when empty |
| Admin mutation hooks | Ensure they call `useLogActivity` to record changes |

---

## Database Schema

### New Table: `page_views`
```text
Columns:
- id (uuid, primary key, default gen_random_uuid())
- session_id (text, not null) - identifies unique browser session
- page_path (text, not null) - the URL path visited
- referrer (text, nullable) - referring URL
- user_agent (text, nullable) - browser info
- ip_address (text, nullable) - for geo analytics (optional)
- created_at (timestamptz, default now())

Indexes:
- created_at (for time-based queries)
- session_id (for unique visitor counts)
```

### RLS Policies for `page_views`
- INSERT: Anyone can insert (public tracking)
- SELECT: Admin only (privacy)

---

## Technical Details

### Page View Tracking Flow
```text
1. User visits any page
2. Layout component mounts
3. Check sessionStorage for existing session_id
4. If none, generate new UUID as session_id
5. Insert page view record to database
6. No blocking - fire and forget for performance
```

### Conversion Rate Calculation
```text
Conversion Rate = (Total Bookings / Unique Visitors) × 100

Example:
- Unique visitors this week: 500
- Bookings this week: 18
- Conversion Rate: 3.6%
```

### Reviews Data Flow
```text
1. TourDetail page renders ReviewsSection with tour_id
2. ReviewsSection queries reviews table WHERE tour_id = current tour
3. For admins, show management buttons
4. CRUD operations update database in real-time
```

---

## Summary of Changes

### New Files (3)
1. `src/pages/admin/Analytics.tsx` - Full analytics dashboard
2. `src/hooks/usePageViews.ts` - Page view tracking hook
3. Database migration for `page_views` table

### Modified Files (6)
1. `src/App.tsx` - Add analytics route
2. `src/components/layout/Layout.tsx` - Add tracking
3. `src/components/admin/AdminSidebar.tsx` - Add menu link
4. `src/pages/admin/Dashboard.tsx` - Real stats
5. `src/components/tour-detail/ReviewsSection.tsx` - Real reviews + CRUD
6. Various admin pages - Ensure activity logging

---

## Expected Outcomes

After implementation:
- Real visitor counts on dashboard (updated live)
- Accurate conversion rate calculations
- Tour pages show actual customer reviews
- Admins can manage reviews directly on tour pages
- Activity log captures all admin actions
- Full analytics page with charts and trends
