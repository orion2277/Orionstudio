(() => {
    'use strict';

    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Sticky nav background on scroll
    const onScroll = () => {
        if (window.scrollY > 24) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        const opened = nav.classList.toggle('open');
        navToggle.setAttribute('aria-label', opened ? 'Menü bezárása' : 'Menü megnyitása');
    });
    navLinks.forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

    // Reveal-on-scroll using IntersectionObserver
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = `${Math.min(i * 60, 240)}ms`;
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
        reveals.forEach(el => io.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('in'));
    }

    // Smooth scroll for in-page anchors (covers older Safari without scroll-behavior)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = 70;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // Footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Contact form — opens user's email client with a prefilled message
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const fields = ['name', 'email', 'subject', 'message'];

    const setStatus = (msg, type) => {
        status.textContent = msg;
        status.className = 'form-status' + (type ? ' ' + type : '');
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        fields.forEach(name => {
            const el = form.elements[name];
            const value = el.value.trim();
            const isEmail = name === 'email';
            const ok = value.length > 0 && (!isEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
            el.classList.toggle('invalid', !ok);
            if (!ok) valid = false;
        });

        if (!valid) {
            setStatus('Kérlek töltsd ki az összes mezőt érvényesen.', 'error');
            return;
        }

        const name = form.elements.name.value.trim();
        const email = form.elements.email.value.trim();
        const subject = form.elements.subject.value.trim();
        const message = form.elements.message.value.trim();

        const body = `${message}\n\n— ${name} (${email})`;
        const mailto = `mailto:orion@orionstudio.hu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        setStatus('Megnyitom az email kliensedet…', 'success');
        window.location.href = mailto;

        setTimeout(() => {
            setStatus('Köszönöm! 24 órán belül válaszolok.', 'success');
            form.reset();
        }, 600);
    });

    fields.forEach(name => {
        const el = form.elements[name];
        el.addEventListener('input', () => el.classList.remove('invalid'));
    });
})();
