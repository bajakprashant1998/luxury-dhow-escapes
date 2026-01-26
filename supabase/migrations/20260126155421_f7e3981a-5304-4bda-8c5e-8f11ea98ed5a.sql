-- Add pricing_type column to tours table
ALTER TABLE tours ADD COLUMN pricing_type text DEFAULT 'per_person';