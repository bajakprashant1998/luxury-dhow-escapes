import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);

async function debugTours() {
    console.log("🔍 Checking 'tours' table...");

    // 1. Check all statuses
    const { data: allTours, error } = await supabase
        .from("tours")
        .select("title, slug, status, category_id");

    if (error) {
        console.error("Error fetching tours:", error);
        return;
    }

    console.log(`Found ${allTours?.length} tours total.`);
    if (allTours && allTours.length > 0) {
        console.log("--- First 5 tours ---");
        allTours.slice(0, 5).forEach(t => console.log(`- [${t.title}] Status: '${t.status}' CategoryID: ${t.category_id}`));

        // Check specific statuses
        const published = allTours.filter(t => t.status === 'published');
        const Published = allTours.filter(t => t.status === 'Published');
        console.log(`\n'published' count: ${published.length}`);
        console.log(`'Published' count: ${Published.length}`);
    } else {
        console.log("No tours found at all.");
    }
}

debugTours();
