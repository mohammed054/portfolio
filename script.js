/* SND Design — Phase 1 JavaScript */

// Header scroll effect
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 80);
  });
}

// Go to Top button visibility
const goToTop = document.getElementById('GLOBAL-GOTOTOP');
if (goToTop) {
  window.addEventListener('scroll', () => {
    goToTop.classList.toggle('visible', window.scrollY > 400);
  });
}

// Fun Facts count-up animation
function animateCountUp() {
  const statNumbers = document.querySelectorAll('.fun-facts__stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current).toLocaleString() + '+';
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => observer.observe(el));
}

// Intro Video Modal
function openIntroModal() {
  const modal = document.getElementById('intro-modal');
  if (modal) modal.style.display = 'flex';
}
function closeIntroModal() {
  const modal = document.getElementById('intro-modal');
  if (modal) modal.style.display = 'none';
}

// Testimonials carousel
function scrollTestimonials(direction) {
  const carousel = document.getElementById('testimonials-carousel');
  if (!carousel) return;
  carousel.scrollBy({ left: 524 * direction, behavior: 'smooth' });
}

// Countdown Timer
function startCountdown() {
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');
  if (!daysEl) return;

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);

  function update() {
    const diff = targetDate - new Date();
    if (diff <= 0) { daysEl.textContent = hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = '00'; return; }
    daysEl.textContent = String(Math.floor(diff / 864e5)).padStart(2, '0');
    hoursEl.textContent = String(Math.floor((diff % 864e5) / 36e5)).padStart(2, '0');
    minutesEl.textContent = String(Math.floor((diff % 36e5) / 6e4)).padStart(2, '0');
    secondsEl.textContent = String(Math.floor((diff % 6e4) / 1e3)).padStart(2, '0');
  }
  update();
  setInterval(update, 1000);
}

// Custom Cursor (disabled until confirmed live per spec)
function initCustomCursor() {
  const cursor = document.getElementById('GLOBAL-DOT-MARKER');
  if (!cursor || 'ontouchstart' in window) return;
  cursor.style.display = 'block';
  document.body.style.cursor = 'none';
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .btn, .why-choose-us__card, .footer__social-icon').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '36px'; cursor.style.height = '36px'; cursor.style.background = '#F85D40'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '12px'; cursor.style.height = '12px'; cursor.style.background = '#1B1F29'; });
  });
}

// Scroll cue on About hero
function initScrollCue() {
  const cue = document.getElementById('ABOUT-HERO-SCROLLCUE');
  if (cue) {
    cue.addEventListener('click', () => {
      const next = document.getElementById('section-services-strip');
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// Init all
document.addEventListener('DOMContentLoaded', () => {
  animateCountUp();
  startCountdown();
  initCustomCursor();
  initScrollCue();
});
