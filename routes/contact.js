/**
 * routes/contact.js — store a contact / help message.
 */
const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.redirect('/contact.html?error=missing');
  db.addContact({ name, email, message });
  res.redirect('/contact.html?sent=1');
});

module.exports = router;
