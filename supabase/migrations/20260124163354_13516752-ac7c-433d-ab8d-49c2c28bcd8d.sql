-- Create discounts table for coupon/promo code management
CREATE TABLE public.discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value numeric NOT NULL CHECK (value > 0),
  min_order_amount numeric DEFAULT 0,
  max_uses integer DEFAULT NULL,
  used_count integer DEFAULT 0,
  starts_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT NULL,
  is_active boolean DEFAULT true,
  applicable_tour_ids uuid[] DEFAULT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage discounts"
ON public.discounts
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active valid discounts"
ON public.discounts
FOR SELECT
USING (
  is_active = true 
  AND (expires_at IS NULL OR expires_at > now())
  AND (starts_at IS NULL OR starts_at <= now())
);

-- Trigger for updated_at
CREATE TRIGGER update_discounts_updated_at
  BEFORE UPDATE ON public.discounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create email_templates table
CREATE TABLE public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text UNIQUE NOT NULL,
  name text NOT NULL,
  subject text NOT NULL,
  body_html text NOT NULL,
  body_text text,
  variables text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage email templates"
ON public.email_templates
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active templates"
ON public.email_templates
FOR SELECT
USING (is_active = true);

-- Trigger for updated_at
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default email templates
INSERT INTO public.email_templates (template_key, name, subject, body_html, body_text, variables) VALUES
('booking_confirmation', 'Booking Confirmation', 'Your booking for {{tour_name}} is confirmed!', 
'<h1>Booking Confirmed!</h1><p>Dear {{customer_name}},</p><p>Your booking for <strong>{{tour_name}}</strong> on {{booking_date}} has been confirmed.</p><p>Total: AED {{total_price}}</p><p>Thank you for choosing us!</p>', 
'Booking Confirmed! Dear {{customer_name}}, Your booking for {{tour_name}} on {{booking_date}} has been confirmed. Total: AED {{total_price}}. Thank you for choosing us!',
ARRAY['customer_name', 'tour_name', 'booking_date', 'total_price', 'adults', 'children']),

('booking_pending', 'Booking Received', 'We received your booking request for {{tour_name}}',
'<h1>Booking Received</h1><p>Dear {{customer_name}},</p><p>We have received your booking request for <strong>{{tour_name}}</strong> on {{booking_date}}.</p><p>Our team will review and confirm your booking shortly.</p>',
'Booking Received. Dear {{customer_name}}, We have received your booking request for {{tour_name}} on {{booking_date}}. Our team will review and confirm your booking shortly.',
ARRAY['customer_name', 'tour_name', 'booking_date', 'total_price']),

('inquiry_received', 'Inquiry Auto-Reply', 'Thank you for your inquiry',
'<h1>Thank You!</h1><p>Dear {{customer_name}},</p><p>We have received your inquiry and will respond within 24 hours.</p><p>Your message: {{message}}</p>',
'Thank You! Dear {{customer_name}}, We have received your inquiry and will respond within 24 hours.',
ARRAY['customer_name', 'email', 'message', 'subject']);