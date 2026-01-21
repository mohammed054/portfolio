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

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// --- Typing Effect ---
const textsToType = ["I build things for the web.", "I'm a web designer.", "I create digital experiences."];
const typingElement = document.querySelector('.sub-heading');
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentText = textsToType[textIndex];
    const cursor = '<span class="cursor">_</span>';

    if (isDeleting) {
        typingElement.innerHTML = currentText.substring(0, charIndex - 1) + cursor;
        charIndex--;
    } else {
        typingElement.innerHTML = currentText.substring(0, charIndex + 1) + cursor;
        charIndex++;
    }

    // Random typing speed for human effect
    let typeSpeed = isDeleting ? 50 : Math.random() * 100 + 50;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
        typingElement.querySelector('.cursor').classList.add('blinking');
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textsToType.length;
        typeSpeed = 500;
        typingElement.querySelector('.cursor').classList.add('blinking');
    }

    setTimeout(typeWriter, typeSpeed);
}

if (typingElement) {
    typingElement.innerHTML = ""; // Clear initial text
    setTimeout(typeWriter, 1000); // Start typing after 1s
}

// --- Sound Effects System (Web Audio API) ---
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playSound(type) {
    if (!audioCtx) initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    
    if (type === 'eat') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
        gain.gain.setValueAtTime(0.3, now); // Increased volume
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'hit') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.2);
        gain.gain.setValueAtTime(0.3, now); // Increased volume
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    }
    // Add more complex sounds (explosion/launch) could be simulated with noise buffers, 
    // but keeping it simple and safe with oscillators for now.
}

// --- Retro Game Window Logic ---
const gameTrigger = document.getElementById('gameTrigger');
const retroWindow = document.getElementById('retroWindow');
const closeBtn = document.getElementById('closeBtn');
const minBtn = document.getElementById('minBtn');
const maxBtn = document.getElementById('maxBtn');
const windowHeader = document.getElementById('windowHeader');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('gameOverlay');
const scoreDisplay = document.getElementById('gameScore');
const terminalGuy = document.querySelector('.terminal-guy-container');

// Window Controls
gameTrigger.addEventListener('click', () => {
    retroWindow.classList.add('active');
    retroWindow.classList.remove('minimized');
    if (!gameRunning) resetGame();
});

closeBtn.addEventListener('click', () => {
    retroWindow.classList.remove('active');
    gameRunning = false;
});

minBtn.addEventListener('click', () => {
    retroWindow.classList.toggle('minimized');
});

maxBtn.addEventListener('click', () => {
    retroWindow.classList.toggle('maximized');
});

// Draggable Window
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

windowHeader.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    if (e.target === windowHeader || e.target.parentNode === windowHeader) {
        isDragging = true;
    }
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        // Only apply transform if not maximized/minimized
        if (!retroWindow.classList.contains('maximized') && !retroWindow.classList.contains('minimized')) {
            retroWindow.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
        }
    }
}

function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
}

// --- Snake Game Logic ---
let gameRunning = false;
let isPaused = false;
let score = 0;
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let particles = [];

// Particle System for "Expert" feel
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.life = 1.0;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.05;
        this.size *= 0.95;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1.0;
    }
}

function createExplosion(x, y, color) {
    for(let i = 0; i < 10; i++) particles.push(new Particle(x, y, color));
}

// Set canvas resolution (low res for retro feel)
canvas.width = 400;
canvas.height = 400;

