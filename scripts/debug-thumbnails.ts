
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkThumbnails() {
    console.log("Fetching tours...");
    const { data: tours, error } = await supabase
        .from("tours")
        .select("id, title, image_url, gallery");

    if (error) {
        console.error("Error fetching tours:", error);
        return;
    }

    console.log(`Found ${tours.length} tours.`);

    tours.forEach((tour: any) => {
        console.log(`\nTour: ${tour.title}`);
        console.log(`  - Image URL: ${tour.image_url || "[NULL]"}`);
        console.log(`  - Gallery: ${tour.gallery?.length} images`);
        if (tour.image_url && tour.image_url.includes("supabase")) {
            // Test if we can construct the predicted WebP url
            const parts = tour.image_url.split("/");
            const fileName = parts.pop();
            const folder = parts.pop();
            if ((folder === "main" || folder === "gallery") && !fileName.endsWith(".webp")) {
                const baseName = fileName.replace(/\.[^.]+$/, "");
                const webpUrl = [...parts, folder, "webp", baseName + ".webp"].join("/");
                console.log(`  - Predicted WebP: ${webpUrl}`);
            }
        }
    });
}

checkThumbnails();
