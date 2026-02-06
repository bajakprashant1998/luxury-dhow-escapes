-- Allow admins to insert/create ANY booking
CREATE POLICY "Admins can create bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow authenticated users to create guest bookings (where user_id is null)
-- This covers cases where a logged-in user wants to make a booking on behalf of someone else
-- or if the client fails to send user_id
CREATE POLICY "Authenticated users can create guest bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (user_id IS NULL);
