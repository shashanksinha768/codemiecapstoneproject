// backend/src/routes/filters.js
const express = require('express');

function createFiltersRouter(db) {
  const router = express.Router();

  router.get('/amenities', (req, res) => {
    db.all('SELECT code, name FROM amenities ORDER BY name ASC', [], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch amenities' });
      return res.json({ amenities: rows });
    });
  });

  return router;
}

module.exports = { createFiltersRouter };
