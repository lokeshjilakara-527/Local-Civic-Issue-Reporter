/**
 * middleware/auth.js — route guards.
 *   requireAuthPage : protect HTML pages → redirect to login if not signed in
 *   requireAuthApi  : protect JSON APIs  → 401 if not signed in
 */
function requireAuthPage(req, res, next) {
  if (!req.session.userId) return res.redirect('/login.html');
  next();
}
function requireAuthApi(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
  next();
}
module.exports = { requireAuthPage, requireAuthApi };
