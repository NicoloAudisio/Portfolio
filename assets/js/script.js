// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Navbar scrolled state
const navbar = document.getElementById('navbar');
const onScroll = () => navbar.classList.toggle('is-scrolled', window.scrollY > 10);
onScroll();
window.addEventListener('scroll', onScroll);

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  navToggle.innerHTML = isOpen
    ? '<svg class="icon"><use href="#i-close"/></svg>'
    : '<svg class="icon"><use href="#i-menu"/></svg>';
});
nav.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  navToggle.innerHTML = '<svg class="icon"><use href="#i-menu"/></svg>';
}));

// Scrollspy — highlight active nav link
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.nav-link')];
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const link = navLinks.find(a => a.getAttribute('href') === `#${entry.target.id}`);
    if (!link) return;
    navLinks.forEach(a => a.classList.remove('is-active'));
    link.classList.add('is-active');
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spyObserver.observe(s));

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// Skill bars fill on view
const skillObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.skill-bar').forEach(el => skillObserver.observe(el));

// Auto-updating "years since" counters (e.g. years in Croce Rossa)
const yearsSince = (dateStr) => {
  const start = new Date(dateStr);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  const anniversary = new Date(now.getFullYear(), start.getMonth(), start.getDate());
  if (now < anniversary) years--;
  return years;
};
document.querySelectorAll('[data-since]').forEach(el => {
  el.setAttribute('data-count', yearsSince(el.getAttribute('data-since')));
});

// Animated counters
const animateCount = (el) => {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const duration = 1200;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const countObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => countObserver.observe(el));

// Typed.js roles
const typedEl = document.querySelector('.typed');
if (typedEl && window.Typed) {
  new Typed('.typed', {
    strings: typedEl.getAttribute('data-typed-items').split(','),
    loop: true,
    typeSpeed: 65,
    backSpeed: 35,
    backDelay: 1800
  });
}

// Gallery lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
document.querySelectorAll('.gallery-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = btn.getAttribute('data-caption') || '';
    lightbox.classList.add('is-open');
  });
});
const closeLightbox = () => lightbox.classList.remove('is-open');
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// Back to top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => backToTop.classList.toggle('is-visible', window.scrollY > 600));
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
