// backend/src/app.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { createSearchRouter } = require('./routes/search');
const { createFiltersRouter } = require('./routes/filters');

function createApp() {
  const app = express();
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET'],
  }));
  app.use(express.json({ limit: '10kb' }));

  const dbPath = path.join(__dirname, '..', 'db.sqlite');
  const db = new sqlite3.Database(dbPath);

  app.use('/api', createSearchRouter(db));
  app.use('/api', createFiltersRouter(db));

  return app;
}

module.exports = { createApp };
