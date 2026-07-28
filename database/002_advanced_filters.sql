-- 002_advanced_filters.sql
-- Adds property_type, review_score and normalized amenities tables.

PRAGMA foreign_keys = ON;

-- Run once on a fresh DB. If columns already exist, SQLite will error — that is expected and safe to ignore.
ALTER TABLE accommodations ADD COLUMN property_type TEXT CHECK(property_type IN ('hotel','villa','apartment','hostel'));
ALTER TABLE accommodations ADD COLUMN review_score REAL CHECK(review_score IS NULL OR (review_score >= 0 AND review_score <= 10));

CREATE TABLE IF NOT EXISTS amenities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS accommodation_amenities (
  accommodation_id INTEGER NOT NULL,
  amenity_id INTEGER NOT NULL,
  PRIMARY KEY (accommodation_id, amenity_id),
  FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE,
  FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_accommodations_property_type ON accommodations(property_type);
CREATE INDEX IF NOT EXISTS idx_accommodations_review_score ON accommodations(review_score);
CREATE INDEX IF NOT EXISTS idx_acc_amenities_accommodation_id ON accommodation_amenities(accommodation_id);
CREATE INDEX IF NOT EXISTS idx_acc_amenities_amenity_id ON accommodation_amenities(amenity_id);

INSERT OR IGNORE INTO amenities(code, name) VALUES ('FREE_WIFI', 'Free Wi-Fi');
INSERT OR IGNORE INTO amenities(code, name) VALUES ('BREAKFAST_INCLUDED', 'Breakfast included');
