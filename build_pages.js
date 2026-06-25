/* Generates the 8 public/*.html pages with a consistent gov-style shell. */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'public');

/* ---------- Emblem (original seal — not the protected State Emblem) ---------- */
function emblem() {
  let spokes = '';
  for (let i = 0; i < 16; i++) {
    const a = (i * 22.5 * Math.PI) / 180;
    const x1 = 50 + 9 * Math.cos(a), y1 = 50 + 9 * Math.sin(a);
    const x2 = 50 + 29 * Math.cos(a), y2 = 50 + 29 * Math.sin(a);
    spokes += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }
  return `<svg class="emblem" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Civic Issue Reporter emblem">
  <defs><path id="seal" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"/></defs>
  <circle cx="50" cy="50" r="48" fill="#0b2545" stroke="#ff9933" stroke-width="3"/>
  <text font-size="6.4" font-weight="700" letter-spacing="1.6" fill="#ff9933"><textPath href="#seal" startOffset="2%">★ CIVIC ISSUE REPORTER ★ ANDHRA PRADESH</textPath></text>
  <circle cx="50" cy="50" r="30" fill="none" stroke="#ffffff" stroke-width="1.4"/>
  <g stroke="#ffffff" stroke-width="1.3">${spokes}</g>
  <circle cx="50" cy="50" r="6" fill="#ff9933"/>
</svg>`;
}

/* ---------- Head ---------- */
function head(title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title} | Civic Issue Reporter</title>
<meta name="description" content="Civic Issue Reporter — citizen grievance portal for reporting and tracking local civic issues (academic project)." />
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%230b2545'/><circle cx='50' cy='50' r='6' fill='%23ff9933'/></svg>" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700&family=Noto+Sans+Telugu:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="css/gov.css">
</head>`;
}

/* ---------- Header (variant: 'public' or 'auth') ---------- */
function header(active, variant) {
  const links = variant === 'auth'
    ? [['main.html', 'Dashboard'], ['report.html', 'Report an Issue'], ['view-issues.html', 'View Issues'],
       ['profile.html', 'Profile'], ['contact.html', 'Contact & Help'], ['/logout', 'Logout', 'cta']]
    : [['index.html', 'Home'], ['login.html', 'Report a Grievance'], ['view-issues.html', 'Public Issues'],
       ['contact.html', 'Contact'], ['login.html', 'Login', 'cta']];

  const items = links.map(([href, label, cta]) => {
    const cls = (cta ? 'nav-cta' : '') + (href === active ? ' active' : '');
    return `<li><a class="${cls.trim()}" href="${href}">${label}</a></li>`;
  }).join('\n        ');

  return `<body>
<a class="skip-link" href="#main">Skip to main content</a>
<div class="tricolor"></div>
<div class="topbar"><div class="wrap">
  <span class="gov-tag"><i class="fas fa-landmark"></i> Government of Andhra Pradesh — Citizen Services (Demo)</span>
  <span class="topbar-tools">
    <span style="margin-right:6px">Text size</span>
    <button class="ts" data-size="dec" aria-label="Decrease text size">A-</button>
    <button class="ts" data-size="reset" aria-label="Reset text size">A</button>
    <button class="ts" data-size="inc" aria-label="Increase text size">A+</button>
  </span>
</div></div>
<header class="masthead"><div class="wrap masthead-row">
  <a class="brand" href="${variant === 'auth' ? 'main.html' : 'index.html'}">
    ${emblem()}
    <span class="brand-text">
      <strong>Civic Issue Reporter</strong>
      <span class="brand-sub te">ఆంధ్రప్రదేశ్ ప్రభుత్వం · Government of Andhra Pradesh</span>
    </span>
  </a>
  <div class="helpline">Toll-Free Helpline <strong>1800-425-0000</strong></div>
</div></header>
<nav class="mainnav"><div class="wrap">
  <button class="hamburger" id="hamburger" aria-label="Toggle menu"><i class="fas fa-bars"></i></button>
  <ul class="navlinks" id="navLinks">
        ${items}
  </ul>
