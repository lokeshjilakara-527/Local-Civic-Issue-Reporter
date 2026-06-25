/**
 * routes/auth.js — signup, login, logout.
 * Passwords are HASHED with bcrypt (never stored in plain text).
 * Forms post normally; on error we redirect back with ?error= so the page
 * can show a friendly message.
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

// POST /signup
router.post('/signup', async (req, res) => {
  try {
    const username = (req.body.username || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    console.log("Signup Attempt:", username, email);

    if (!username || !email || !password)
      return res.redirect('/signup.html?error=missing');

    if (db.findUserByUsername(username))
      return res.redirect('/signup.html?error=username');

    if (db.findUserByEmail(email))
      return res.redirect('/signup.html?error=email');

    const hash = await bcrypt.hash(password, 10);

    console.log("Saving user...");

    db.addUser({ username, email, password: hash });

    console.log("User saved successfully");

    res.redirect('/login.html?registered=1');
  } catch (e) {
    console.error("Signup error:", e);
    res.redirect('/signup.html?error=server');
  }
});
// POST /login
router.post('/login', async (req, res) => {
  try {
    const username = (req.body.username || '').trim();
    const password = req.body.password || '';
    if (!username || !password) return res.redirect('/login.html?error=missing');

    const user = db.findUserByUsername(username);
    console.log("All users:", require('../db').findUserByUsername(username));
console.log("Entered Username:", username);
console.log("User Found:", user);

if (!user) return res.redirect('/login.html?error=invalid');

const ok = await bcrypt.compare(password, user.password);

console.log("Password Match:", ok);

if (!ok) return res.redirect('/login.html?error=invalid');

    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect('/main.html');
  } catch (e) {
    console.error('Login error:', e);
    res.redirect('/login.html?error=server');
  }
});

// GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/index.html'));
});

module.exports = router;
