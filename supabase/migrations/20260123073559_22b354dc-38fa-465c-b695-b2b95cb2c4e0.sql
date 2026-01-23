-- Create tours table for admin management
CREATE TABLE public.tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text,
  description text,
  long_description text,
  price numeric NOT NULL,
  original_price numeric,
  duration text,
  rating numeric DEFAULT 4.5,
  review_count integer DEFAULT 0,
  image_url text,
  gallery text[],
  highlights text[],
  included text[],
  excluded text[],
  itinerary jsonb,
  faqs jsonb,
  category text NOT NULL,
  capacity text,
  featured boolean DEFAULT false,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

-- Public can view active tours
CREATE POLICY "Anyone can view active tours"
ON public.tours
FOR SELECT
USING (status = 'active');

-- Admins can manage all tours
CREATE POLICY "Admins can manage tours"
ON public.tours
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid REFERENCES public.tours(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
ON public.reviews
FOR SELECT
USING (status = 'approved');

-- Admins can manage all reviews
CREATE POLICY "Admins can manage reviews"
ON public.reviews
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can submit a review
CREATE POLICY "Anyone can submit reviews"
ON public.reviews
FOR INSERT
WITH CHECK (status = 'pending');

-- Create site_settings table for admin configuration
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can view settings
CREATE POLICY "Anyone can view settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Admins can manage settings
CREATE POLICY "Admins can manage settings"
ON public.site_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create gallery table for image management
CREATE TABLE public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  image_url text NOT NULL,
  category text,
  tour_id uuid REFERENCES public.tours(id) ON DELETE SET NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Public can view gallery
CREATE POLICY "Anyone can view gallery"
ON public.gallery
FOR SELECT
USING (true);

-- Admins can manage gallery
CREATE POLICY "Admins can manage gallery"
ON public.gallery
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for tours updated_at
CREATE TRIGGER update_tours_updated_at
  BEFORE UPDATE ON public.tours
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for site_settings updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();