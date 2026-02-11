/* Main Script for Janimann's Birthday Website */

document.addEventListener('DOMContentLoaded', () => {
    initFloatingHearts();
    initCakeInteraction();
    initVideoPlayer();
    initScrollAnimations();
    initEmotionalFeatures(); // Initialize new features
});

/* ===== FLOATING HEARTS BACKGROUND ===== */
function initFloatingHearts() {
    const container = document.querySelector('.floating-container');
    const hearts = ['♥️', '💖', '💝', '💕'];

    // Create new heart every 400ms
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];

        // Random position and size
        const startLeft = Math.random() * 100;
        const duration = Math.random() * 10 + 10; // 10-20s
        const size = Math.random() * 1 + 0.5; // 0.5 - 1.5rem

        heart.style.left = `${startLeft}%`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.fontSize = `${size}rem`;

        container.appendChild(heart);

        // Cleanup
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }, 400);
}

/* ===== CAKE INTERACTION ===== */
function initCakeInteraction() {
    const candles = document.querySelectorAll('.candle');
    const flames = document.querySelectorAll('.flame');
    const blowBtn = document.querySelector('.blow-btn');
    let litCount = 0;

    candles.forEach((candle, index) => {
        candle.addEventListener('click', () => {
            const flame = flames[index];
            if (!flame.classList.contains('lit')) {
                flame.classList.add('lit');
                litCount++;

                // Play gentle pop sound? (Optional, skipping for simplicity)

                if (litCount === candles.length) {
                    blowBtn.classList.add('visible');
                }
            }
        });
    });

    blowBtn.addEventListener('click', () => {
        // Blow out candles
        flames.forEach(flame => flame.classList.remove('lit'));
        blowBtn.classList.remove('visible');

        // Trigger Enhanced Animation
        handleCandleReveal();

        // Reset button for replayability
        setTimeout(() => {
            blowBtn.innerHTML = "Blow Candles";
            litCount = 0; // Reset count logic if we want replay
        }, 3000);
    });
}

/* ===== VIDEO PLAYER ===== */
function initVideoPlayer() {
    const video = document.getElementById('memory-video');
    const nowPlayingText = document.querySelector('.now-playing span');

    // List of videos found in the directory
    const playlist = [
        { src: 'fav.mp4', title: 'Favorite Video' },
        { src: 'bdaydressvideo.MP4', title: 'Birthday girl' },
        { src: 'concert.MP4', title: 'Musical Memories' },
        { src: 'henna.MP4', title: 'Beautiful Henna' },
        { src: 'meetup1.MP4', title: 'First Meetup' },
        { src: 'meetup2.MP4', title: 'Together Again' },
        { src: 'meetup3.MP4', title: 'Adventures' },
        { src: 'z.MP4', title: 'Sweet Moments' },
        { src: 'zzz.MP4', title: 'Just Us' }
    ];

    let currentVideoIndex = 0;

    // Load first video WITHOUT playing
    loadVideo(currentVideoIndex, false);

    // Auto play next on end
    video.addEventListener('ended', () => {
        currentVideoIndex = (currentVideoIndex + 1) % playlist.length;
        loadVideo(currentVideoIndex, true); // Play subsequent videos automatically
    });

    function loadVideo(index, autoPlay = true) {
        const videoData = playlist[index];
        video.src = `images/${videoData.src}`;
        nowPlayingText.textContent = videoData.title;

        if (autoPlay) {
            video.play().catch(e => {
                console.log("Autoplay prevented:", e);
                // Show play button overlay if needed, but standard controls are enabled
            });
        }
    }
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

/* ===== CONFETTI LOGIC (Simple Implementation) ===== */
function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#8B6F47', '#D4AF37', '#C1A186', '#E8D5C4', '#D4A5A5'];

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        };
    }

    // Init particles
    for (let i = 0; i < 150; i++) {
        particles.push(createParticle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let activeParticles = 0;
        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;

            if (p.y < canvas.height) {
                activeParticles++;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
        });

        if (activeParticles > 0) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}

/* =========================================
   EMOTIONAL & INTERACTIVE FEATURES
   ========================================= */