</div></nav>`;
}

/* ---------- Breadcrumb ---------- */
function crumb(here) {
  return `<div class="breadcrumb"><div class="wrap"><a href="main.html">Home</a> <span>/ ${here}</span></div></div>`;
}

/* ---------- Footer ---------- */
function footer() {
  return `<footer class="site-footer">
  <div class="wrap foot-cols">
    <div>
      <h4>Civic Issue Reporter</h4>
      <p>A citizen grievance redressal portal to report and track local civic issues such as roads, water, electricity and sanitation.</p>
    </div>
    <div>
      <h4>Quick Links</h4>
      <ul>
        <li><a href="main.html">Dashboard</a></li>
        <li><a href="report.html">Report an Issue</a></li>
        <li><a href="view-issues.html">View Issues</a></li>
        <li><a href="contact.html">Contact &amp; Help</a></li>
      </ul>
    </div>
    <div>
      <h4>Contact</h4>
      <p><i class="fas fa-phone"></i> 1800-425-0000<br>
      <i class="fas fa-envelope"></i> support@civicreport.ap.gov.in<br>
      <i class="fas fa-location-dot"></i> Velagapudi, Amaravati, A.P.</p>
    </div>
    <div>
      <h4>Connect</h4>
      <div class="foot-social">
        <a href="#" aria-label="Twitter / X"><i class="fab fa-x-twitter"></i></a>
        <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
        <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
      </div>
    </div>
  </div>
  <div class="foot-bar"><div class="wrap">
    <span>© <span class="yr"></span> Civic Issue Reporter · Designed &amp; Developed by <strong>Lokesh Jilakara</strong></span>
    <span class="disclaimer">Academic / demonstration project — not an official Government of Andhra Pradesh website.</span>
  </div></div>
</footer>
<script>document.querySelectorAll('.yr').forEach(function(e){e.textContent=new Date().getFullYear();});</script>
<script src="js/gov.js"></script>
</body>
</html>`;
}

/* ===================================================================
   PAGE CONTENTS
   =================================================================== */
const pages = {};

/* ---- index (landing) ---- */
pages['index.html'] = head('Home') + header('index.html', 'public') + `
<main id="main">
  <section class="hero"><div class="wrap">
    <h1>Report. Track. Resolve.</h1>
    <p>A single window for citizens of Andhra Pradesh to raise local civic issues — roads, water, electricity, sanitation and more — and follow them to resolution.</p>
    <a class="btn btn-accent" href="login.html">Report a Grievance</a>
    <a class="btn btn-outline" href="signup.html">Create Account</a>
  </div></section>

  <section class="stats"><div class="wrap">
    <div><div class="num">12,480+</div><div class="lbl">Issues Reported</div></div>
    <div><div class="num">9,360+</div><div class="lbl">Resolved</div></div>
    <div><div class="num">26</div><div class="lbl">Districts Covered</div></div>
    <div><div class="num">48 hrs</div><div class="lbl">Avg. Response</div></div>
  </div></section>

  <section class="section"><div class="wrap">
    <div class="section-head"><h2>What you can report</h2><p>Choose a category and submit your grievance with details and a photo.</p></div>
    <div class="card-grid">
      <div class="card"><div class="ico">🛣️</div><h3>Roads &amp; Infrastructure</h3><p>Potholes, damaged footpaths and broken structures.</p></div>
      <div class="card"><div class="ico">💧</div><h3>Water Supply</h3><p>Leakages, shortages and drainage problems.</p></div>
      <div class="card"><div class="ico">💡</div><h3>Electricity &amp; Lighting</h3><p>Power faults and non-working street lights.</p></div>
      <div class="card"><div class="ico">🗑️</div><h3>Sanitation &amp; Waste</h3><p>Garbage collection and public cleanliness.</p></div>
    </div>
  </div></section>

  <section class="section" style="background:#fff"><div class="wrap">
    <div class="section-head"><h2>How it works</h2></div>
    <div class="card-grid">
      <div class="card"><div class="ico">📝</div><h3>1. Register</h3><p>Create a free citizen account in seconds.</p></div>
      <div class="card"><div class="ico">📤</div><h3>2. Submit</h3><p>Describe the issue, add a location and a photo.</p></div>
      <div class="card"><div class="ico">📋</div><h3>3. Track</h3><p>Watch the status move from Pending to Resolved.</p></div>
    </div>
  </div></section>
</main>` + footer();

/* ---- login ---- */
pages['login.html'] = head('Login') + header('login.html', 'public') + `
<main id="main" class="page"><div class="wrap">
  <div class="panel narrow">
    <h2>Citizen Login</h2>
    <div class="flash" id="flash"></div>
    <form action="/login" method="POST">
      <div class="field"><label>Username <span class="req">*</span></label><input type="text" name="username" placeholder="Enter your username" required></div>
      <div class="field"><label>Password <span class="req">*</span></label><input type="password" name="password" placeholder="Enter your password" required></div>
      <button class="btn" type="submit" style="width:100%">Login</button>
    </form>
    <p class="alt">Don't have an account? <a href="signup.html">Create one</a></p>
  </div>
