/**
 * server.js — Civic Issue Reporter backend (Express).
 * Run:  npm install  &&  npm start    →  http://localhost:3000
 */
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const db = require('./db');
const { requireAuthPage } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');

/* ---------- Core middleware ---------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'civic-reporter-dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);

/* ---------- File uploads (issue photos) ---------- */
const uploadDir = path.join(PUBLIC, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB

/* ---------- Protected HTML pages (must be signed in) ----------
   Declared BEFORE express.static so the guard runs first.        */
['main', 'profile', 'report', 'view-issues'].forEach((page) => {
  app.get(`/${page}.html`, requireAuthPage, (req, res) =>
    res.sendFile(path.join(PUBLIC, `${page}.html`))
  );
});

/* ---------- Static assets ---------- */
app.use(express.static(PUBLIC));

/* ---------- Routes ---------- */
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/issues')(upload));
app.use('/', require('./routes/profile'));
app.use('/', require('./routes/contact'));

// Expose the signed-in user's name to the front-end (for the navbar greeting)
app.get('/session-info', (req, res) =>
  res.json({ loggedIn: !!req.session.userId, username: req.session.username || null })
);

app.get('/', (req, res) => res.sendFile(path.join(PUBLIC, 'index.html')));

/* ---------- Start ---------- */
db.seedIfEmpty();
app.listen(PORT, () => {
  console.log(`✅ Civic Issue Reporter running → http://localhost:${PORT}`);
  console.log(`   Data is stored in ./data/db.json (no external database needed).`);
});

module.exports = app;