function initEmotionalFeatures() {
    // 4. Aleza Mode
    document.getElementById('aleza-mode-btn').addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.classList.toggle('aleza-mode');
        this.classList.toggle('active');
        showToast(document.body.classList.contains('aleza-mode') ? "Welcome to your warm world, Aleza 🤎" : "Back to bright ✨");
    });

    // 2. Heartbeat Mode
    document.getElementById('heartbeat-btn').addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const wrapper = document.getElementById('main-wrapper');
        wrapper.classList.toggle('heartbeat-active');
        this.classList.toggle('active');

        if (wrapper.classList.contains('heartbeat-active')) {
            showToast("This is how my heart reacts to you... 💓");
        } else {
            showToast("My heart is always yours.");
        }
    });

    // 5. Countdown Surprise
    document.getElementById('countdown-btn').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        startCountdown();
    });

    // 3. Secret Message
    initSecretMessage();

    // 6. AI Features
    initAIFeatures();
}

/* =========================================
   AI FEATURES LOGIC
   ========================================= */

function initAIFeatures() {
    const aiBtn = document.getElementById('ai-mode-btn');
    const aiOverlay = document.getElementById('ai-overlay');
    const closeBtn = document.querySelector('.ai-close-btn');
    const chatBtns = document.querySelectorAll('.chat-btn');
    const trainBtn = document.getElementById('start-training-btn');

    // Toggle Overlay
    aiBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        aiOverlay.classList.add('visible');

        // Reset Logic
        document.getElementById('chat-output').innerHTML = '<span class="typing-cursor">_</span>';
        document.getElementById('ai-chat-view').classList.remove('hidden');
        document.getElementById('ai-training-view').classList.add('hidden');
        document.getElementById('prog-1').style.width = '0%';
        document.getElementById('prog-2').style.width = '0%';
        document.getElementById('prog-1-val').innerText = '0%';
        document.getElementById('prog-2-val').innerText = '0%';
        document.getElementById('ai-final-output').classList.remove('visible');
        document.getElementById('ai-final-output').innerHTML = '';
        document.getElementById('ai-step-display').innerText = 'Initializing...';
        document.getElementById('ai-step-display').style.opacity = '1';
    });
    closeBtn.addEventListener('click', () => aiOverlay.classList.remove('visible'));

    // Chat Logic
    chatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.q;
            handleChatResponse(type);
        });
    });

    // Training Logic
    trainBtn.addEventListener('click', runTrainingSequence);
}

function handleChatResponse(type) {
    const output = document.getElementById('chat-output');
    let response = "";

    // Clear previous
    output.innerHTML = '<span class="typing-cursor">_</span>';

    // Determine response
    if (type === 'who') {
        response = "Analyzing heart data... \n> Subject: Aleza (Janimann) \n> Status: Irreplaceable \n> Conclusion: I love Janimann — 100% confidence.";
    } else if (type === 'output') {
        response = "Calculating final output... \n> Variable: Time \n> Result: Forever. \n> Model Output: My heart beats for you.";
    } else if (type === 'trained') {
        response = "Training started... \n> Epochs: Infinity \n> Loss: 0% \n> Accuracy: 100% \n> Result: A love that grows smarter every day.";
        setTimeout(showAIError, 2500); // Trigger error only here
    }

    // Typewriter effect
    typeWriter(response, output);
}

function typeWriter(text, element) {
    let i = 0;
    element.innerHTML = '<span class="typing-cursor">_</span>';
    const cursor = element.querySelector('.typing-cursor');

    function type() {
        if (i < text.length) {
            const char = text.charAt(i);
            const span = document.createElement('span');
            span.innerHTML = char === '\n' ? '<br>' : char;
            element.insertBefore(span, cursor);
            i++;
            setTimeout(type, 30);
        }
    }
    type();
}

