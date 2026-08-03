// backend/src/routes/search.js
const express = require('express');
const { buildSearchQuery, validateFilters } = require('../services/searchService');

/**
 * createSearchRouter creates the search API router.
 *
 * @param {object} db - SQLite database connection wrapper.
 * @returns {import('express').Router} Express router.
 */
function createSearchRouter(db) {
  const router = express.Router();

  // GET /api/search
  // Params: destination, amenities, propertyTypes, minReviewScore, minPrice, maxPrice
  router.get('/search', (req, res) => {
    const errors = validateFilters(req.query);
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
      const { sql, params } = buildSearchQuery(req.query);
      const rows = db.prepare(sql).all(...params);
      return res.json({ results: rows });
    } catch (err) {
      return res.status(500).json({ error: 'Search failed', detail: err.message });
    }
  });

  return router;
}

module.exports = { createSearchRouter };