function drawGame() {
    if (!gameRunning || isPaused) return;

    // Move Snake Head
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // Wrap-around Logic (Teleport to other side)
    const tileCountX = canvas.width / gridSize;
    const tileCountY = canvas.height / gridSize;

    if (head.x < 0) head.x = tileCountX - 1;
    if (head.x >= tileCountX) head.x = 0;
    if (head.y < 0) head.y = tileCountY - 1;
    if (head.y >= tileCountY) head.y = 0;

    snake.unshift(head);

    // Check Food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.innerText = `SCORE: ${score}`;
        playSound('eat');
        
        // Spawn new food (Auto-pickup logic if on body)
        let validPosition = false;
        while (!validPosition) {
            food = {
                x: Math.floor(Math.random() * tileCountX),
                y: Math.floor(Math.random() * tileCountY)
            };
            // If spawns on body, auto-pickup (score++ and retry)
            if (snake.some(s => s.x === food.x && s.y === food.y)) {
                score++;
                scoreDisplay.innerText = `SCORE: ${score}`;
                playSound('eat');
            } else {
                validPosition = true;
            }
        }
        
        // Subtle explosion effect
        createExplosion(head.x * gridSize, head.y * gridSize, '#64748b');
        triggerShockwave();
    } else {
        snake.pop();
    }

    // Check Collision (Walls or Self)
    if (snake.slice(1).some(s => s.x === head.x && s.y === head.y)) {
        resetGame();
        return;
    }

    // Draw
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#64ffda'; // Accent color
    snake.forEach(part => ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2));
    
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    
    // Draw Particles
    particles.forEach((p, index) => {
        p.update();
        p.draw(ctx);
        if(p.life <= 0) particles.splice(index, 1);
    });

    setTimeout(drawGame, 100);
}