function runTrainingSequence() {
    // Switch Views
    document.getElementById('ai-chat-view').classList.add('hidden');
    document.getElementById('ai-training-view').classList.remove('hidden');

    const stepDisplay = document.getElementById('ai-step-display');
    const steps = [
        "Step 7: Data Collection",
        "Step 6: Feeding Memories",
        "Step 5: Training Model",
        "Step 4: Validating Heart",
        "Step 3: Optimizing Love",
        "Step 2: Final Testing",
        "Step 1: Output Generated"
    ];

    let currentStep = 0;

    // Progress Bar Animation
    setTimeout(() => {
        document.getElementById('prog-1').style.width = '100%';
        document.getElementById('prog-1-val').innerText = '100%';
    }, 1000);

    setTimeout(() => {
        document.getElementById('prog-2').style.width = '100%';
        document.getElementById('prog-2-val').innerText = '100%';
    }, 3000);

    // Step Counter
    const interval = setInterval(() => {
        if (currentStep < steps.length) {
            stepDisplay.innerText = steps[currentStep];
            stepDisplay.style.opacity = 0;
            setTimeout(() => stepDisplay.style.opacity = 1, 100);
            currentStep++;
        } else {
            clearInterval(interval);
            finishTraining();
        }
    }, 1000);
}

function finishTraining() {
    const finalOut = document.getElementById('ai-final-output');
    finalOut.innerHTML = "Final Output:<br>I love Janimann — 100%";
    finalOut.classList.add('visible');
    triggerConfetti();

    // Reset after delay
    setTimeout(() => {
        // Optional: Close overlay or reset
    }, 5000);
}

function showAIError() {
    const toast = document.getElementById('ai-error-toast');
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 4000);
}

/* 1. Enhanced Candle Reveal (Called from initCakeInteraction) */
function handleCandleReveal() {
    const overlay = document.getElementById('magical-overlay');
    const title = document.getElementById('overlay-title');
    const desc = document.getElementById('overlay-desc');

    // Confetti first
    triggerConfetti();

    // Darken screen
    overlay.classList.add('visible');

    // Set Content
    title.innerHTML = "Make a wish... ✨";
    desc.innerHTML = "Because you already came true in my life.";

    // Hide after a few seconds
    setTimeout(() => {
        overlay.classList.remove('visible');
    }, 4000);
}

/* 5. Countdown Logic */
function startCountdown() {
    const overlay = document.getElementById('magical-overlay');
    const title = document.getElementById('overlay-title');
    const desc = document.getElementById('overlay-desc');

    overlay.classList.add('visible');
    desc.innerHTML = "";

    let count = 7;

    const interval = setInterval(() => {
        title.innerHTML = `<span class="countdown-number">${count}</span>`;

        if (count === 0) {
            clearInterval(interval);
            showFinalSurprise(title, desc);
        }
        count--;
    }, 1000);
}

function showFinalSurprise(title, desc) {
    title.innerHTML = "Every second with you <br>is my favorite ♥️";
    triggerConfetti();

    // Creating extra hearts bomb
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.classList.add('floating-heart');
            heart.innerHTML = "♥️";
            heart.style.left = Math.random() * 100 + "%";
            heart.style.fontSize = Math.random() * 2 + 1 + "rem";
            heart.style.animationDuration = "3s";
            document.querySelector('.floating-container').appendChild(heart);
        }, i * 100);
    }

    setTimeout(() => {
        document.getElementById('magical-overlay').classList.remove('visible');
    }, 4000);
}

/* 3. Secret Message Logic */
function initSecretMessage() {
    // Key Press '7'
    document.addEventListener('keyup', (e) => {
        if (e.key === '7') {
            revealSecret();
        }
    });

    // Double Click Hearts
    document.addEventListener('dblclick', (e) => {
        if (e.target.classList.contains('floating-heart') || e.target.classList.contains('heart-emoji')) {
            revealSecret();
        }
    });
}

function revealSecret() {
    const overlay = document.getElementById('magical-overlay');
    const title = document.getElementById('overlay-title');
    const desc = document.getElementById('overlay-desc');

    overlay.classList.add('visible');
    title.innerHTML = "Only you know how to unlock my heart. 🔐";
    desc.innerHTML = "You are my deepest secret and my proudest truth.";

    setTimeout(() => {
        overlay.classList.remove('visible');
    }, 5000);
}

/* Helper: Toast Message */
function showToast(msg) {
    const toast = document.getElementById('toast-msg');
    toast.textContent = msg;
    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}
