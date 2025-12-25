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

// --- Mobile Menu Logic ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// --- Typing Effect ---
const textToType = "I build things for the web.";
const typingElement = document.querySelector('.sub-heading');
let typeIndex = 0;

function typeWriter() {
    if (typeIndex < textToType.length) {
        typingElement.innerHTML += textToType.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriter, 100);
    }
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
        
        // IMPRESSIVE FEATURE: Reality Link
        createExplosion(head.x * gridSize, head.y * gridSize, '#ff6b6b');
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

// The "Never Done Before" Effect: 3D DOM Manipulation
function triggerShockwave() {
    const mainContent = document.querySelector('main');
    
    // Tilt the website based on snake direction
    const tiltX = dy * 5; // Tilt up/down
    const tiltY = dx * -5; // Tilt left/right
    
    mainContent.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(0.98)`;
    
    // Reset after impact
    setTimeout(() => {
        mainContent.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }, 150);
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
const bottomElements = document.querySelectorAll('.hero-text, .btn-primary, .about-text, .skills-list li, .coming-soon-card, .contact-text, .btn-large, .contact-details');

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
                
                // Create Particle Explosion
                // 50x MORE PARTICLES as requested
                for (let i = 0; i < 150; i++) {
                    const particle = document.createElement('div');
                    particle.classList.add('explosion-particle');
                    document.body.appendChild(particle);
                    
                    // Set initial position
                    particle.style.left = `${centerX}px`;
                    particle.style.top = '50px'; // Lower start point to be visible
                    
                    // Randomize colors for realistic fire explosion
                    const colors = ['#ff6b6b', '#ffeb3b', '#ff5722', '#ffffff'];
                    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    
                    // Random size
                    const size = Math.random() * 20 + 5; // Much bigger particles
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;

                    // Random velocity
                    const angle = Math.random() * Math.PI; // Downward semi-circle
                    const velocity = Math.random() * 20 + 10; // Even faster explosion
                    const tx = Math.cos(angle) * velocity * 40; // Wider spread
                    const ty = Math.sin(angle) * velocity * 40;
                    
                    // Animate
                    particle.animate([
                        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                        { transform: `translate(calc(-50% + ${tx}px), ${ty}px) scale(0)`, opacity: 0 }
                    ], {
                        duration: 5000 + Math.random() * 3000, // SUPER SLOW (5-8 seconds)
                        easing: 'cubic-bezier(0, .9, .57, 1)',
                        fill: 'forwards'
                    });
                    
                    // Cleanup
                    setTimeout(() => particle.remove(), 8000);
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
                            <path d="M12 8 L12 16 M12 8 L8 12 M12 8 L16 12 M12 16 L9 21 M12 16 L15 21" />
                        </svg>
                    </div>
                    <div class="speech-bubble visible">WHEEEEEEEEE!</div>
                `;
                document.body.appendChild(parachuter);

                // Start at explosion center
                parachuter.style.left = `${centerX}px`;
                parachuter.style.top = '50px'; // Start at explosion height

                // Force reflow to ensure transition works
                parachuter.getBoundingClientRect();

                // Calculate landing spot (Game Trigger Button)
                const triggerRect = gameTrigger.getBoundingClientRect();
                const landX = triggerRect.left + triggerRect.width / 2;
                const landY = triggerRect.top - 90; // Adjusted: Sit ON TOP (Canopy + Guy height offset)

                // Animate Descent
                parachuter.style.transition = 'top 5s ease-out, left 5s ease-in-out';
                parachuter.style.left = `${landX}px`;
                parachuter.style.top = `${landY}px`;

                // Drop the parachute after landing
                setTimeout(() => {
                    const canopy = parachuter.querySelector('.parachute-canopy');
                    if(canopy) {
                        canopy.style.transition = 'opacity 1s, transform 1s';
                        canopy.style.opacity = '0';
                        canopy.style.transform = 'translateY(20px) scale(0.5)';
                    }
                    
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