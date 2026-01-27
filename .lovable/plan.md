
# SEO-Friendly URL Restructuring with 301 Redirects

## Current URL Structure Analysis

| Page Type | Current URL Pattern | Example |
|-----------|-------------------|---------|
| Tour Detail | `/tours/:slug` | `/tours/44-ft-yacht-private` |
| Tour Listing | `/tours` | `/tours` |
| Category Filter | `/tours?category=slug` | `/tours?category=yacht-private` |
| Gallery | `/gallery` | `/gallery` |
| About | `/about` | `/about` |
| Contact | `/contact` | `/contact` |
| Legal Pages | `/privacy-policy`, `/terms-of-service`, `/cancellation-policy` | |

### Identified Issues

1. **Tour Slugs** - Current slugs are basic (e.g., `44-ft-yacht-private`). Better SEO would include location and keywords (e.g., `private-yacht-charter-dubai-marina-44ft`)

2. **Category URLs** - Using query parameters (`?category=yacht-private`) instead of clean paths (`/yacht-charters/private/`)

3. **No Location Context** - URLs don't include "dubai" which is important for local SEO

---

## Proposed SEO-Friendly URL Structure

| Page Type | New URL Pattern | Example |
|-----------|----------------|---------|
| Tour Detail | `/dubai/:category-slug/:tour-slug` | `/dubai/private-yacht-charter/luxury-44ft-yacht-dubai-marina` |
| Category Page | `/dubai/:category-slug` | `/dubai/private-yacht-charter` |
| All Tours | `/dubai/tours` or `/tours` (keep current) | `/dubai/tours` |
| Gallery | `/dubai/gallery` or keep `/gallery` | `/gallery` |

### Tour Slug Format Improvements

**Current:** `44-ft-yacht-private`
**Proposed:** `luxury-44ft-yacht-charter-dubai-marina`

Pattern: `{adjective}-{size}-{type}-{location}`

---

## Implementation Plan

### Phase 1: Create Redirect Handler Component

A new React component that handles old URLs and redirects to new ones using `react-router-dom`'s `Navigate` component.

**New File: `src/components/RedirectHandler.tsx`**

This component will:
- Match old URL patterns
- Look up the corresponding new URL
- Perform 301-equivalent client-side redirect

### Phase 2: Update Route Configuration

**File: `src/App.tsx`**

Add new routes with the improved URL structure while keeping old routes that redirect:

```text
New Routes:
/dubai/private-yacht-charter/:slug  → TourDetail (private yachts)
/dubai/shared-yacht-tours/:slug     → TourDetail (shared yachts)
/dubai/dhow-cruises/:slug           → TourDetail (dhow cruises)
/dubai/megayacht-experiences/:slug  → TourDetail (megayachts)

Old Routes (with redirects):
/tours/:slug → Redirect to /dubai/:category/:new-slug
```

### Phase 3: Update Database Slugs

Add a new column `seo_slug` to the tours table that contains the SEO-optimized slug while keeping the original `slug` for backwards compatibility.

**Database Migration:**
- Add `seo_slug` column to `tours` table
- Create a redirect mapping table `url_redirects` for old-to-new URL mappings

### Phase 4: Update Server-Side Redirects

**File: `vercel.json`**

Add permanent redirects (301) at the server level for better SEO:

```json
{
  "redirects": [
    { "source": "/tours/44-ft-yacht-private", "destination": "/dubai/private-yacht-charter/luxury-44ft-yacht-charter-dubai-marina", "permanent": true },
    // ... more redirects
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Phase 5: Update Internal Links

Update all components that link to tours to use the new URL structure:

**Files to modify:**
- `src/components/TourCard.tsx` - Tour card links
- `src/components/layout/Header.tsx` - Category dropdown links
- `src/components/layout/Footer.tsx` - Footer tour links
- `src/components/home/FeaturedTours.tsx` - Featured tour links
- `src/pages/TourDetail.tsx` - Related tours links
- `src/pages/Tours.tsx` - Tour grid links

### Phase 6: Update Tour Form for SEO Slugs

**File: `src/components/admin/TourForm.tsx`**

Enhance the slug generation to:
- Include location name (e.g., "dubai-marina")
- Add category keyword (e.g., "yacht-charter")
- Support custom SEO slug field

---

## Technical Implementation Details

### New Database Table: `url_redirects`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| old_path | TEXT | Original URL path (e.g., `/tours/44-ft-yacht-private`) |
| new_path | TEXT | New SEO URL path |
| redirect_type | INTEGER | 301 (permanent) or 302 (temporary) |
| created_at | TIMESTAMPTZ | When redirect was created |

### New Component: `src/lib/seoUtils.ts`

Utility functions for URL generation:

```typescript
// Generate SEO-friendly category slug
function getCategoryPath(category: string): string {
  const categoryPaths = {
    "yacht-private": "private-yacht-charter",
    "yacht-shared": "shared-yacht-tours", 
    "dhow-cruise": "dhow-cruises",
    "megayacht": "megayacht-experiences"
  };
  return categoryPaths[category] || category;
}

// Generate full SEO URL for a tour
function getTourUrl(tour: Tour): string {
  const categoryPath = getCategoryPath(tour.category);
  return `/dubai/${categoryPath}/${tour.seoSlug || tour.slug}`;
}
```

### Updated TourCard Link

```tsx
// Before
<Link to={`/tours/${tour.slug}`}>

// After
<Link to={getTourUrl(tour)}>
```

### Vercel.json Redirect Configuration

For proper 301 redirects that search engines respect:

```json
{
  "redirects": [
    {
      "source": "/tours/dhow-cruise-marina",
      "destination": "/dubai/dhow-cruises/dhow-cruise-dubai-marina",
      "permanent": true
    },
    {
      "source": "/tours/:slug",
      "destination": "/dubai/tours/:slug",
      "permanent": true
    }
  ]
}
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/lib/seoUtils.ts` | URL generation utilities |
| `supabase/migrations/xxx_add_seo_slugs.sql` | Database migration for SEO slugs |

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add new routes with category-based paths, add redirect routes for old URLs |
| `vercel.json` | Add 301 redirects for old URLs |
| `src/components/TourCard.tsx` | Use new `getTourUrl` function |
| `src/components/layout/Header.tsx` | Update category dropdown links |
| `src/components/layout/Footer.tsx` | Update footer tour links |
| `src/components/admin/TourForm.tsx` | Add SEO slug field with auto-generation |
| `src/hooks/useTours.ts` | Include `seo_slug` in tour queries |
| `src/lib/tourMapper.ts` | Map `seo_slug` to Tour interface |
| `src/pages/TourDetail.tsx` | Handle both old and new slug lookups |
| `src/pages/Tours.tsx` | Update category filter URLs |

---

## Migration Strategy

1. **Add `seo_slug` column** - New field without breaking existing functionality
2. **Generate SEO slugs** - Admin interface to bulk-generate improved slugs
3. **Deploy new routes** - Both old and new routes work simultaneously  
4. **Add server redirects** - Configure vercel.json with 301 redirects
5. **Update internal links** - Switch all components to use new URLs
6. **Monitor 404s** - Track any broken links and add missing redirects

---

## SEO Benefits

- **Location targeting**: "dubai" in URLs helps with local search
- **Keyword-rich URLs**: Category and tour type in path improves relevance
- **Clean structure**: Hierarchical URLs (dubai/category/tour) signal content organization
- **301 redirects**: Preserve link equity from existing indexed pages
