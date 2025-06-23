-- Migration: Add from_location and to_location to expenses for travel section
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS from_location text;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS to_location text;
