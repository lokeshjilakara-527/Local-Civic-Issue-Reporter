/**
 * routes/profile.js — return the signed-in user's profile (without password).
 */
const express = require('express');
const db = require('../db');
const { requireAuthApi } = require('../middleware/auth');
const router = express.Router();

router.get('/profile-data', requireAuthApi, (req, res) => {
  const user = db.findUserById(req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password, ...safe } = user; // never send the password hash
  res.json(safe);
});

module.exports = router;
