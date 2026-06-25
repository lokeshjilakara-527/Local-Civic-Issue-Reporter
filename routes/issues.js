/**
 * routes/issues.js — report a new issue (with optional image) and list issues.
 */
const express = require('express');
const db = require('../db');
const { requireAuthApi } = require('../middleware/auth');

module.exports = function (upload) {
  const router = express.Router();

  // POST /report-issue  (logged-in users only)
  router.post('/report-issue', upload.single('image'), (req, res) => {
    if (!req.session.userId) return res.redirect('/login.html?error=login');

    const { title, description, location, category } = req.body;
    if (!title || !description || !location) return res.redirect('/report.html?error=missing');

    db.addIssue({
      userId: req.session.userId,
      username: req.session.username,
      title,
      category: category || 'General',
      description,
      location,
      image: req.file ? req.file.filename : null,
    });
    res.redirect('/view-issues.html?reported=1');
  });

  // GET /issues  (public list)
  router.get('/issues', (req, res) => {
    try { res.json(db.getIssues()); }
    catch (e) { res.status(500).json({ error: 'Failed to fetch issues' }); }
  });

  // GET /my-issues  (current user's issues)
  router.get('/my-issues', requireAuthApi, (req, res) => {
    try { res.json(db.getIssuesByUser(req.session.userId)); }
    catch (e) { res.status(500).json({ error: 'Failed to fetch issues' }); }
  });

  return router;
};
