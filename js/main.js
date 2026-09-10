/* MAIN JAVASCRIPT - Saber Nasr */

(function() {
  'use strict';

  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.add('open');
    });
  }

  if (menuClose && mobileMenu) {
    menuClose.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.header__mobile-nav-link').forEach(function(link) {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
    });
  });

  // Header scroll behavior
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // Portfolio filter (if on portfolio page)
  const filterButtons = document.querySelectorAll('.portfolio-page__filter');
  const portfolioItems = document.querySelectorAll('.portfolio-page__item');

  if (filterButtons.length > 0) {
    filterButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');

        filterButtons.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');

        portfolioItems.forEach(function(item) {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Countdown Timer
  const countdown = document.getElementById('countdown');
  if (countdown) {
    const days = document.getElementById('days');
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');

    function updateCountdown() {
      const target = new Date();
      target.setDate(target.getDate() + 30);

      function tick() {
        const now = new Date();
        const diff = target - now;

        if (diff <= 0) {
          days.textContent = '00';
          hours.textContent = '00';
          minutes.textContent = '00';
          seconds.textContent = '00';
          return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        days.textContent = d.toString().padStart(2, '0');
        hours.textContent = h.toString().padStart(2, '0');
        minutes.textContent = m.toString().padStart(2, '0');
        seconds.textContent = s.toString().padStart(2, '0');

        setTimeout(tick, 1000);
      }

      tick();
    }

    updateCountdown();
  }

  // Go to top button
  const goToTop = document.createElement('button');
  goToTop.className = 'go-to-top';
  goToTop.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>';
  goToTop.setAttribute('aria-label', 'Go to top');
  document.body.appendChild(goToTop);

  goToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      goToTop.classList.add('visible');
    } else {
      goToTop.classList.remove('visible');
    }
  });

  // Animate stats counter
  const stats = document.querySelectorAll('.counter-number');
  if (stats.length > 0) {
    const animateStats = function() {
      stats.forEach(function(stat) {
        const target = parseInt(stat.getAttribute('data-count'));
        const current = parseInt(stat.textContent);

        if (current < target) {
          stat.textContent = current + 1;
          setTimeout(function() { animateStats(); }, 50);
        }
      });
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(function(stat) { observer.observe(stat); });
  }

  // Counter animation for stats
  const counterElements = document.querySelectorAll('.counter-number');
  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-count')) || 0;
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(function() {
          current += increment;
          if (current >= target) {
            entry.target.textContent = target;
            clearInterval(timer);
          } else {
            entry.target.textContent = Math.floor(current);
          }
        }, 30);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(function(el) { counterObserver.observe(el); });

})();
