
/**
 * interactive-effects.js
 * Handles all romantic/emotional interactive features across the site.
 */

class RomanticEffects {
    constructor() {
        this.idleTimer = null;
        this.idleLimit = 7000; // 8 seconds
        this.idleMsgElement = null;
        this.trailElements = [];
        this.maxTrail = 10;
        this.trailIndex = 0;
    }

    init() {
        this.initClickEffects();
        this.initCursorTrail();
        this.initScrollParallax();

        // Features ONLY for Main Birthday Page
        if (this.isMainPage()) {
            this.initIdleDetection();
            this.initBalloonSurprise();
            this.initFlowerEvolution(); // Keeping this restricted too as good practice, though not explicitly asked
            // Surprise notification is called within initIdleDetection, so it's covered
        }

        this.initLogout();
    }

    /* Helper: Check if we are on the main birthday page */
    isMainPage() {
        // We can check for a specific element unique to bday.html
        return document.getElementById('main-wrapper') !== null;
    }

    /* 1. Click Hearts & Sparkles */
    initClickEffects() {
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return; // Avoid obscuring buttons
            this.createClickHearts(e.clientX, e.clientY);
            this.createSparkles(e.clientX, e.clientY);
            this.createFloatingLoveWord(e.clientX, e.clientY);
        });

        // Mobile Tap Support
        document.addEventListener('touchstart', (e) => {
            // For simplicity, using first touch
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.createClickHearts(touch.clientX, touch.clientY);
            }
        }, { passive: true });
    }

    createClickHearts(x, y) {
        const hearts = ['🤎', '🤍', '♥️'];
        const heart = document.createElement('div');
        heart.classList.add('click-heart');
        heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;

        // Random slight rotation
        heart.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 40 - 20}deg)`;

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }

    createSparkles(x, y) {
        for (let i = 0; i < 6; i++) {
            const sparkle = document.createElement('div');
            sparkle.classList.add('sparkle');
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 50 + 20;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            sparkle.style.setProperty('--tx', `${tx}px`);
            sparkle.style.setProperty('--ty', `${ty}px`);
            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;

            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 800);
        }
    }

    /* 2. Cursor Trail */
    initCursorTrail() {
        if (window.matchMedia("(pointer: coarse)").matches) return; // Skip on mobile

        // Create pool
        for (let i = 0; i < this.maxTrail; i++) {
            const dot = document.createElement('div');
            dot.classList.add('cursor-trail');
            dot.style.opacity = '0';
            document.body.appendChild(dot);
            this.trailElements.push(dot);
        }

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Activate next dot
            const dot = this.trailElements[this.trailIndex];
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;
            dot.style.opacity = '0.6';
            dot.style.transform = 'translate(-50%, -50%) scale(1)';

            // Fade out previous
            setTimeout(() => {
                dot.style.opacity = '0';
                dot.style.transform = 'translate(-50%, -50%) scale(0.5)';
            }, 100);

            this.trailIndex = (this.trailIndex + 1) % this.maxTrail;
        });
    }

    /* 3. Scroll Parallax */
    initScrollParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const body = document.body;

            // Gentle background shift if applicable
            body.style.backgroundPosition = `center ${-(scrolled * 0.05)}px`;

            // Parallax on floating elements if any exist
            const floaters = document.querySelectorAll('.floating-heart');
            floaters.forEach((f, index) => {
                const speed = index % 2 === 0 ? 0.2 : 0.1;
                f.style.transform = `translateY(${-(scrolled * speed)}px)`;
            });
        });
    }

    /* 4. Idle Detection (UPDATED) */
    initIdleDetection() {
        this.idleLimit = 37000; // Updated to 37 seconds

        // Create message element
        this.idleMsgElement = document.createElement('div');
        this.idleMsgElement.classList.add('idle-message');
        this.idleMsgElement.innerHTML = "Still here? I love that 🤎";
        document.body.appendChild(this.idleMsgElement);

        const resetTimer = () => {
            this.idleMsgElement.classList.remove('visible');
            clearTimeout(this.idleTimer);
            this.idleTimer = setTimeout(() => {
                this.idleMsgElement.classList.add('visible');
            }, this.idleLimit);
        };

        ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'].forEach(evt => {
            document.addEventListener(evt, resetTimer);
        });

        resetTimer();

        // Also init the surprise features
        this.initSurpriseNotification();
    }

    /* 6. Surprise Love Notification */
    initSurpriseNotification() {
        // Random time between 60-90 seconds
        const delay = Math.random() * (90000 - 60000) + 60000;

        setTimeout(() => {
            const notif = document.createElement('div');
            notif.classList.add('surprise-notification');
            notif.innerHTML = `
                <span class="notif-icon">🔔</span>
                <span>New message from my heart</span>
            `;

            notif.addEventListener('click', () => {
                this.openInvisibleInkCard();
                notif.classList.remove('visible');
                setTimeout(() => notif.remove(), 1000);
            });

            document.body.appendChild(notif);

            // Trigger visibility
            requestAnimationFrame(() => notif.classList.add('visible'));

        }, delay);
    }

    /* 7. Invisible Ink Card */
    openInvisibleInkCard() {
        const modal = document.createElement('div');
        modal.classList.add('ink-modal');

        const card = document.createElement('div');
        card.classList.add('ink-card');

        const closeBtn = document.createElement('button');
        closeBtn.classList.add('ink-close-btn');
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => {
            modal.classList.remove('visible');
            setTimeout(() => modal.remove(), 800);
        };

        const instruction = document.createElement('p');
        instruction.classList.add('ink-instruction');
        instruction.innerText = "Move your finger or mouse slowly to reveal...";

        const revealArea = document.createElement('div');
        revealArea.classList.add('ink-reveal-area');

        // Prepare text with spans
        const message = "I loved you even before I understood love.";
        message.split('').forEach(char => {
            const span = document.createElement('span');
            span.classList.add('ink-char', 'hidden-state');
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            revealArea.appendChild(span);
        });

        card.appendChild(closeBtn);
        card.appendChild(instruction);
        card.appendChild(revealArea);
        modal.appendChild(card);
        document.body.appendChild(modal);

        // Show Modal
        requestAnimationFrame(() => modal.classList.add('visible'));

        // Reveal Logic (Warmth Effect)
        const chars = revealArea.querySelectorAll('.ink-char');

        const handleMove = (x, y) => {
            chars.forEach(char => {
                const rect = char.getBoundingClientRect();
                const charX = rect.left + rect.width / 2;
                const charY = rect.top + rect.height / 2;

                const dist = Math.hypot(charX - x, charY - y);

                // If close enough, reveal permanently
                if (dist < 40) {
                    char.classList.remove('hidden-state');
                    char.classList.add('revealed');
                }
            });
        };

        modal.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
        modal.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) handleMove(e.touches[0].clientX, e.touches[0].clientY);
        });
    }

    /* 8. Balloon Surprise (Enhanced) */
    initBalloonSurprise() {
        this.poppedCount = 0;
        this.balloonInterval = null;
        this.messageIndex = 0;

        this.balloonMessages = [
            "Your smile is my favorite sunrise.",
            "Every heartbeat of mine whispers your name.",
            "I found home in your eyes.",
            "You are the poetry I never knew how to write.",
            "Loving you is the easiest thing I've ever done.",
            "My soul recognized yours the moment we met.",
            "With you, every moment is a memory I want to keep.",
            "You are the best thing that's ever been mine.",
            "I love you more than there are stars in the sky.",
            "You make my world brighter just by being in it.",
            "My heart dances whenever I see you.",
            "You are my favorite thought.",
            "Forever isn't long enough with you.",
            "You are the magic I always believed in.",
            "Every love song suddenly makes sense.",
            "To the world you are one person, to me you are the world.",
            "You are my happy place.",
            "I love you past the moon and beyond the stars.",
            "Your laugh is my favorite sound.",
            "Life is beautiful, but it's beautiful because of you.",
            "You are my greatest adventure.",
            "There is no remedy for love but to love more.",
            "You are the dream I never want to wake up from.",
            "My love for you grows with every passing second.",
            "You are the missing piece I didn’t know I needed.",
            "I love you. Simply, truly, deeply."
        ];

        // Start spawning
        this.startBalloonSpawning();
    }

    startBalloonSpawning() {
        // Clear any existing interval just in case
        if (this.balloonInterval) clearInterval(this.balloonInterval);

        // Spawn a balloon every 2.5 seconds
        this.balloonInterval = setInterval(() => {
            if (document.hidden) return;
            this.createBalloon();
        }, 2500);
    }

    createBalloon() {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');

        // Random Position
        const left = Math.random() * 90 + 5; // 5% to 95%
        balloon.style.left = `${left}%`;

        // Random Duration
        const duration = Math.random() * 5 + 10; // 10-15s
        balloon.style.setProperty('--duration', `${duration}s`);

        // Color variants (ROMANTIC RED Theme Only)
        const colors = [
            '#D32F2F', // Red 700
            '#C62828', // Red 800
            '#B71C1C', // Red 900
            '#FFCDD2', // Red 100
            '#EF9A9A', // Red 200
            '#E57373', // Red 300
            '#FF5252', // Red Accent
            '#FF1744'  // Red Accent 400
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.setProperty('--bg-color', color);

        // Click to Pop
        const popHandler = (e) => {
            e.stopPropagation(); // Prevent other click effects from double triggering if needed
            this.popBalloon(balloon);
        };

        balloon.addEventListener('click', popHandler);
        balloon.addEventListener('touchstart', popHandler);

        document.body.appendChild(balloon);

        // Cleanup when out of view
        setTimeout(() => {
            if (balloon.parentNode) balloon.remove();
        }, duration * 1000);
    }

    popBalloon(balloon) {
        if (balloon.classList.contains('popped')) return;

        balloon.classList.add('popped');
        this.poppedCount++;

        // Visual Pop Effect
        this.createSparkles(balloon.getBoundingClientRect().left + 30, balloon.getBoundingClientRect().top + 40);

        // Remove after animation
        setTimeout(() => {
            if (balloon.parentNode) balloon.remove();
        }, 200);

        // Check for Surprise
        if (this.poppedCount === 7) {
            this.triggerBalloonReveal();
        }
    }

    triggerBalloonReveal() {
        // Stop spawning
        clearInterval(this.balloonInterval);

        // Get current message
        const message = this.balloonMessages[this.messageIndex];

        // Cycle Index
        this.messageIndex = (this.messageIndex + 1) % this.balloonMessages.length;

        // Create Overlay
        const overlay = document.createElement('div');
        overlay.classList.add('balloon-reveal-overlay');
        overlay.innerHTML = `
            <div class="reveal-heart-icon">♥️</div>
            <h1 class="reveal-text">"${message}"</h1>
            <button class="reveal-close-btn">Keep Exploring to Pop More ✨</button>
        `;

        document.body.appendChild(overlay);

        // Show
        requestAnimationFrame(() => overlay.classList.add('visible'));

        // Close Handler (Reset Logic)
        const closeBtn = overlay.querySelector('.reveal-close-btn');
        closeBtn.onclick = () => {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 1500);

            // RESET for Replayability
            this.poppedCount = 0;
            this.startBalloonSpawning();
        };
    }

    /* 9. Flower Evolution System */
    initFlowerEvolution() {
        // Container
        const container = document.createElement('div');
        container.classList.add('flower-container');
        document.body.appendChild(container);

        // Created simple SVG plant
        container.innerHTML = `
            <svg class="organic-flower" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                <!-- Stem -->
                <path id="flower-stem" d="M50 200 Q50 150 50 150" stroke="#5D4037" stroke-width="4" fill="none" stroke-linecap="round" />
                <!-- Leaves -->
                <path id="flower-leaf-1" d="M50 150 Q20 120 20 140" stroke="#8B6F47" stroke-width="0" fill="#8B6F47" opacity="0" />
                <path id="flower-leaf-2" d="M50 130 Q80 100 80 120" stroke="#8B6F47" stroke-width="0" fill="#8B6F47" opacity="0" />
                <!-- Bud/Flower -->
                <circle id="flower-bud" cx="50" cy="150" r="0" fill="#D32F2F" />
                <!-- Message -->
                <div class="flower-message">Love grows where care lives.</div>
            </svg>
        `;

        this.flowerState = 0;

        window.addEventListener('scroll', () => {
            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            this.updateFlower(scrollPercent);
        });
    }

    updateFlower(percent) {
        const stem = document.getElementById('flower-stem');
        const leaf1 = document.getElementById('flower-leaf-1');
        const leaf2 = document.getElementById('flower-leaf-2');
        const bud = document.getElementById('flower-bud');

        // Stage 1: Stem grows (0 - 30%)
        if (percent > 0) {
            const height = 200 - (percent * 1.5 * 100); // map progress to height
            const y = Math.max(50, height);
            stem.setAttribute('d', `M50 200 Q${50 + Math.sin(percent * 10) * 10} ${150 + percent * 50} 50 ${y}`);
            bud.setAttribute('cy', y);
        }

        // Stage 2: Leaves (30% - 60%)
        if (percent > 0.3) {
            leaf1.setAttribute('stroke-width', '2');
            leaf1.setAttribute('opacity', Math.min(1, (percent - 0.3) * 3));
        }
        if (percent > 0.45) {
            leaf2.setAttribute('stroke-width', '2');
            leaf2.setAttribute('opacity', Math.min(1, (percent - 0.45) * 3));
        }

        // Stage 3: Bloom (60% - 90%)
        if (percent > 0.6) {
            const size = (percent - 0.6) * 3 * 15;
            bud.setAttribute('r', Math.min(15, size));
        }

        // Stage 4: Full Message (95%+)
        if (percent > 0.95) {
            document.querySelector('.flower-container').classList.add('bloomed');
        } else {
            document.querySelector('.flower-container').classList.remove('bloomed');
        }
    }

    /* 10. Particle Love Words & Gallery Effects */
    initParticles() {
        // Gallery Glow
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                // Emit sparks
                const rect = item.getBoundingClientRect();
                this.createSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
            });
        });

        // Mouse Trail is handled by initCursorTrail
        // Love Words are handled by initLoveWordTimer (every 3s)
    }

    /* 5. Logout Feature */
    initLogout() {
        // Only run on main bday page where controls exist
        if (!document.getElementById('bday.html') && !window.location.href.includes('bday.html')) return;

        // Add logout button if not exists
        if (!document.getElementById('logout-btn')) {
            const controls = document.querySelector('.controls-bar');
            if (controls) {
                const btn = document.createElement('button');
                btn.id = 'logout-btn';
                btn.className = 'control-btn logout-btn-style';
                btn.innerText = "Logout";
                controls.appendChild(btn);
            }
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.performLogout());
        }
    }

    performLogout() {
        // Create Overlay
        const overlay = document.createElement('div');
        overlay.classList.add('logout-overlay');
        overlay.innerHTML = `<h2 class="playfair">Come back soon, Aleza 🤎</h2>`;
        document.body.appendChild(overlay);

        // Animate
        setTimeout(() => overlay.classList.add('visible'), 50);

        // Redirect
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 4000);
    }
    /* 11. Love Word Automation */
    initLoveWordTimer() {
        setInterval(() => {
            if (document.hidden) return;
            this.triggerLoveWordBurst();
        }, 3000);
    }
    /* 11. Love Word on Click */
    createFloatingLoveWord(x, y) {
        const words = ["Love", "You", "Aleza", "Janimann"];
        const word = document.createElement('div');
        word.classList.add('love-particle');
        word.innerText = words[Math.floor(Math.random() * words.length)];

        // Position at click
        word.style.position = 'fixed';
        word.style.zIndex = '9999';
        word.style.left = `${x}px`;
        word.style.top = `${y}px`;

        // Style
        word.style.width = 'auto';
        word.style.height = 'auto';
        word.style.pointerEvents = 'none';
        word.style.background = 'transparent';
        word.style.color = '#8B6F47'; // Primary brown
        word.style.fontWeight = 'bold';
        word.style.fontFamily = "'Playfair Display', serif";
        word.style.fontSize = '1.5rem';
        word.style.textShadow = '0 0 5px rgba(255, 255, 255, 0.8)';
        word.style.opacity = '1';
        word.style.transform = 'translate(-50%, -50%) scale(0.5)'; // Start small
        word.style.transition = 'all 3s ease-out';

        document.body.appendChild(word);

        // Float Up Animation
        requestAnimationFrame(() => {
            word.style.transform = `translate(-50%, -150px) scale(1.2)`; // Move up and grow
            word.style.opacity = '0';
        });

        // Cleanup
        setTimeout(() => {
            word.remove();
        }, 3000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const effects = new RomanticEffects();
    effects.init();
    effects.initParticles();
});
