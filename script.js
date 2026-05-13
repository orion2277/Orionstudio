(() => {
    'use strict';

    /* ===== Language Switch ===== */
    let currentLang = 'hu';

    const langToggle = document.getElementById('langToggle');
    const langHu = langToggle.querySelector('.lang-hu');
    const langEn = langToggle.querySelector('.lang-en');

    function applyLang(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;

        // Update all elements with data-hu / data-en
        document.querySelectorAll('[data-hu]').forEach(el => {
            const text = lang === 'hu' ? el.getAttribute('data-hu') : el.getAttribute('data-en');
            if (text) el.textContent = text;
        });

        // Update select options
        document.querySelectorAll('select option[data-hu]').forEach(opt => {
            const text = lang === 'hu' ? opt.getAttribute('data-hu') : opt.getAttribute('data-en');
            if (text) opt.textContent = text;
        });

        // Update placeholders
        const msgEl = document.getElementById('message');
        if (msgEl) msgEl.placeholder = lang === 'hu' ? 'Mondd el röviden miről szól a projekted…' : 'Tell me briefly about your project…';
        const nameEl = document.getElementById('name');
        if (nameEl) nameEl.placeholder = lang === 'hu' ? 'Kovács János' : 'John Smith';
        const emailEl = document.getElementById('email');
        if (emailEl) emailEl.placeholder = lang === 'hu' ? 'janos@cegem.hu' : 'john@company.com';

        // Toggle active states
        langHu.classList.toggle('active', lang === 'hu');
        langEn.classList.toggle('active', lang === 'en');
    }

    langToggle.addEventListener('click', () => {
        applyLang(currentLang === 'hu' ? 'en' : 'hu');
    });

    /* ===== Custom Cursor ===== */
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (cursor && follower) {
        let mx = -100, my = -100, fx = -100, fy = -100;
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            cursor.style.left = mx + 'px';
            cursor.style.top = my + 'px';
        });
        (function anim() {
            fx += (mx - fx) * 0.12;
            fy += (my - fy) * 0.12;
            follower.style.left = fx + 'px';
            follower.style.top = fy + 'px';
            requestAnimationFrame(anim);
        })();
        document.querySelectorAll('a, button, .service-card, .ref-card, .pricing-card, select').forEach(el => {
            el.addEventListener('mouseenter', () => { cursor.classList.add('hov'); follower.classList.add('hov'); });
            el.addEventListener('mouseleave', () => { cursor.classList.remove('hov'); follower.classList.remove('hov'); });
        });
    }

    /* ===== Star Canvas ===== */
    const canvas = document.getElementById('starCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', resize);
        for (let i = 0; i < 120; i++) {
            stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.2 + 0.2, a: Math.random() * Math.PI * 2, speed: Math.random() * 0.003 + 0.001, drift: (Math.random() - 0.5) * 0.06 });
        }
        (function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(s => {
                s.a += s.speed; s.x += s.drift;
                if (s.x > canvas.width) s.x = 0;
                if (s.x < 0) s.x = canvas.width;
                const alpha = (Math.sin(s.a) + 1) / 2 * 0.7 + 0.1;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201,168,76,${alpha * 0.55})`;
                ctx.fill();
            });
            requestAnimationFrame(draw);
        })();
    }

    /* ===== Sticky Nav ===== */
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 20); }, { passive: true });
    navToggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        navToggle.setAttribute('aria-label', open ? 'Menü bezárása' : 'Menü megnyitása');
    });
    navLinks.forEach(l => l.addEventListener('click', () => nav.classList.remove('open')));

    /* ===== Reveal on Scroll ===== */
    const reveals = document.querySelectorAll('.reveal-up');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const parent = entry.target.parentElement;
                    const siblings = parent ? [...parent.querySelectorAll('.reveal-up:not(.visible)')] : [];
                    const idx = siblings.indexOf(entry.target);
                    if (!entry.target.style.transitionDelay) {
                        entry.target.style.transitionDelay = `${Math.min(idx * 80, 280)}ms`;
                    }
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
        reveals.forEach(el => io.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('visible'));
    }

    /* ===== Smooth Scroll ===== */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' });
        });
    });

    /* ===== Footer Year ===== */
    const yr = document.getElementById('year');
    if (yr) yr.textContent = new Date().getFullYear();

    /* ===== Contact Form ===== */
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const setStatus = (msg, type) => { status.textContent = msg; status.className = 'form-status' + (type ? ' ' + type : ''); };

    form.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;
        ['name', 'email', 'subject', 'message'].forEach(name => {
            const el = form.elements[name];
            const val = el.value.trim();
            const ok = val.length > 0 && (name !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
            el.classList.toggle('invalid', !ok);
            if (!ok) valid = false;
        });
        if (!valid) {
            setStatus(currentLang === 'hu' ? 'Kérlek töltsd ki az összes mezőt.' : 'Please fill in all fields.', 'error');
            return;
        }
        const name = form.elements.name.value.trim();
        const email = form.elements.email.value.trim();
        const subject = form.elements.subject.value.trim();
        const message = form.elements.message.value.trim();
        const body = `${message}\n\n— ${name} (${email})`;
        window.location.href = `mailto:orion@orionstudio.hu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setStatus(currentLang === 'hu' ? 'Megnyitom az email kliensedet…' : 'Opening your email client…', 'success');
        setTimeout(() => {
            setStatus(currentLang === 'hu' ? 'Köszönöm! 24 órán belül válaszolok.' : 'Thank you! I\'ll reply within 24 hours.', 'success');
            form.reset();
        }, 800);
    });

    ['name', 'email', 'subject', 'message'].forEach(name => {
        form.elements[name].addEventListener('input', () => form.elements[name].classList.remove('invalid'));
    });

})();
