-- Create categories table for tour organization
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'folder',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view active categories
CREATE POLICY "Anyone can view active categories"
ON public.categories
FOR SELECT
USING (is_active = true);

-- Admins can manage all categories
CREATE POLICY "Admins can manage categories"
ON public.categories
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial categories based on existing tour categories
INSERT INTO public.categories (name, slug, description, icon, sort_order) VALUES
  ('Dhow Cruises', 'dhow', 'Traditional Arabian dhow boat experiences', 'ship', 1),
  ('Shared Yacht Tours', 'yacht-shared', 'Affordable shared yacht experiences', 'users', 2),
  ('Megayacht Experiences', 'megayacht', 'Luxury megayacht dining and cruises', 'crown', 3),
  ('Private Yacht Charters', 'yacht-private', 'Exclusive private yacht rentals', 'anchor', 4);