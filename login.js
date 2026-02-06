document.addEventListener('DOMContentLoaded', () => {
    initFloatingHearts();

    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('error-msg');
    const loginCard = document.querySelector('.login-card');

    // Focus first input
    setTimeout(() => usernameInput.focus(), 1000);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim().toLowerCase();

        // Simple client-side validation
        if (username === 'aleza' && password === 'janimann') {
            onLoginSuccess();
        } else {
            handleError(username, password);
        }
    });

    function onLoginSuccess() {
        errorMsg.classList.remove('visible');
        loginCard.classList.add('fade-out-page');

        // Redirect after animation
        setTimeout(() => {
            window.location.href = 'bday.html';
        }, 1000);
    }

    function handleError(user, pass) {
        const errors = [
            "Not quite, my love... try again ♥",
            "Think of what I call you when we're alone...",
            "Only the queen of my heart knows this...",
            "Hmm, that doesn't sound right...",
            "Are you sure? Try 'Aleza' and 'Janimann'..." // Hint after a few tries? logic simplified here
        ];

        // Pick a random error message
        const randomError = errors[Math.floor(Math.random() * errors.length)];

        errorMsg.textContent = randomError;
        errorMsg.classList.add('visible');

        // Shake animation
        loginCard.style.transform = 'translateX(10px)';
        setTimeout(() => {
            loginCard.style.transform = 'translateX(-10px)';
            setTimeout(() => {
                loginCard.style.transform = 'translateX(0)';
            }, 100);
        }, 100);
    }

    /* Reuse Floating Hearts Logic */
    function initFloatingHearts() {
        const container = document.querySelector('.floating-container');
        const hearts = ['♥️', '💖', '💝', '💕'];

        setInterval(() => {
            if (document.hidden) return; // Don't animate if tab hidden

            const heart = document.createElement('div');
            heart.classList.add('floating-heart');
            heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];

            const startLeft = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const size = Math.random() * 1 + 0.5;

            heart.style.left = `${startLeft}%`;
            heart.style.animationDuration = `${duration}s`;
            heart.style.fontSize = `${size}rem`;

            container.appendChild(heart);

            setTimeout(() => heart.remove(), duration * 1000);
        }, 400);
    }

    initSlideshow(); // New Feature
});

/* SLIDESHOW LOGIC */
function initSlideshow() {
    const container = document.getElementById('slideshow-bg');
    const images = [
        'images/c.jpg',
        'images/17.jpeg',
        'images/1.JPG',
        'images/vv.jpg',
        'images/we.png',
        'images/25.JPG'
    ];

    // Create Image Elements
    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('slide');
        if (index === 0) img.classList.add('active');
        container.appendChild(img);
    });

    let currentIndex = 0;
    const slides = document.querySelectorAll('.slide');

    // Cycle Images
    setInterval(() => {
        slides[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.add('active');
    }, 5000); // Change every 5 seconds
}
