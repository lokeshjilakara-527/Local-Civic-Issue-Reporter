/* =====================================================================
   gov.js — shared front-end behaviours used on every page:
   mobile menu toggle, accessibility text-resizer (A- A A+), and showing
   flash messages passed via the URL (?error= / ?registered= / ?sent= ...).
   ===================================================================== */
(function () {
    /* ---- Mobile menu ---- */
    document.addEventListener('DOMContentLoaded', function () {
        var burger = document.getElementById('hamburger');
        var links = document.getElementById('navLinks');
        if (burger && links) burger.addEventListener('click', function () { links.classList.toggle('show'); });

        /* ---- Text size A- / A / A+ ---- */
        var saved = parseFloat(localStorage.getItem('fontScale'));
        if (saved) document.documentElement.style.fontSize = saved + 'px';
        document.querySelectorAll('.ts').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var cur = parseFloat(getComputedStyle(document.documentElement).fontSize);
                var next = btn.dataset.size === 'inc' ? Math.min(cur + 1, 20)
                         : btn.dataset.size === 'dec' ? Math.max(cur - 1, 13) : 16;
                document.documentElement.style.fontSize = next + 'px';
                localStorage.setItem('fontScale', next);
            });
        });

        /* ---- Flash messages from query string ---- */
        var flash = document.getElementById('flash');
        if (flash) {
            var p = new URLSearchParams(location.search);
            var messages = {
                registered: ['success', 'Registration successful. Please log in.'],
                sent: ['success', 'Thank you! Your message has been received.'],
                reported: ['success', 'Your issue has been submitted successfully.'],
            };
            var errors = {
                missing: 'Please fill in all required fields.',
                username: 'That username is already taken.',
                email: 'An account with that email already exists.',
                invalid: 'Invalid username or password.',
                login: 'Please log in to continue.',
                server: 'Something went wrong. Please try again.',
            };
            var shown = null;
            for (var key in messages) if (p.has(key)) { shown = messages[key]; break; }
            if (!shown && p.has('error')) shown = ['error', errors[p.get('error')] || 'Request failed.'];
            if (shown) {
                flash.textContent = shown[1];
                flash.classList.add(shown[0], 'show');
                history.replaceState(null, '', location.pathname); // clean the URL
            }
        }
    });
})();
