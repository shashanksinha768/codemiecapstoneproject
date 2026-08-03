// backend/src/server.js
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');
const { createApp } = require('./app');

const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, '..', 'db.sqlite');
const DB_DIR = path.join(__dirname, '..', '..', 'database');

function initDb() {
  const db = new Database(DB_PATH);
  const scripts = ['001_init.sql', '002_advanced_filters.sql', 'seed_advanced_filters.sql'];
  for (const script of scripts) {
    try {
      const sql = fs.readFileSync(path.join(DB_DIR, script), 'utf8');
      db.exec(sql);
    } catch (err) {
      if (!err.message.includes('duplicate column') && !err.message.includes('already exists')) {
        console.warn(`[db] ${script}: ${err.message}`);
      }
    }
  }
  db.close();
}

function main() {
  initDb();
  const app = createApp();

  const express = require('express');
  const frontendPath = path.join(__dirname, '..', '..', 'frontend');
  app.use(express.static(frontendPath));
  app.get('/', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));

  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

main();