</div></main>` + footer();

/* ---- signup ---- */
pages['signup.html'] = head('Sign Up') + header('signup.html', 'public') + `
<main id="main" class="page"><div class="wrap">
  <div class="panel narrow">
    <h2>Create Citizen Account</h2>
    <div class="flash" id="flash"></div>
    <form action="/signup" method="POST">
      <div class="field"><label>Username <span class="req">*</span></label><input type="text" name="username" placeholder="Choose a username" required></div>
      <div class="field"><label>Email <span class="req">*</span></label><input type="email" name="email" placeholder="you@example.com" required></div>
      <div class="field"><label>Password <span class="req">*</span></label><input type="password" name="password" placeholder="Create a password" required></div>
      <button class="btn" type="submit" style="width:100%">Sign Up</button>
    </form>
    <p class="alt">Already registered? <a href="login.html">Login</a></p>
  </div>
</div></main>` + footer();

/* ---- main (dashboard) ---- */
pages['main.html'] = head('Dashboard') + header('main.html', 'auth') + crumb('Dashboard') + `
<main id="main">
  <section class="hero"><div class="wrap">
    <h1>Welcome to your Dashboard</h1>
    <p>Empowering citizens to report and resolve local issues quickly and effectively.</p>
  </div></section>
  <section class="page"><div class="wrap">
    <div class="card-grid">
      <div class="card"><div class="ico">👤</div><h3>Your Profile</h3><p>Check and update your personal details and contact info.</p><a href="profile.html" class="btn">Go to Profile</a></div>
      <div class="card"><div class="ico">📝</div><h3>Report an Issue</h3><p>Submit complaints such as road damage, water and waste issues.</p><a href="report.html" class="btn">Report Now</a></div>
      <div class="card"><div class="ico">📋</div><h3>View Issues</h3><p>Track the status and progress of reported issues.</p><a href="view-issues.html" class="btn">View Issues</a></div>
      <div class="card"><div class="ico">📞</div><h3>Help &amp; Support</h3><p>Contact officials, find support numbers, or send feedback.</p><a href="contact.html" class="btn">Get Support</a></div>
    </div>
  </div></section>
</main>` + footer();

/* ---- report ---- */
pages['report.html'] = head('Report an Issue') + header('report.html', 'auth') + crumb('Report an Issue') + `
<main id="main" class="page"><div class="wrap">
  <h1 class="page-title">Report a New Issue</h1>
  <p class="page-intro">Provide as much detail as possible. Fields marked <span class="req">*</span> are required.</p>
  <div class="panel">
    <div class="flash" id="flash"></div>
    <form action="/report-issue" method="POST" enctype="multipart/form-data">
      <div class="field"><label>Issue Title <span class="req">*</span></label><input type="text" name="title" placeholder="e.g. Pothole near main road" required></div>
      <div class="field"><label>Category <span class="req">*</span></label>
        <select name="category" required>
          <option value="">Select a category</option>
          <option>Road/Infrastructure</option><option>Water Supply</option><option>Electricity</option>
          <option>Waste Management</option><option>Street Lighting</option><option>Public Safety</option><option>Other</option>
        </select>
      </div>
      <div class="field"><label>Description <span class="req">*</span></label><textarea name="description" placeholder="Describe the issue in detail..." required></textarea></div>
      <div class="field"><label>Location <span class="req">*</span></label><input type="text" name="location" placeholder="Area, landmark, city" required></div>
      <div class="field"><label>Photo (optional)</label><input type="file" name="image" accept="image/*"><p class="help-line">JPG or PNG, up to 5 MB.</p></div>
      <button class="btn btn-accent" type="submit" style="width:100%">Submit Report</button>
    </form>
  </div>
</div></main>` + footer();

/* ---- view-issues ---- */
pages['view-issues.html'] = head('View Issues') + header('view-issues.html', 'auth') + crumb('View Issues') + `
<main id="main" class="page"><div class="wrap">
  <div class="issues-toolbar">
    <h1 class="page-title" style="margin:0">Reported Issues</h1>
    <a class="btn btn-accent" href="report.html"><i class="fas fa-plus"></i> Report New</a>
  </div>
  <div class="flash" id="flash"></div>
  <div id="issues-container"><div class="loading">Loading issues…</div></div>
