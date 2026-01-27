import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, visitorId, messages } = await req.json();

    if (!message || !conversationId) {
      throw new Error("Missing required fields: message, conversationId");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch context data from database
    const [toursResult, locationsResult, settingsResult] = await Promise.all([
      supabase.from("tours").select("title, price, duration, category, description").eq("status", "active").limit(10),
      supabase.from("locations").select("name, description, address").eq("is_active", true),
      supabase.from("site_settings").select("key, value").in("key", ["contact_phone", "contact_email", "whatsapp_number"]),
    ]);

    const tours = toursResult.data || [];
    const locations = locationsResult.data || [];
    const settings = settingsResult.data || [];

    // Build knowledge context
    const toursInfo = tours.map((t) => `- ${t.title}: ${t.price} AED, ${t.duration}, ${t.category}`).join("\n");
    const locationsInfo = locations.map((l) => `- ${l.name}: ${l.description || "No description"}`).join("\n");
    
    const contactInfo = settings.reduce((acc, s) => {
      acc[s.key] = typeof s.value === "object" ? JSON.stringify(s.value) : s.value;
      return acc;
    }, {} as Record<string, string>);

    // Build conversation history for context
    const conversationHistory = (messages || []).slice(-8).map((m: { sender_type: string; content: string }) => ({
      role: m.sender_type === "visitor" ? "user" : "assistant",
      content: m.content,
    }));

    const systemPrompt = `You are a luxury concierge AI assistant for "Luxury Dhow Escapes" - a premium yacht and dhow cruise company in Dubai.

## Your Personality
- Warm, professional, and helpful
- Knowledgeable about Dubai's waterways and luxury experiences
- Eager to help visitors book unforgettable experiences

## Available Tours & Pricing
${toursInfo || "No tours available at the moment."}

## Locations
${locationsInfo || "Dubai Marina, Burj Khalifa area, and more."}

## Contact Information
- Phone: ${contactInfo.contact_phone || "+971 50 123 4567"}
- Email: ${contactInfo.contact_email || "info@luxurydhowescapes.com"}
- WhatsApp: ${contactInfo.whatsapp_number || "+971 50 123 4567"}

## Your Capabilities
1. Answer questions about dhow cruises, yacht charters, and packages
2. Provide pricing information
3. Explain the booking process
4. Share location and timing details
5. Collect visitor information (name, email, phone, travel date) when they show booking intent

## Guidelines
- Keep responses concise but informative (2-3 sentences typically)
- Be enthusiastic about the experiences
- If asked about specific bookings, encourage them to provide their details
- For complex queries or complaints, suggest connecting with a live agent
- Use emojis sparingly to add warmth (🛥️, ✨, 🌅)
- Always be respectful of visitor's time

## Important
- Don't make up information about tours not listed above
- If unsure, offer to connect them with a human agent
- Never share internal company information or competitors`;

    // Call Lovable AI Gateway
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
          ...conversationHistory,
          { role: "user", content: message },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        // Rate limited - save a fallback message
        const fallbackMessage = "Thank you for your message! Our team will get back to you shortly. In the meantime, feel free to explore our tours or call us directly.";
        
        await supabase.from("chat_messages").insert({
          conversation_id: conversationId,
          sender_type: "bot",
          sender_name: "Luxury Dhow Escapes",
          content: fallbackMessage,
        });

        return new Response(JSON.stringify({ success: true, fallback: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const botContent = aiResponse.choices?.[0]?.message?.content || "I apologize, I couldn't process that. Please try again or contact us directly.";

    // Save bot response to database
    await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      sender_type: "bot",
      sender_name: "Luxury Dhow Escapes",
      content: botContent,
    });

    return new Response(JSON.stringify({ success: true, message: botContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat bot error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