// Subtle Shockwave Effect
function triggerShockwave() {
    const mainContent = document.querySelector('main');

    // Subtle tilt based on snake direction
    const tiltX = dy * 1; // Very subtle tilt
    const tiltY = dx * -1;

    mainContent.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

    // Reset after impact
    setTimeout(() => {
        mainContent.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }, 100);
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    dx = 0; dy = 0;
    gameRunning = false;
    isPaused = false;
    score = 0;
    scoreDisplay.innerText = `SCORE: 0`;
    overlay.style.display = 'block';
    terminalGuy.classList.remove('hidden'); // Show guy again
    overlay.innerHTML = 'PRESS SPACE TO START<br><span style="font-size: 14px">P to Pause</span>';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('keydown', e => {
    if (!retroWindow.classList.contains('active')) return;
    
    if (e.code === 'Space') {
        e.preventDefault(); // Stop page scrolling
        initAudio(); // Ensure audio context is ready
        if (gameRunning) return;
        gameRunning = true;
        isPaused = false;
        overlay.style.display = 'none';
        terminalGuy.classList.add('hidden'); // Hide guy during game
        dx = 1; dy = 0; // Start moving right
        drawGame();
    }

    if (e.code === 'KeyP') {
        if (!gameRunning) return;
        isPaused = !isPaused;
        if (isPaused) {
            overlay.style.display = 'block';
            overlay.innerHTML = 'PAUSED<br><span style="font-size: 14px">Press P to Resume</span>';
        } else {
            overlay.style.display = 'none';
            drawGame();
        }
    }
    
    if (!gameRunning || isPaused) return;
    
    switch(e.key) {
        case 'ArrowUp': 
        case 'w': case 'W': e.preventDefault(); if (dy === 0) { dx = 0; dy = -1; } break;
        case 'ArrowDown': 
        case 's': case 'S': e.preventDefault(); if (dy === 0) { dx = 0; dy = 1; } break;
        case 'ArrowLeft': 
        case 'a': case 'A': e.preventDefault(); if (dx === 0) { dx = -1; dy = 0; } break;
        case 'ArrowRight': 
        case 'd': case 'D': e.preventDefault(); if (dx === 0) { dx = 1; dy = 0; } break;
    }
});

// --- Scroll Reveal Animation ---
const observerOptions = {
    threshold: 0.15, // Trigger when 15% visible
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-element');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

const leftElements = document.querySelectorAll('.section-title, .main-heading, .sub-heading, .section-title-center');
const bottomElements = document.querySelectorAll('.hero-text, .btn-primary, .about-text, .skill-category li, .project-card, .blog-card, .contact-text, .btn-large, .contact-details, .timeline-content');

leftElements.forEach((el) => {
    el.classList.add('hidden-left');
    observer.observe(el);
});

bottomElements.forEach((el) => {
    el.classList.add('hidden-bottom');
    observer.observe(el);
});

// --- Spaceship Launch Logic ---
const spaceship = document.getElementById('spaceship');
const shipMsg = document.getElementById('shipMsg');
const resetBtn = document.getElementById('resetRocket');
let isLaunching = false;

// Rocket Follow Cursor (Rotation)
document.addEventListener('mousemove', (e) => {
    if (isLaunching || spaceship.style.display === 'none' || !spaceship.offsetParent) return;
    
    const rect = spaceship.getBoundingClientRect();
    const shipX = rect.left + rect.width / 2;
    const shipY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - shipY, e.clientX - shipX) * (180 / Math.PI);
    // Offset by 90 degrees because rocket points up
    const rotation = angle + 90; 
    spaceship.querySelector('.spaceship-icon').style.transform = `rotate(${rotation}deg)`;
});

spaceship.addEventListener('click', () => {
    if (isLaunching) return;
    isLaunching = true;
    initAudio();
    
    let count = 5;
    shipMsg.innerText = `Launching in ${count}...`;
    spaceship.classList.add('shaking');

    const countdown = setInterval(() => {
        count--;
        if (count > 0) {
            shipMsg.innerText = `Launching in ${count}...`;
        } else {
            clearInterval(countdown);
            shipMsg.innerText = "LIFT OFF!";
            spaceship.classList.remove('shaking');
            void spaceship.offsetWidth; // Force reflow to ensure transition plays correctly
            spaceship.classList.add('launching');
            spaceship.querySelector('.spaceship-icon').style.transform = 'rotate(0deg)'; // Reset rotation for launch
            
            // Wait for full transition (1.5s) before exploding
            setTimeout(() => { // Synced with CSS transition (1.5s)
                // Get ship position for accurate explosion
                const rect = spaceship.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                
                spaceship.style.display = 'none'; // Hide ship
                
                // Create Particle Explosion (Subtle)
                for (let i = 0; i < 40; i++) {
                    const particle = document.createElement('div');
                    particle.classList.add('explosion-particle');
                    document.body.appendChild(particle);

                    // Set initial position
                    particle.style.left = `${centerX}px`;
                    particle.style.top = '50px';

                    // Randomize colors
                    const colors = ['#64748b', '#94a3b8', '#f1f5f9', '#cbd5e1'];
                    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

                    // Random size
                    const size = Math.random() * 10 + 3;
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;

                    // Random velocity
                    const angle = Math.random() * Math.PI;
                    const velocity = Math.random() * 10 + 5;
                    const tx = Math.cos(angle) * velocity * 20;
                    const ty = Math.sin(angle) * velocity * 20;

                    // Animate
                    particle.animate([
                        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                        { transform: `translate(calc(-50% + ${tx}px), ${ty}px) scale(0)`, opacity: 0 }
                    ], {
                        duration: 2000 + Math.random() * 1000,
                        easing: 'cubic-bezier(0, .9, .57, 1)',
                        fill: 'forwards'
                    });

                    // Cleanup
                    setTimeout(() => particle.remove(), 3000);
                }

                // --- Spawn Cool Guy Parachuter ---
                const parachuter = document.createElement('div');
                parachuter.classList.add('parachuter');
                // Add speech bubble immediately
                parachuter.innerHTML = `
                    <svg class="parachute-canopy" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7.58 2 4 5.58 4 10H20C20 5.58 16.42 2 12 2M12 2L4 10M12 2L20 10M7 17L5 10M17 17L19 10"/></svg>
                    <div class="parachuter-guy">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="64" height="64">
                            <circle cx="12" cy="5" r="3" />
                            <path d="M12 8 L12 16 M12 16 L9 21 M12 16 L15 21" />
                            <path class="left-arm" d="M12 8 L8 12" />
                            <path class="right-arm" d="M12 8 L16 12" />
                        </svg>
                    </div>
                    <div class="speech-bubble visible">WHEEEEEEEEE!</div>
                `;
                document.body.appendChild(parachuter);

                // Start at explosion center
                parachuter.style.position = 'absolute';
                parachuter.style.left = `${centerX + window.scrollX}px`;
                parachuter.style.top = `${50 + window.scrollY}px`;

                // Calculate landing spot (Game Trigger Button)
                const triggerRect = gameTrigger.getBoundingClientRect();
                const landX = triggerRect.left + triggerRect.width / 2 + window.scrollX;
                const landY = triggerRect.top + window.scrollY - 120; // Sit on top border

                // Animate Descent
                setTimeout(() => {
                    parachuter.style.transition = 'top 5s ease-out, left 5s ease-in-out';
                    parachuter.style.left = `${landX}px`;
                    parachuter.style.top = `${landY}px`;
                }, 50);

                // Drop the parachute after landing
                setTimeout(() => {
                    const canopy = parachuter.querySelector('.parachute-canopy');
                    if(canopy) {
                        canopy.style.transition = 'opacity 1s, transform 1s';
                        canopy.style.opacity = '0';
                        canopy.style.transform = 'translateY(20px) scale(0.5)';
                    }
                    
                    // Wave arms
                    parachuter.querySelector('.parachuter-guy').classList.add('waving');
                    setTimeout(() => parachuter.querySelector('.parachuter-guy').classList.remove('waving'), 3000);

                    // Say something funny on landing
                    const bubble = parachuter.querySelector('.speech-bubble');
                    bubble.innerText = "Smooth operator.";
                    bubble.classList.add('visible');
                    setTimeout(() => bubble.classList.remove('visible'), 3000);
                    
                    // Show Reset Button
                    resetBtn.style.display = 'block';
                }, 5000);

                // Interaction: Hit him
                parachuter.addEventListener('click', (e) => {
                    e.stopPropagation(); // Don't trigger hitmark on guy
                    playSound('hit');
                    const bubble = parachuter.querySelector('.speech-bubble');
                    const phrases = ["Hey! Watch the suit!", "I'm working here!", "Ouch!", "Do you mind?", "Rude."];
                    bubble.innerText = phrases[Math.floor(Math.random() * phrases.length)];
                    bubble.classList.add('visible');
                    
                    // Shake animation
                    const guy = parachuter.querySelector('.parachuter-guy');
                    guy.style.transform = 'scale(0.9)';
                    setTimeout(() => { guy.style.transform = 'scale(1)'; bubble.classList.remove('visible'); }, 1000);
                });

            }, 1500); // Exactly matches CSS transition time
        }
    }, 1000);
});

// Reset Button Logic
resetBtn.addEventListener('click', () => {
    isLaunching = false;
    spaceship.style.display = 'flex';
    spaceship.classList.remove('launching');
    spaceship.style.transform = ''; // Clear inline transform
    shipMsg.innerText = "Click Me";
    resetBtn.style.display = 'none';
    // Remove old parachuter if exists
    const oldPara = document.querySelector('.parachuter');
    if(oldPara) oldPara.remove();
});

// --- Hitmark X Click Effect ---
document.addEventListener('click', (e) => {
    initAudio();
    const hit = document.createElement('div');
    hit.className = 'hitmark';
    hit.style.left = `${e.clientX}px`;
    hit.style.top = `${e.clientY}px`;
    document.body.appendChild(hit);
    setTimeout(() => hit.remove(), 300);
});

// --- Email Copy Feature ---
const emailLink = document.querySelector('a[href^="mailto:"]');
if (emailLink) {
    emailLink.addEventListener('click', function(e) {
        // Optional: Prevent default mail client opening if you prefer just copying
        // e.preventDefault(); 
        const email = this.getAttribute('href').replace('mailto:', '');
        navigator.clipboard.writeText(email).then(() => {
            // You could add a small tooltip here saying "Copied!"
        });
    });
}

// ============================================
// NEW PORTFOLIO JAVASCRIPT
// ============================================

// --- Tab Filtering System ---
const tabButtons = document.querySelectorAll('.tab-btn');
const projectCards = document.querySelectorAll('.all-projects-grid .project-card');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tab = btn.dataset.tab;

        // Filter projects with animation
        projectCards.forEach((card, index) => {
            const category = card.dataset.category;
            const shouldShow = tab === 'all' || category === tab;

            if (shouldShow) {
                card.classList.remove('hidden');
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                card.style.animation = `tab-reveal 0.4s ease ${index * 0.05}s forwards`;
            } else {
                card.classList.add('hidden');
                card.style.animation = 'none';
            }
        });
    });
});