</div></main>
<script>
document.addEventListener('DOMContentLoaded', function () {
  fetch('/issues').then(function(r){return r.json();}).then(function(data){
    var c = document.getElementById('issues-container');
    if (!data.length) { c.innerHTML = '<p class="no-issues">No issues reported yet.</p>'; return; }
    c.innerHTML = data.map(function(i){
      return '<div class="issue-card">'
        + '<div class="issue-header"><h3>' + (i.title || i.category) + '</h3>'
        + '<span class="status ' + i.status.toLowerCase().replace(/\\s+/g,'-') + '">' + i.status + '</span></div>'
        + '<p class="description">' + i.description + '</p>'
        + '<div class="issue-meta"><span>📍 ' + i.location + '</span>'
        + '<span>🏷️ ' + (i.category||'General') + '</span>'
        + '<span>📅 ' + new Date(i.createdAt).toLocaleDateString() + '</span>'
        + '<span>👤 ' + (i.username || 'Anonymous') + '</span></div>'
        + (i.image ? '<img class="issue-image" src="/uploads/' + i.image + '" alt="Issue photo">' : '')
        + '</div>';
    }).join('');
  }).catch(function(){
    document.getElementById('issues-container').innerHTML = '<p class="error">Failed to load issues. Please try again later.</p>';
  });
});
</script>` + footer();

/* ---- profile ---- */
pages['profile.html'] = head('Profile') + header('profile.html', 'auth') + crumb('Profile') + `
<main id="main" class="page"><div class="wrap">
  <h1 class="page-title">Your Profile</h1>
  <p class="page-intro">Your registered account details.</p>
  <div class="panel">
    <div id="profile-info"><div class="loading">Loading profile…</div></div>
    <div class="profile-actions" style="margin-top:22px;text-align:center">
      <button class="btn btn-danger" onclick="logout()">Logout</button>
    </div>
  </div>
</div></main>
<script>
document.addEventListener('DOMContentLoaded', function () {
  fetch('/profile-data').then(function(r){return r.json();}).then(function(u){
    document.getElementById('profile-info').innerHTML =
      '<div class="profile-details">'
      + '<p><strong>Name:</strong> ' + u.username + '</p>'
      + '<p><strong>Email:</strong> ' + u.email + '</p>'
      + '<p><strong>Member Since:</strong> ' + new Date(u.createdAt).toLocaleDateString() + '</p>'
      + '</div>';
  }).catch(function(){
    document.getElementById('profile-info').innerHTML = '<p class="error">Failed to load profile data.</p>';
  });
});
function logout(){ if (confirm('Are you sure you want to logout?')) window.location.href='/logout'; }
</script>` + footer();

/* ---- contact ---- */
pages['contact.html'] = head('Contact & Help') + header('contact.html', 'auth') + crumb('Contact & Help') + `
<main id="main" class="page"><div class="wrap">
  <h1 class="page-title">Contact &amp; Help</h1>
  <p class="page-intro">Reach the grievance cell or send us a message.</p>
  <div class="panel">
    <div class="flash" id="flash"></div>
    <div class="contact-info" style="background:#f4f7fb;border:1px solid var(--line);border-radius:8px;padding:18px;margin-bottom:22px">
      <p style="margin:.2rem 0"><strong>Email:</strong> support@civicreport.ap.gov.in</p>
      <p style="margin:.2rem 0"><strong>Helpline:</strong> 1800-425-0000</p>
      <p style="margin:.2rem 0"><strong>Office:</strong> Secretariat, Velagapudi, Amaravati, A.P.</p>
    </div>
    <h2 style="font-size:1.2rem">Send us a message</h2>
    <form action="/contact" method="POST">
      <div class="field"><label>Your Name <span class="req">*</span></label><input type="text" name="name" placeholder="Full name" required></div>
      <div class="field"><label>Your Email <span class="req">*</span></label><input type="email" name="email" placeholder="you@example.com" required></div>
      <div class="field"><label>Message <span class="req">*</span></label><textarea name="message" placeholder="How can we help?" required></textarea></div>
      <button class="btn" type="submit" style="width:100%">Send Message</button>
    </form>
  </div>
</div></main>` + footer();

/* ---- write all ---- */
Object.entries(pages).forEach(([name, html]) => {
  fs.writeFileSync(path.join(OUT, name), html);
});
console.log('Generated:', Object.keys(pages).join(', '));
