-- Fix RLS policy for bookings: allow authenticated users to create bookings with their user_id OR guest bookings
-- Drop the restrictive policies first
DROP POLICY IF EXISTS "Anyone can create guest bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;

-- Create a single permissive policy that allows:
-- 1. Authenticated users to create bookings (linking their user_id)
-- 2. Anyone (including guests) to create bookings without user_id
CREATE POLICY "Authenticated users can create bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Guests can create bookings"
ON public.bookings
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);