// --- Featured Cards 3D Tilt Effect ---
const featuredCards = document.querySelectorAll('.featured-card');

featuredCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });

    // Confetti on hover for featured cards
    card.addEventListener('mouseenter', () => {
        createConfetti(card);
    });
});

// --- Confetti Effect ---
function createConfetti(element) {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#64ffda', '#a78bfa', '#f472b6', '#fbbf24', '#22d3ee'];
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = `${centerX}px`;
        confetti.style.top = `${centerY}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        // Random size
        const size = Math.random() * 8 + 4;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;

        // Random shape
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        } else {
            confetti.style.transform = `rotate(${Math.random() * 45}deg)`;
        }

        container.appendChild(confetti);
    }

    setTimeout(() => container.remove(), 3500);
}

// --- Scroll Reveal for Featured Cards ---
const featuredGrid = document.querySelector('.featured-grid');
if (featuredGrid) {
    const cards = featuredGrid.querySelectorAll('.featured-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    cards.forEach(card => {
        card.classList.add('reveal');
        revealObserver.observe(card);
    });
}

// --- Scroll Progress Bar ---
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
});

// --- Navbar Auto-Hide ---
let lastScroll = 0;
const navbarEl = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        if (currentScroll > lastScroll) {
            navbarEl.classList.add('hide');
            navbarEl.classList.remove('show');
        } else {
            navbarEl.classList.remove('hide');
            navbarEl.classList.add('show');
        }
    } else {
        navbarEl.classList.remove('hide');
        navbarEl.classList.add('show');
    }

    lastScroll = currentScroll;
});

// --- Binary Rain Background Effect ---
function createBinaryRain() {
    const rain = document.createElement('div');
    rain.className = 'binary-rain';
    document.body.appendChild(rain);

    const binaryChars = '01';
    const columnCount = Math.floor(window.innerWidth / 30);

    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.className = 'binary-column';
        column.style.left = `${i * 30}px`;
        column.style.animationDuration = `${Math.random() * 5 + 5}s`;
        column.style.animationDelay = `${Math.random() * 5}s`;

        // Generate random binary string
        let binaryStr = '';
        for (let j = 0; j < 20; j++) {
            binaryStr += binaryChars[Math.floor(Math.random() * 2)] + ' ';
        }
        column.textContent = binaryStr;

        rain.appendChild(column);
    }
}

// Create binary rain on load
if (window.innerWidth > 768) {
    createBinaryRain();
}

// --- Floating Code Snippets ---
function createFloatingCode() {
    const snippets = [
        'const awesome = true;',
        'return "Hello World";',
        'function build() { }',
        'npm install react',
        'git commit -m "awesome"',
        '{ key: "value" }',
        'Array.map(x => x * 2)',
        'useState(0)',
    ];

    for (let i = 0; i < 5; i++) {
        const code = document.createElement('div');
        code.className = 'floating-code';
        code.textContent = snippets[Math.floor(Math.random() * snippets.length)];
        code.style.top = `${Math.random() * 80 + 10}%`;
        code.style.animationDelay = `${Math.random() * 10}s`;
        code.style.animationDuration = `${Math.random() * 10 + 15}s`;
        document.body.appendChild(code);
    }
}

createFloatingCode();

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

// --- Cursor Follower ---
const cursorFollower = document.getElementById('cursorFollower');

if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('mousemove', (e) => {
        cursorFollower.style.left = `${e.clientX}px`;
        cursorFollower.style.top = `${e.clientY}px`;
    });

    // Add hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .featured-card, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover'));
    });
} else {
    cursorFollower.style.display = 'none';
}

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

// --- Magnetic Effect on Buttons ---
document.querySelectorAll('.btn, .project-link, .tab-btn').forEach(btn => {
    btn.classList.add('magnetic');
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

// --- Spotlight Effect on Cards ---
document.querySelectorAll('.spotlight, .featured-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--x', `${x}%`);
        card.style.setProperty('--y', `${y}%`);
    });
});

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

// --- Enhanced Button Ripple Effect ---
document.querySelectorAll('.btn, .project-link, .tab-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(100, 255, 218, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-effect 0.6s ease-out;
            pointer-events: none;
            width: 100px;
            height: 100px;
            left: ${x - 50}px;
            top: ${y - 50}px;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple-effect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    @keyframes fade-out {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
    }
`;
document.head.appendChild(rippleStyle);

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
