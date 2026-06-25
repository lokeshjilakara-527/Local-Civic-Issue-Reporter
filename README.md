# Civic Issue Reporter — Government-style Portal (with backend)

A citizen grievance portal styled like a Government of Andhra Pradesh service,
with a working **Node.js + Express** backend. Built as an academic project.

> This is a demonstration / student project and is **not** an official
> Government of Andhra Pradesh website.

## Features

- Government-style UI: tricolor band, navy/saffron theme, emblem, accessibility
  text-resizer (A- A A+), responsive nav, official footer.
- **Sign up / Login** with **bcrypt-hashed passwords** and sessions.
- **Report an issue** with photo upload (Multer).
- **View issues** (public list) and per-user issues.
- **Profile** and **Contact** pages.
- **Zero database setup** — data is stored in `data/db.json`, so it runs
  anywhere with no MongoDB/Atlas. (Swap `db.js` to use MongoDB later if needed.)

## Run it

```bash
npm install
npm start        # → http://localhost:3000
```

Open <http://localhost:3000>. Sign up, log in, report an issue, and view it.
Sample issues are seeded automatically on first run.

For auto-reload during development: `npm run dev` (uses nodemon).

## Project structure

```
civic-gov/
├── server.js              # Express app: sessions, static, uploads, routes
├── db.js                  # JSON-file datastore (no external DB)
├── build_pages.js         # generates the 8 public/*.html from one shell
├── middleware/auth.js     # requireAuthPage / requireAuthApi guards
├── routes/
│   ├── auth.js            # signup / login (bcrypt) / logout
│   ├── issues.js          # report-issue (upload) / issues / my-issues
│   ├── profile.js         # profile-data
│   └── contact.js         # contact
├── public/
│   ├── css/gov.css        # the government design system
│   ├── js/gov.js          # menu, text-resizer, flash messages
│   ├── uploads/           # uploaded issue photos
│   ├── index.html  login.html  signup.html  main.html
│   ├── report.html  view-issues.html  profile.html  contact.html
└── data/db.json           # created on first run (git-ignored)
```

## Editing the look

The header, footer and emblem are defined once in **`build_pages.js`**. Edit
there, then run `node build_pages.js` to regenerate all pages consistently.
Colours and components live in **`public/css/gov.css`**.

## Notes / next steps

- The footer phone, email and social links are placeholders — replace them.
- To move to MongoDB: keep the route files and rewrite only `db.js` to use the
  Mongo driver (the function names already match a data layer).
- For production: set a real `SESSION_SECRET` env var and serve over HTTPS.
