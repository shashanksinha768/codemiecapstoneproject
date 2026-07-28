-- 001_init.sql
-- Base schema: accommodations table with sample data.

CREATE TABLE IF NOT EXISTS accommodations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  price_per_night REAL NOT NULL,
  max_passengers INTEGER NOT NULL
);

INSERT OR IGNORE INTO accommodations(id, name, destination, price_per_night, max_passengers)
VALUES
  (1, 'The Grand Hotel',    'Paris',     180.0, 2),
  (2, 'Sea View Villa',     'Maldives',  450.0, 6),
  (3, 'City Hostel Berlin', 'Berlin',     35.0, 1),
  (4, 'Mountain Apartment', 'Zurich',    120.0, 4),
  (5, 'Beach Hotel Bali',   'Bali',      200.0, 2);
