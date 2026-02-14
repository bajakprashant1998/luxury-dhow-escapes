import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DOMAIN = "https://rentalyachtindubai.com";
const DEFAULT_IMAGE = `${DOMAIN}/logo.jpeg`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Static page metadata
const staticPages: Record<string, { title: string; description: string; image?: string }> = {
  "/": {
    title: "Rental Yacht Dubai - Premium Yacht Charters & Dhow Cruises",
    description: "Experience Dubai from the water with premium yacht charters, dhow cruises, and luxury marine experiences. Book your unforgettable Dubai cruise today.",
  },
  "/tours": {
    title: "Tours - Rental Yacht Dubai",
    description: "Browse all yacht charters and dhow cruises in Dubai. Find the perfect marine experience for your Dubai adventure.",
  },
  "/about": {
    title: "About Us - Rental Yacht Dubai",
    description: "Learn about Rental Yacht Dubai — Dubai's premier yacht charter and dhow cruise company since 2015.",
  },
  "/contact": {
    title: "Contact Us - Rental Yacht Dubai",
    description: "Get in touch with Rental Yacht Dubai. Book your dream cruise or ask us anything about our yacht experiences.",
  },
  "/gallery": {
    title: "Gallery - Rental Yacht Dubai",
    description: "Browse our stunning gallery of yacht experiences, dhow cruises, and luxury marine moments in Dubai.",
  },
  "/privacy-policy": {
    title: "Privacy Policy - Rental Yacht Dubai",
    description: "Your privacy is important to us. Read how Rental Yacht Dubai collects, uses, and protects your personal information.",
  },
  "/terms-of-service": {
    title: "Terms of Service - Rental Yacht Dubai",
    description: "Read the terms and conditions for using Rental Yacht Dubai's yacht charter and cruise services.",
  },
  "/cancellation-policy": {
    title: "Cancellation Policy - Rental Yacht Dubai",
    description: "Our cancellation and refund policy for yacht charters and dhow cruises in Dubai.",
  },
  "/saved-tours": {
    title: "Saved Tours - Rental Yacht Dubai",
    description: "View your saved yacht tours and dhow cruises. Plan your perfect Dubai experience.",
  },
  "/entalyachtdubaipromotion-1": {
    title: "Luxury Yacht Experience Dubai - Special Offer | Rental Yacht Dubai",
    description: "Exclusive Dubai yacht party packages. Premium fleet, professional crew, and unforgettable experiences at special promotional prices.",
    image: `${DOMAIN}/assets/promo/yacht-dubai-skyline.jpg`,
  },
  "/activities": {
    title: "Water Activities & Events - Rental Yacht Dubai",
    description: "Discover thrilling water activities and luxury yacht events in Dubai. Jet ski, parasailing, birthday parties, weddings, and more.",
  },
};

// Category path mappings
const pathToCategory: Record<string, string> = {
  "dhow-cruises": "dhow-cruise",
  "shared-yacht-tours": "yacht-shared",
  "private-yacht-charter": "yacht-private",
  "megayacht-experiences": "megayacht",
  "water-activities": "water-activity",
  "yacht-events": "yacht-event",
};

function renderHTML(
  title: string,
  description: string,
  image: string,
  url: string,
  ogType = "website"
): string {
  const escapedTitle = title.replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const escapedDesc = description.replace(/"/g, "&quot;").replace(/</g, "&lt;");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapedTitle}</title>
  <meta name="description" content="${escapedDesc}" />

  <!-- Open Graph -->
  <meta property="og:title" content="${escapedTitle}" />
  <meta property="og:description" content="${escapedDesc}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:site_name" content="Rental Yacht Dubai" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapedTitle}" />
  <meta name="twitter:description" content="${escapedDesc}" />
  <meta name="twitter:image" content="${image}" />

  <link rel="canonical" href="${url}" />

  <!-- Redirect human visitors to the actual page -->
  <meta http-equiv="refresh" content="0; url=${url}" />
</head>
<body>
  <p>Redirecting to <a href="${url}">${escapedTitle}</a>...</p>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path") || "/";
    const fullUrl = `${DOMAIN}${path}`;

    // Check static pages first
    if (staticPages[path]) {
      const meta = staticPages[path];
      const html = renderHTML(
        meta.title,
        meta.description,
        meta.image || DEFAULT_IMAGE,
        fullUrl
      );
      return new Response(html, {
        headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Check for tour detail pages: /dubai/{category}/{slug}
    const tourMatch = path.match(/^\/dubai\/([^/]+)\/([^/]+)$/);
    if (tourMatch) {
      const [, categoryPath, tourSlug] = tourMatch;
      
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Try seo_slug first, then slug
      let { data: tour } = await supabase
        .from("tours")
        .select("title, description, meta_title, meta_description, image_url")
        .eq("seo_slug", tourSlug)
        .eq("status", "active")
        .maybeSingle();

      if (!tour) {
        const result = await supabase
          .from("tours")
          .select("title, description, meta_title, meta_description, image_url")
          .eq("slug", tourSlug)
          .eq("status", "active")
          .maybeSingle();
        tour = result.data;
      }

      if (tour) {
        const title = (tour.meta_title || `${tour.title} - Rental Yacht Dubai`).slice(0, 70);
        const description = (tour.meta_description || tour.description || "").slice(0, 160);
        const image = tour.image_url
          ? (tour.image_url.startsWith("http") ? tour.image_url : `${DOMAIN}${tour.image_url}`)
          : DEFAULT_IMAGE;

        const html = renderHTML(title, description, image, fullUrl, "article");
        return new Response(html, {
          headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
        });
      }
    }

    // Check for category pages: /dubai/{category}
    const categoryMatch = path.match(/^\/dubai\/([^/]+)$/);
    if (categoryMatch) {
      const [, catPath] = categoryMatch;
      const catName = catPath.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      const title = `${catName} - Rental Yacht Dubai`;
      const description = `Browse our ${catName.toLowerCase()} experiences in Dubai. Find the perfect marine experience for your adventure.`;
      
      const html = renderHTML(title, description, DEFAULT_IMAGE, fullUrl);
      return new Response(html, {
        headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Fallback: return default OG tags
    const html = renderHTML(
      staticPages["/"].title,
      staticPages["/"].description,
      DEFAULT_IMAGE,
      fullUrl
    );
    return new Response(html, {
      headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error("render-og error:", error);
    const html = renderHTML(
      "Rental Yacht Dubai",
      "Premium yacht charters and dhow cruises in Dubai.",
      DEFAULT_IMAGE,
      DOMAIN
    );
    return new Response(html, {
      headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
    });
  }
});
