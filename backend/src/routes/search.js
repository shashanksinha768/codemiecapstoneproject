// backend/src/routes/search.js
const express = require('express');
const { buildSearchQuery } = require('../services/searchService');

function createSearchRouter(db) {
  const router = express.Router();

  // GET /api/search
  // Params: destination, amenities, propertyTypes, minReviewScore
  router.get('/search', (req, res) => {
    const { sql, params } = buildSearchQuery(req.query);
    db.all(sql, params, (err, rows) => {
      if (err) return res.status(500).json({ error: 'Search failed' });
      return res.json({ results: rows });
    });
  });

  return router;
}

module.exports = { createSearchRouter };
