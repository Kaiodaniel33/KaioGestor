'use strict';

const navbar = document.getElementById('navbar');
function handleNavScroll() {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = mobileMenu.querySelectorAll('.mobile-link, .btn-mobile-cta');

hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

function animateCounter(el, from, to, suffix, duration) {
    const start = performance.now();
    function step(timestamp) {
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(from + (to - from) * eased);
        el.textContent = (value >= 1000 ? 'R$ ' + value.toLocaleString('pt-BR') : (progress < 1 && to < 0 ? '' : '')) + value + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = el.dataset.finalText;
    }
    requestAnimationFrame(step);
}

const statEls = document.querySelectorAll('.stat strong');
statEls.forEach(el => { el.dataset.finalText = el.textContent; });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            statEls.forEach((el, i) => {
                const raw = el.textContent;
                let to, suffix;
                if (raw.includes('R$')) {
                    to = 10; suffix = 'k+';
                    setTimeout(() => animateCounter(el, 0, to, suffix, 1200), i * 150);
                } else if (raw.includes('%')) {
                    to = parseInt(raw);
                    suffix = raw.includes('+') ? '%+' : '%-';
                    setTimeout(() => animateCounter(el, 0, Math.abs(to), suffix, 1000), i * 150);
                } else {
                    to = parseInt(raw);
                    suffix = '%';
                    setTimeout(() => animateCounter(el, 0, to, suffix, 1000), i * 150);
                }
            });
            statsObserver.disconnect();
        }
    }, { threshold: 0.5 });
    statsObserver.observe(statsBar);
}

const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function highlightActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
            navAnchors.forEach(a => a.classList.remove('active'));
            const match = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
            if (match) match.classList.add('active');
        }
    });
}
window.addEventListener('scroll', highlightActiveNav, { passive: true });
highlightActiveNav();
