import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface RequestBody {
  title: string;
  category: string;
  location: string;
  type: "short" | "long" | "slug" | "subtitle";
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, category, location, type } = (await req.json()) as RequestBody;

    if (!title) {
      return new Response(
        JSON.stringify({ error: "Title is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the prompt based on type
    const systemPrompt = `You are a luxury copywriter for a premium yacht charter and dhow cruise company in Dubai. Your writing is sophisticated, inviting, and conversion-focused. You specialize in creating content that inspires wanderlust and conveys exclusivity.

Writing Style Guidelines:
- Use evocative, sensory language that transports readers
- Highlight experiences over features
- Maintain a warm yet professional tone
- Create urgency without being pushy
- Appeal to aspirational desires`;

    const shortPrompt = `Write a compelling SHORT DESCRIPTION (2-3 sentences, max 200 characters) for this tour:

Tour: ${title}
Category: ${category}
Location: ${location || "Dubai"}

Requirements:
- Make it captivating and concise
- Use **bold** for ONE key feature
- Use *italic* for ONE experiential word
- Focus on the unique selling point
- Create desire to learn more

Example format:
"Experience the *magic* of Dubai's skyline aboard our **luxury yacht**. Perfect for intimate celebrations and unforgettable sunsets."`;

    const longPrompt = `Write a PREMIUM FULL DESCRIPTION for this tour:

Tour: ${title}
Category: ${category}
Location: ${location || "Dubai"}

Requirements:
1. Use markdown formatting:
   - ## for main section headings
   - ### for subsections
   - **bold** for key features, yacht names, premium amenities
   - *italic* for experiences, feelings, lifestyle phrases
   - - for bullet points

2. Include these sections:
   - Opening paragraph (evocative, sets the scene)
   - ## The Experience (what guests will feel/see)
   - ## Onboard Amenities (luxury features)
   - ## Destinations (iconic Dubai landmarks they'll see)
   - ## Perfect For (occasions: celebrations, corporate, romantic)
   - Closing call-to-action paragraph

3. Include 2-3 natural internal links:
   - [Explore Our Fleet →](/tours)
   - [View All Destinations →](/tours)
   - [Book Your Experience →](/contact)

4. Content guidelines:
   - 300-400 words total
   - Break into short, scannable paragraphs
   - Use sensory language
   - Mention Dubai landmarks: Burj Al Arab, Palm Jumeirah, Dubai Marina, Atlantis
   - End with subtle urgency

Write the description now:`;

    const slugPrompt = `Generate 5 SEO-friendly URL slugs for this tour:

Tour: ${title}
Category: ${category}
Location: ${location || "Dubai"}

Requirements:
- Each slug should be lowercase, hyphen-separated, no special characters
- Include relevant keywords (tour type, location, experience)
- Keep between 4-8 words
- Optimize for search engines
- Return ONLY the 5 slugs, one per line, numbered 1-5
- No extra text or explanation

Example output:
1. luxury-yacht-charter-dubai-marina
2. private-yacht-cruise-dubai-sunset
3. premium-boat-ride-dubai-marina-skyline
4. exclusive-yacht-experience-dubai
5. dubai-marina-luxury-yacht-tour`;

    const subtitlePrompt = `Generate 5 compelling subtitles for this tour:

Tour: ${title}
Category: ${category}
Location: ${location || "Dubai"}

Requirements:
- Each subtitle should be 6-12 words
- Engaging, descriptive, and conversion-focused
- Highlight unique selling points or experiences
- No quotes around them
- Return ONLY the 5 subtitles, one per line, numbered 1-5
- No extra text or explanation

Example output:
1. Sail through Dubai Marina on a luxury private yacht
2. Experience the magic of Dubai's skyline at sunset
3. An unforgettable evening cruise along iconic landmarks
4. Premium yacht charter with stunning panoramic views
5. Discover Dubai's coastline in ultimate luxury and comfort`;

    let userPrompt: string;
    let maxTokens: number;
    switch (type) {
      case "slug":
        userPrompt = slugPrompt;
        maxTokens = 200;
        break;
      case "subtitle":
        userPrompt = subtitlePrompt;
        maxTokens = 200;
        break;
      case "long":
        userPrompt = longPrompt;
        maxTokens = 800;
        break;
      default:
        userPrompt = shortPrompt;
        maxTokens = 150;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI generation failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating content:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
