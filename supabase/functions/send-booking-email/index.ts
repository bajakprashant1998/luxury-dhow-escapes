import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  bookingId: string;
  emailType: "confirmation" | "pending" | "cancelled";
}

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  tour_name: string;
  booking_date: string;
  adults: number;
  children: number;
  infants: number;
  total_price: number;
  special_requests: string | null;
  status: string;
}

interface EmailTemplate {
  subject: string;
  body_html: string;
  variables: string[];
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-booking-email function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, emailType }: BookingEmailRequest = await req.json();
    console.log(`Processing ${emailType} email for booking ${bookingId}`);

    if (!bookingId || !emailType) {
      throw new Error("Missing required fields: bookingId and emailType");
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch booking details
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      console.error("Booking not found:", bookingError);
      throw new Error("Booking not found");
    }

    console.log("Booking found:", booking.customer_email);

    // Determine template key based on email type
    const templateKey = `booking_${emailType}`;

    // Fetch email template
    const { data: template, error: templateError } = await supabase
      .from("email_templates")
      .select("subject, body_html, variables")
      .eq("template_key", templateKey)
      .eq("is_active", true)
      .single();

    if (templateError || !template) {
      console.error("Email template not found:", templateError);
      throw new Error(`Email template '${templateKey}' not found`);
    }

    console.log("Template found:", template.subject);

    // Get site settings for branding
    const { data: siteSettings } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["site", "footer"]);

    const settings: Record<string, any> = {};
    siteSettings?.forEach((s) => {
      settings[s.key] = s.value;
    });

    const siteName = settings.site?.siteName || "Luxury Dhow Escapes";
    const contactEmail = settings.site?.contactEmail || "info@luxurydhowescapes.com";
    const contactPhone = settings.site?.contactPhone || "+971 50 123 4567";

    // Format booking date
    const formattedDate = new Date(booking.booking_date).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    // Replace template variables
    const variables: Record<string, string> = {
      customer_name: booking.customer_name,
      customer_email: booking.customer_email,
      customer_phone: booking.customer_phone,
      tour_name: booking.tour_name,
      booking_date: formattedDate,
      adults: String(booking.adults),
      children: String(booking.children),
      infants: String(booking.infants),
      total_price: `AED ${Number(booking.total_price).toLocaleString()}`,
      special_requests: booking.special_requests || "None",
      booking_id: booking.id,
      site_name: siteName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
    };

    let subject = template.subject;
    let bodyHtml = template.body_html;

    // Replace all variables in subject and body
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, "g"), value);
      bodyHtml = bodyHtml.replace(new RegExp(placeholder, "g"), value);
    }

    console.log(`Sending email to ${booking.customer_email}`);

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: `${siteName} <onboarding@resend.dev>`,
      to: [booking.customer_email],
      subject: subject,
      html: bodyHtml,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

    console.log("Email sent successfully:", emailData);

    return new Response(
      JSON.stringify({
        success: true,
        message: `${emailType} email sent successfully`,
        emailId: emailData?.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
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
