// backend/src/routes/filters.js
const express = require('express');

function createFiltersRouter(db) {
  const router = express.Router();

  router.get('/amenities', (req, res) => {
    try {
      const rows = db.prepare('SELECT code, name FROM amenities ORDER BY name ASC').all();
      return res.json({ amenities: rows });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch amenities' });
    }
  });

  return router;
}

module.exports = { createFiltersRouter };
