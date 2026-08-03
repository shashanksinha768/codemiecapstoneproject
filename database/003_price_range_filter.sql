-- 003_price_range_filter.sql
-- Adds price_per_night column to accommodations to support the Price Range Filter.

PRAGMA foreign_keys = ON;

-- Run once on a fresh DB. If the column already exists, SQLite will error — that is expected and safe to ignore.
ALTER TABLE accommodations ADD COLUMN price_per_night REAL CHECK(price_per_night IS NULL OR price_per_night >= 0);

-- Improves performance for price range queries.
CREATE INDEX IF NOT EXISTS idx_accommodations_price_per_night ON accommodations(price_per_night);
