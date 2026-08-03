-- seed_advanced_filters.sql
-- Sample seeding for property_type/review_score + amenity mapping + price_per_night.

PRAGMA foreign_keys = ON;

UPDATE accommodations SET property_type = 'hotel', review_score = 8.6, price_per_night = 120 WHERE id = 1;
UPDATE accommodations SET property_type = 'villa', review_score = 9.1, price_per_night = 250 WHERE id = 2;

INSERT OR IGNORE INTO accommodation_amenities(accommodation_id, amenity_id)
SELECT 1, id FROM amenities WHERE code IN ('FREE_WIFI','BREAKFAST_INCLUDED');

INSERT OR IGNORE INTO accommodation_amenities(accommodation_id, amenity_id)
SELECT 2, id FROM amenities WHERE code IN ('FREE_WIFI');
