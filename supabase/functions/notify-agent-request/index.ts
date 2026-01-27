import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotifyRequest {
  conversationId: string;
  visitorName?: string;
  visitorEmail?: string;
  currentPage?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("notify-agent-request function invoked");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversationId, visitorName, visitorEmail, currentPage }: NotifyRequest = await req.json();
    console.log(`Processing agent request notification for conversation ${conversationId}`);

    if (!conversationId) {
      throw new Error("Missing required field: conversationId");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch conversation details with recent messages
    const [conversationRes, messagesRes] = await Promise.all([
      supabase
        .from("chat_conversations")
        .select("*")
        .eq("id", conversationId)
        .single(),
      supabase
        .from("chat_messages")
        .select("content, sender_type, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    const conversation = conversationRes.data;
    const recentMessages = messagesRes.data || [];

    // Fetch admin emails from profiles of users with admin role
    const { data: adminRoles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (!adminRoles || adminRoles.length === 0) {
      console.log("No admins found to notify");
      return new Response(
        JSON.stringify({ success: true, message: "No admins to notify" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get admin emails from auth.users
    const adminUserIds = adminRoles.map((r) => r.user_id);
    const { data: adminUsers } = await supabase.auth.admin.listUsers();
    
    const adminEmails = adminUsers?.users
      ?.filter((u) => adminUserIds.includes(u.id))
      ?.map((u) => u.email)
      ?.filter(Boolean) as string[];

    if (!adminEmails || adminEmails.length === 0) {
      console.log("No admin emails found");
      return new Response(
        JSON.stringify({ success: true, message: "No admin emails found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get site settings
    const { data: siteSettings } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["site"]);

    const settings: Record<string, any> = {};
    siteSettings?.forEach((s) => {
      settings[s.key] = s.value;
    });

    const siteName = settings.site?.siteName || "Luxury Dhow Escapes";
    const siteUrl = Deno.env.get("SUPABASE_URL")?.replace(".supabase.co", "") || "";

    // Build message preview
    const messagePreview = recentMessages
      .reverse()
      .map((m) => `${m.sender_type === "visitor" ? "Visitor" : "Bot"}: ${m.content}`)
      .join("\n");

    const visitorInfo = [
      visitorName || conversation?.visitor_name ? `Name: ${visitorName || conversation?.visitor_name}` : null,
      visitorEmail || conversation?.visitor_email ? `Email: ${visitorEmail || conversation?.visitor_email}` : null,
      currentPage || conversation?.current_page ? `Page: ${currentPage || conversation?.current_page}` : null,
    ].filter(Boolean).join("\n");

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Live Support Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1f2e 0%, #0f172a 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.15);">
      
      <!-- Header -->
      <div style="padding: 32px; text-align: center; border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
        <div style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); padding: 12px 24px; border-radius: 8px; margin-bottom: 16px;">
          <span style="font-size: 24px;">🔔</span>
        </div>
        <h1 style="color: #d4af37; margin: 0; font-size: 24px; font-weight: 600;">
          Live Support Requested
        </h1>
        <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 14px;">
          A visitor is waiting for assistance
        </p>
      </div>

      <!-- Content -->
      <div style="padding: 32px;">
        ${visitorInfo ? `
        <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="color: #d4af37; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
            Visitor Information
          </h3>
          <pre style="color: #e2e8f0; margin: 0; font-family: inherit; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${visitorInfo}</pre>
        </div>
        ` : ''}

        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="color: #94a3b8; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
            Recent Conversation
          </h3>
          <pre style="color: #e2e8f0; margin: 0; font-family: inherit; white-space: pre-wrap; font-size: 14px; line-height: 1.8;">${messagePreview || "No messages yet"}</pre>
        </div>

        <a href="${siteUrl}/admin/live-chat" 
           style="display: block; background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%); color: #0f172a; text-align: center; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Open Live Chat Dashboard →
        </a>
      </div>

      <!-- Footer -->
      <div style="padding: 24px 32px; background: rgba(0,0,0,0.2); text-align: center;">
        <p style="color: #64748b; margin: 0; font-size: 12px;">
          This is an automated notification from ${siteName}
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    console.log(`Sending notification to ${adminEmails.length} admin(s)`);

    // Send email to all admins
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: `${siteName} <onboarding@resend.dev>`,
      to: adminEmails,
      subject: `🔔 Live Support Request - ${visitorName || "Visitor"} needs assistance`,
      html: emailHtml,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

    console.log("Notification sent successfully:", emailData);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Notification sent to ${adminEmails.length} admin(s)`,
        emailId: emailData?.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in notify-agent-request function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
