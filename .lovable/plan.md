
# Dynamic OG Meta Tags for Every Page

## The Challenge

Your website is a single-page application (SPA). All pages currently inherit the same OG metadata from `index.html` because social crawlers (Facebook, Twitter) don't execute JavaScript -- they only read the raw HTML served by the server.

## Solution: Two-Layer Approach

### Layer 1: Client-Side Meta Tag Manager (SEO + Google)

Create a reusable `PageMeta` component that dynamically updates `<title>`, `<meta name="description">`, all `og:*` tags, `twitter:*` tags, and `<link rel="canonical">` via direct DOM manipulation on each page.

- Works for **Google** (which executes JS when crawling)
- Works for in-app browsers and modern preview systems
- Zero dependencies -- pure DOM API

### Layer 2: Server-Side OG Rendering (Facebook, Twitter, LinkedIn)

Create a backend function `render-og` that:
1. Accepts a URL path (e.g., `/about`, `/dubai/dhow-cruises/marina-cruise`)
2. Looks up the correct metadata (from a static map for fixed pages, or from the database for tour pages)
3. Returns a minimal HTML document with correct OG tags plus a JavaScript redirect for human visitors

Then update `vercel.json` to route **bot/crawler traffic** to this function before the SPA catch-all.

---

## Pages and Their Metadata

| Page | Title | Description | Image |
|------|-------|-------------|-------|
| `/` (Home) | Rental Yacht Dubai - Premium Yacht Charters & Dhow Cruises | Experience Dubai from the water... | `/logo.jpeg` |
| `/tours` | Tours - Rental Yacht Dubai | Browse all yacht charters and dhow cruises... | `/logo.jpeg` |
| `/dubai/:category/:slug` (Tour Detail) | {Tour Title} - Rental Yacht Dubai | {Tour description from DB} | {Tour thumbnail from DB} |
| `/about` | About Us - Rental Yacht Dubai | Learn about Rental Yacht Dubai... | `/logo.jpeg` |
| `/contact` | Contact Us - Rental Yacht Dubai | Get in touch with Rental Yacht Dubai... | `/logo.jpeg` |
| `/gallery` | Gallery - Rental Yacht Dubai | Browse our gallery of yacht experiences... | `/logo.jpeg` |
| `/privacy-policy` | Privacy Policy - Rental Yacht Dubai | Your privacy is important... | `/logo.jpeg` |
| `/terms-of-service` | Terms of Service - Rental Yacht Dubai | Read our terms... | `/logo.jpeg` |
| `/cancellation-policy` | Cancellation Policy - Rental Yacht Dubai | Our cancellation and refund policy... | `/logo.jpeg` |
| `/entalyachtdubaipromotion-1` | Luxury Yacht Experience Dubai - Special Offer | Exclusive Dubai yacht party packages... | `/assets/promo/yacht-dubai-skyline.jpg` |

---

## Implementation Steps

### Step 1: Create `PageMeta` Component

A new file `src/components/PageMeta.tsx` that accepts `title`, `description`, `ogImage`, `canonicalPath`, and `ogType` props. On mount, it:
- Sets `document.title`
- Creates/updates `<meta>` tags for `description`, `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Creates/updates `<link rel="canonical">`
- Cleans up on unmount by restoring defaults

### Step 2: Add `PageMeta` to Every Public Page

Add the component to: Home, Tours, TourDetail, About, Contact, Gallery, PrivacyPolicy, TermsOfService, CancellationPolicy, YachtPromoLanding, SavedTours. Each with unique metadata.

For TourDetail specifically, the meta tags will use the tour's actual title, description, and thumbnail image from the database -- making every shared tour link show its own preview.

### Step 3: Create `render-og` Backend Function

A Supabase edge function that:
- Parses the incoming URL path
- For static pages: returns metadata from a hardcoded map
- For tour detail pages (`/dubai/:category/:slug`): queries the `tours` table for title, description, and thumbnail
- Returns a minimal HTML page with correct OG tags and a `<meta http-equiv="refresh">` redirect to the actual page for human visitors

### Step 4: Update `vercel.json` for Crawler Routing

Add a rewrite rule before the SPA catch-all that sends known crawler user agents (facebookexternalhit, Twitterbot, LinkedInBot, etc.) to the `render-og` edge function. This uses Vercel's `has` condition with a `header` check on `user-agent`.

```text
Request Flow:

Facebook Bot visits /about
        |
   vercel.json detects bot UA
        |
   Rewrites to render-og edge function
        |
   Returns HTML with correct OG tags
        |
   Facebook shows "About Us" preview

Human visits /about
        |
   Falls through to SPA catch-all
        |
   index.html loads React app
        |
   PageMeta component updates meta tags
```

---

## Technical Details

### Files to Create
- `src/components/PageMeta.tsx` -- Reusable meta tag manager
- `supabase/functions/render-og/index.ts` -- Server-side OG renderer

### Files to Modify
- `src/pages/Home.tsx` -- Add PageMeta
- `src/pages/Tours.tsx` -- Add PageMeta
- `src/pages/TourDetail.tsx` -- Add PageMeta with dynamic tour data
- `src/pages/About.tsx` -- Add PageMeta
- `src/pages/Contact.tsx` -- Add PageMeta
- `src/pages/Gallery.tsx` -- Add PageMeta
- `src/pages/PrivacyPolicy.tsx` -- Add PageMeta
- `src/pages/TermsOfService.tsx` -- Add PageMeta
- `src/pages/CancellationPolicy.tsx` -- Add PageMeta
- `src/pages/YachtPromoLanding.tsx` -- Add PageMeta
- `src/pages/SavedTours.tsx` -- Add PageMeta
- `vercel.json` -- Add crawler UA rewrite rules

### Key Considerations
- The `render-og` function must use your production domain (`rentalyachtindubai.com`) for `og:url` and `og:image` absolute URLs
- The canonical URL will always point to the current page, not the homepage
- Tour detail pages pull live data from the database so newly added tours automatically get correct OG previews
- After deploying, you should test with Facebook's Sharing Debugger (https://developers.facebook.com/tools/debug/) to verify each page
