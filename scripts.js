// Navbar hide/show on scroll
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Scroll Down - Hide Navbar
        navbar.style.top = '-80px';
    } else {
        // Scroll Up - Show Navbar
        navbar.style.top = '0';
    }
    lastScrollTop = scrollTop;
});

// Scroll Spy for Navigation
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// --- Mobile Menu Logic ---
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// --- Background Effects: Binary Rain & Floating Code ---
(function() {
    // Create container for background effects
    const bgContainer = document.createElement('div');
    bgContainer.className = 'bg-effects';
    bgContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-2;overflow:hidden';
    document.body.insertBefore(bgContainer, document.body.firstChild);

    // Binary Rain Effect
    const binaryContainer = document.createElement('div');
    binaryContainer.className = 'binary-rain';
    binaryContainer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%';
    bgContainer.appendChild(binaryContainer);

    const binaryChars = '01';
    const columnCount = Math.floor(window.innerWidth / 25);

    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.className = 'binary-column';
        column.style.cssText = `
            position: absolute;
            top: -30px;
            left: ${i * 25}px;
            color: #64ffda;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            opacity: 0.15;
            white-space: nowrap;
            animation: binary-fall ${Math.random() * 3 + 4}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;

        // Generate random binary string
        let binaryStr = '';
        for (let j = 0; j < 15; j++) {
            binaryStr += binaryChars[Math.floor(Math.random() * 2)] + ' ';
        }
        column.textContent = binaryStr;
        binaryContainer.appendChild(column);
    }

    // Floating Code Snippets
    const codeSnippets = [
        'const awesome = true;',
        'return "Hello World";',
        'function build() { }',
        'npm install react',
        'git commit -m "awesome"',
        '{ key: "value" }',
        'Array.map(x => x * 2)',
        'useState(0)',
        'console.log("Hi");',
        'if (awesome) { }',
    ];

    for (let i = 0; i < 6; i++) {
        const code = document.createElement('div');
        code.className = 'floating-code';
        code.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        code.style.cssText = `
            position: absolute;
            color: #64ffda;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            opacity: 0.2;
            white-space: nowrap;
            top: ${Math.random() * 70 + 10}%;
            left: -300px;
            animation: float-code ${Math.random() * 5 + 8}s linear infinite;
            animation-delay: ${Math.random() * 8}s;
        `;
        bgContainer.appendChild(code);
    }
})();

// --- Copy Email with Feedback ---
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const email = link.getAttribute('href').replace('mailto:', '');

        navigator.clipboard.writeText(email).then(() => {
            // Create feedback element
            const feedback = document.createElement('div');
            feedback.className = 'copy-feedback';
            feedback.textContent = '✓ Email copied!';
            document.body.appendChild(feedback);

            setTimeout(() => feedback.remove(), 1500);
        });
    });
});

// --- Smooth Reveal for Section Headers ---
const sectionTitles = document.querySelectorAll('.section-title, .section-title-center');

const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, { threshold: 0.2 });

sectionTitles.forEach(title => {
    titleObserver.observe(title);
});

// --- Enhanced Button Hover Effects ---
document.querySelectorAll('.project-link, .tab-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// --- Keyboard Navigation for Tabs ---
tabButtons.forEach((btn, index) => {
    btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            tabButtons[(index + 1) % tabButtons.length].focus();
            tabButtons[(index + 1) % tabButtons.length].click();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            tabButtons[(index - 1 + tabButtons.length) % tabButtons.length].focus();
            tabButtons[(index - 1 + tabButtons.length) % tabButtons.length].click();
        }
    });
});

// ============================================
// PHASE 3: POLISH & ENHANCEMENTS
// ============================================

// --- Back to Top Button ---
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// --- Enhanced Link Loading States ---
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        // Don't show loading for same-page links or chrome extensions
        if (href && !href.startsWith('#') && !href.includes('chrome') && !href.includes('mailto')) {
            this.classList.add('loading');
        }
    });
});

// --- Page Load Progress Indicator ---
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loaded class styles
const style = document.createElement('style');
style.textContent = `
    body.loaded {
        opacity: 1;
    }
    body:not(.loaded) {
        opacity: 0;
    }
`;
document.head.appendChild(style);

// --- Smooth Scroll for Anchor Links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// --- Intersection Observer for Animations ---
const animateOnScroll = (entries, scrollObserver) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            scrollObserver.unobserve(entry.target);
        }
    });
};

const scrollObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver(animateOnScroll, scrollObserverOptions);

// Observe elements with animation classes
document.querySelectorAll('.skill-category, .timeline-item, .blog-card').forEach(el => {
    scrollObserver.observe(el);
});

// --- Enhanced Project Card Hover Effects ---
document.querySelectorAll('.featured-card').forEach((card, index) => {
    card.setAttribute('data-index', index + 1);
});

// --- Status Badges for Project Links ---
document.querySelectorAll('.project-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    let badgeClass = 'github';

    if (href.includes('github.io') || href.includes('vercel') || href.includes('netlify')) {
        badgeClass = 'live';
    } else if (href.includes('chrome') || href.includes('extension')) {
        badgeClass = 'extension';
    }
});

// --- Keyboard Shortcuts ---
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search (future enhancement)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        console.log('Search triggered');
    }

    // Ctrl/Cmd + Home to go to top
    if ((e.ctrlKey || e.metaKey) && e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Escape to close game window
    if (e.key === 'Escape') {
        const retroWindow = document.getElementById('retroWindow');
        if (retroWindow && retroWindow.classList.contains('active')) {
            retroWindow.classList.remove('active');
        }
    }
});

// --- Performance Optimization: Lazy Load Images ---
if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        img.removeAttribute('loading');
    });
} else {
    // Fallback for older browsers
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// --- Console Welcome Message ---
console.log(
    '%c🚀 Welcome to Mohammed\'s Portfolio!',
    'color: #64ffda; font-size: 20px; font-weight: bold;'
);
console.log(
    '%cBuilt with ❤️ and ☕ in the UAE',
    'color: #8892b0; font-size: 14px;'
);
console.log(
    '%cFeel free to explore the code on GitHub!',
    'color: #64ffda; font-size: 12px;'
);

// ============================================
// PHASE 4: FINAL REFINEMENTS & OPTIMIZATIONS
// ============================================

// --- Performance Optimization: Debounce ---
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// --- Performance Optimization: Throttle ---
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// --- Optimize Scroll Events ---
const optimizedScrollHandler = throttle(() => {
    // Existing scroll logic is handled by individual event listeners
}, 10);

window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// --- Staggered Animation for Grid Items ---
function staggerAnimation(containerSelector, itemSelector, delay = 100) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const items = container.querySelectorAll(itemSelector);
    items.forEach((item, index) => {
        item.style.animationDelay = `${index * delay}ms`;
        item.classList.add('stagger-item');
    });
}

// Apply staggered animations
staggerAnimation('.featured-grid', '.featured-card', 100);
staggerAnimation('.all-projects-grid', '.project-card', 80);
staggerAnimation('.skills-grid-wrapper', '.skill-category', 100);

// --- Enhanced Card Flip Effect ---
document.querySelectorAll('.flip').forEach(flipCard => {
    flipCard.setAttribute('tabindex', '0');
    flipCard.setAttribute('role', 'button');
    flipCard.setAttribute('aria-label', 'Flip card');

    flipCard.addEventListener('click', () => {
        flipCard.querySelector('.flip-inner').classList.toggle('flipped');
    });

    flipCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            flipCard.querySelector('.flip-inner').classList.toggle('flipped');
        }
    });
});

// --- Easter Egg: Konami Code ---
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'B'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    console.log('%c🎮 Easter Egg Activated!', 'color: #64ffda; font-size: 24px; font-weight: bold;');

    // Add special class to body
    document.body.classList.add('easter-egg-active');

    // Create celebration effect
    for (let i = 0; i < 50; i++) {
        setTimeout(() => createConfetti(document.body), i * 50);
    }

    // Show toast message
    const toast = document.createElement('div');
    toast.className = 'easter-egg-toast';
    toast.innerHTML = '🎮 You found the secret! Try the Snake game!';
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--bg-card);
        border: 2px solid var(--accent-color);
        padding: 1.5rem 2rem;
        border-radius: var(--radius);
        z-index: 10000;
        font-size: 1.2rem;
        color: var(--text-primary);
        text-align: center;
        animation: scale-in 0.3s ease forwards;
        box-shadow: 0 0 30px rgba(100, 255, 218, 0.3);
    `;
    document.body.appendChild(toast);

    // Auto-close toast
    setTimeout(() => {
        toast.style.animation = 'fade-out 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
        document.body.classList.remove('easter-egg-active');
    }, 3000);

    // Trigger game window if closed
    const gameTrigger = document.getElementById('gameTrigger');
    if (gameTrigger) {
        setTimeout(() => gameTrigger.click(), 500);
    }
}

// --- Time-based Greeting ---
function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

console.log(`%c${getTimeBasedGreeting()}! ☀️`, 'color: #64ffda; font-size: 16px;');

// --- Dynamic Year in Footer ---
document.querySelectorAll('.footer-meta').forEach(el => {
    el.innerHTML = el.innerHTML.replace('2024-2026', `2024-${new Date().getFullYear()}`);
});

// --- Lazy Load Non-Critical Resources ---
function lazyLoadFont(fontName) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;600&display=swap`;
    link.media = 'print';
    link.onload = () => { link.media = 'all'; };
    document.head.appendChild(link);
}

// --- Memory Cleanup ---
window.addEventListener('beforeunload', () => {
    // Remove event listeners to prevent memory leaks
    document.querySelectorAll('.featured-card').forEach(card => {
        card.replaceWith(card.cloneNode(true));
    });
});

// --- Feature Detection ---
const features = {
    intersectionObserver: 'IntersectionObserver' in window,
    mutationObserver: 'MutationObserver' in window,
    webAnimations: 'animate' in document.createElement('div'),
    touchEvents: 'ontouchstart' in window,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    highContrast: window.matchMedia('(prefers-contrast: high)').matches,
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
};

console.log('🔍 Feature Detection:', features);

// --- Smooth Scroll Duration Control ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// --- Scroll Depth Tracking ---
let maxScrollDepth = 0;
window.addEventListener('scroll', () => {
    const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
    }
}, { passive: true });

// Log scroll depth on load and unload
window.addEventListener('load', () => {
    console.log(`📊 Scroll depth tracking started`);
});

window.addEventListener('beforeunload', () => {
    console.log(`📊 Max scroll depth: ${maxScrollDepth.toFixed(1)}%`);
});

// --- Enhanced Error Handling ---
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.message);
    console.error('File:', e.filename);
    console.error('Line:', e.lineno);
});

// --- Disable Right Click on Specific Elements (Optional) ---
document.querySelectorAll('.game-trigger, #spaceship').forEach(el => {
    el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});

// --- Track Time on Page ---
let startTime = Date.now();
window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.floor((Date.now() - startTime) / 1000);
    console.log(`⏱️ Time on page: ${Math.floor(timeOnPage / 60)}m ${timeOnPage % 60}s`);
});

// --- Final Console Message ---
console.log(
    '%c✨ Portfolio loaded successfully!',
    'color: #64ffda; font-size: 16px; font-weight: bold;'
);
