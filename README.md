# Travel Accommodation Search - Capstone Project

Advanced search filters for travel accommodation (amenities, property type, review score).

Jira Epic: EPMCDMETST-55964

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js + Express
- **Database:** SQLite

## Setup

### 1. Database

```bash
sqlite3 backend/db.sqlite < database/002_advanced_filters.sql
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

### GET /api/amenities

Returns list of available amenities for the filter UI.

## How to Run Tests

```bash
cd tests
npm install
npx playwright test
```

## Documentation

- [Implementation Plan](implementation-plan.md)
- Confluence Space: SC
