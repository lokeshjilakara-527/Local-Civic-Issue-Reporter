const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], issues: [], contacts: [] }, null, 2));
  }
}
function read() { ensure(); return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
function write(data) { ensure(); fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

/* ---- Users ---- */
function findUserByUsername(username) { return read().users.find((u) => u.username === username); }
function findUserByEmail(email) { return read().users.find((u) => u.email === email); }
function findUserById(id) { return read().users.find((u) => u._id === id); }
function addUser({ username, email, password }) {
  const d = read();
  const rec = { _id: uid(), username, email, password, createdAt: new Date().toISOString() };
  d.users.push(rec); write(d); return rec;
}

/* ---- Issues ---- */
function addIssue(issue) {
  const d = read();
  const rec = { _id: uid(), status: 'Pending', createdAt: new Date().toISOString(), ...issue };
  d.issues.push(rec); write(d); return rec;
}
function getIssues() {
  return read().issues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
function getIssuesByUser(userId) { return getIssues().filter((i) => i.userId === userId); }

/* ---- Contacts ---- */
function addContact(contact) {
  const d = read();
  const rec = { _id: uid(), createdAt: new Date().toISOString(), ...contact };
  d.contacts.push(rec); write(d); return rec;
}

/* ---- Seed a couple of sample issues on first run (so View Issues isn't empty) ---- */
function seedIfEmpty() {
  const d = read();
  if (d.issues.length === 0) {
    d.issues.push(
      {
        _id: uid(), userId: 'seed', username: 'Public Works Dept.',
        title: 'Pothole on NH-16 service road', category: 'Road/Infrastructure',
        description: 'Large pothole near the bus stop causing traffic and accidents during peak hours.',
        location: 'Benz Circle, Vijayawada', status: 'In-Progress', image: null,
        createdAt: new Date(Date.now() - 2 * 864e5).toISOString(),
      },
      {
        _id: uid(), userId: 'seed', username: 'Sanitation Wing',
        title: 'Overflowing garbage bin', category: 'Waste Management',
        description: 'Community bin overflowing for several days near the market area.',
        location: 'Auto Nagar, Guntur', status: 'Resolved', image: null,
        createdAt: new Date(Date.now() - 5 * 864e5).toISOString(),
      }
    );
    write(d);
  }
}

module.exports = {
  findUserByUsername, findUserByEmail, findUserById, addUser,
  addIssue, getIssues, getIssuesByUser,
  addContact, seedIfEmpty,
};
