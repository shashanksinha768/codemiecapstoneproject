# Travel Accommodation Search - Capstone Project

Advanced search filters for travel accommodation (amenities, property type, review score, price range).

Jira Epic: EPMCDMETST-55964

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js + Express
- **Database:** SQLite

## Setup

### 1. Database

```bash
sqlite3 backend/db.sqlite < database/002_advanced_filters.sql
sqlite3 backend/db.sqlite < database/003_price_range_filter.sql
sqlite3 backend/db.sqlite < database/seed_advanced_filters.sql
```

### 2. Backend

```bash
cd backend
npm install
node src/server.js
```

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

## API

### GET /api/search

Search accommodations with optional advanced filters.

| Param | Type | Description |
|---|---|---|
| destination | string | Destination name (partial match) |
| amenities | string | CSV of amenity codes e.g. `FREE_WIFI,BREAKFAST_INCLUDED` |
| propertyTypes | string | CSV of types e.g. `hotel,villa` |
| minReviewScore | number | Minimum review score e.g. `8` |
| minPrice | number | Minimum price per night (non-negative) e.g. `100` |
| maxPrice | number | Maximum price per night (non-negative) e.g. `250` |

**Notes**

- When both `minPrice` and `maxPrice` are provided, `minPrice` must be `<= maxPrice`.
- Prices are matched against `accommodations.price_per_night`.

### GET /api/amenities

Returns list of available amenities for the filter UI.

## Frontend

The price range filter UI is implemented as a new component:

- `frontend/src/components/filters/PriceRangeFilter.jsx`

It is composed into the advanced filters sidebar via:

- `frontend/src/components/filters/AdvancedFiltersPanel.jsx`

## How to Run Tests

```bash
cd tests
npm install
npx playwright test
```

## Documentation

- [Implementation Plan](implementation-plan.md)
- Confluence Space: SC

### Price Range Filter design docs
- Architecture Overview: https://shashanksinha768.atlassian.net/wiki/spaces/SC/pages/9699329/Architecture+Overview+-+Price+Range+Filter
- HLD: https://shashanksinha768.atlassian.net/wiki/spaces/SC/pages/9732097/High-Level+Design+HLD+-+Price+Range+Filter
- LLD: https://shashanksinha768.atlassian.net/wiki/spaces/SC/pages/9764865/Low-Level+Design+LLD+-+Price+Range+Filter
- Wireframes: https://shashanksinha768.atlassian.net/wiki/spaces/SC/pages/9797633/Wireframes+-+Price+Range+Filter
