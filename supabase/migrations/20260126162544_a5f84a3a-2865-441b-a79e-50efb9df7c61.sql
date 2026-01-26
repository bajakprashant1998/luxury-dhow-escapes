-- Add full_yacht_price column to tours table
ALTER TABLE tours ADD COLUMN full_yacht_price numeric DEFAULT NULL;

-- Add booking_type column to bookings table
ALTER TABLE bookings ADD COLUMN booking_type text DEFAULT 'per_person';