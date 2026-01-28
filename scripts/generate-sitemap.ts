import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const BASE_URL = "https://rentalyachtindubai.com"; // Change to your production domain

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing standard Supabase environment variables.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function generateSitemap() {
    console.log("Starting sitemap generation...");

    // 1. Static Routes
    const staticRoutes = [
        "",
        "/tours",
        "/saved-tours",
        "/gallery",
        "/about",
        "/contact",
        "/privacy-policy",
        "/terms-of-service",
        "/cancellation-policy",
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static routes
    staticRoutes.forEach((route) => {
        xml += `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>${route === "" ? "1.0" : "0.8"}</priority>
  </url>`;
    });

    // 2. Fetch Categories
    const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("slug")
        .eq("is_active", true);

    if (catError) {
        console.error("Error fetching categories:", catError);
    } else if (categories) {
        categories.forEach((cat) => {
            xml += `
  <url>
    <loc>${BASE_URL}/dubai/${cat.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
        });
    }

    // 3. Fetch Tours (fetching only necessary fields)
    // We need to know the category slug for the URL structure /dubai/:category/:tour
    const { data: tours, error: tourError } = await supabase
        .from("tours")
        .select("slug, updated_at, categories(slug)")
        .eq("status", "active");

    if (tourError) {
        console.error("Error fetching tours:", tourError);
    } else if (tours) {
        tours.forEach((tour: any) => {
            // Handle the relation correctly - it might be an array or object depending on relationship
            const categorySlug = tour.categories?.slug || "general";

            xml += `
  <url>
    <loc>${BASE_URL}/dubai/${categorySlug}/${tour.slug}</loc>
    <lastmod>${tour.updated_at ? tour.updated_at.split("T")[0] : new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        });
    }

    xml += `
</urlset>`;

    // Ensure public directory exists
    const publicDir = path.resolve(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    // Write sitemap.xml
    fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml);
    console.log("✅ Sitemap generated successfully at public/sitemap.xml");

    // Create robots.txt if it doesn't exist
    const robotsTxtPath = path.join(publicDir, "robots.txt");
    const robotsContent = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

    fs.writeFileSync(robotsTxtPath, robotsContent);
    console.log("✅ robots.txt generated/updated successfully");
}

generateSitemap();
