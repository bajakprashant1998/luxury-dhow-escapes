import { supabase } from "@/integrations/supabase/client";

type EmailType = "confirmation" | "pending" | "cancelled";

interface SendBookingEmailResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function sendBookingEmail(
  bookingId: string,
  emailType: EmailType
): Promise<SendBookingEmailResult> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "send-booking-email",
      {
        body: { bookingId, emailType },
      }
    );

    if (error) {
      console.error("Error calling send-booking-email:", error);
      return { success: false, error: error.message };
    }

    return data as SendBookingEmailResult;
  } catch (err: any) {
    console.error("Error sending booking email:", err);
    return { success: false, error: err.message };
  }
}
