/**
 * night-sky.js
 * Creates an immersive night sky background with stars, constellations, and shooting stars.
 * Adapts brightness based on time of day (or simulates it).
 */

class NightSky {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'night-sky-canvas';
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.shootingStars = [];
        this.constellationStars = [];
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.timeOfDay = new Date().getHours(); // Real time

        // Settings
        this.isNight = (this.timeOfDay >= 18 || this.timeOfDay < 6);
        this.starCount = this.isNight ? 150 : 50; // Fewer stars during day
        this.bgColor = this.isNight ? '#2D2420' : 'transparent'; // Dark brown for night, transparent for day (uses CSS gradient)

        document.body.prepend(this.canvas);

        window.addEventListener('resize', () => this.resize());
        this.resize();
        this.init();
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    init() {
        // Create static stars
        for (let i = 0; i < this.starCount; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random(),
                pulseSpeed: Math.random() * 0.02 + 0.005
            });
        }

        // Create Constellation Points (ALEZA Shape or Heart)
        // Simplified Heart shape points
        const cx = this.width / 2;
        const cy = this.height / 3;
        const scale = 5;
        // Heart formula points roughly
        const heartPoints = [
            { x: 0, y: -10 }, { x: 5, y: -15 }, { x: 10, y: -10 }, { x: 15, y: 0 },
            { x: 10, y: 10 }, { x: 0, y: 20 }, { x: -10, y: 10 }, { x: -15, y: 0 },
            { x: -10, y: -10 }, { x: -5, y: -15 }
        ];

        this.constellationStars = heartPoints.map(p => ({
            x: cx + p.x * scale + (Math.random() * 10 - 5),
            y: cy + p.y * scale + (Math.random() * 10 - 5),
            size: 2.5,
            opacity: 0.8,
            baseX: cx + p.x * scale,
            baseY: cy + p.y * scale
        }));

        // Interaction
        this.canvas.addEventListener('click', (e) => this.createShootingStar(e.clientX, e.clientY));
    }

    createShootingStar(tx, ty) {
        // Star starts from top-left or random
        this.shootingStars.push({
            x: Math.random() * this.width,
            y: 0,
            tx: tx || Math.random() * this.width,
            ty: ty || this.height,
            speed: Math.random() * 5 + 10,
            size: 2,
            life: 100
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw Background (if night)
        if (this.isNight) {
            this.ctx.fillStyle = 'rgba(45, 36, 32, 0.4)'; // Semi-transparent overlay to darken
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        // Draw Stars
        this.ctx.fillStyle = '#FFF';
        this.stars.forEach(star => {
            star.opacity += star.pulseSpeed;
            if (star.opacity > 1 || star.opacity < 0.2) star.pulseSpeed *= -1;

            this.ctx.globalAlpha = star.opacity;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw Constellation
        this.ctx.strokeStyle = 'rgba(139, 111, 71, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        if (this.constellationStars.length > 0) {
            this.ctx.moveTo(this.constellationStars[0].x, this.constellationStars[0].y);
            this.constellationStars.forEach(s => {
                // Draw Star
                this.ctx.globalAlpha = 1;
                this.ctx.fillStyle = '#D4AF37'; // Gold
                this.ctx.beginPath();
                this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                this.ctx.fill();

                // Line
                this.ctx.lineTo(s.x, s.y);
            });
            this.ctx.lineTo(this.constellationStars[0].x, this.constellationStars[0].y); // Close loop
            this.ctx.stroke();
        }

        // Draw Shooting Stars
        this.shootingStars.forEach((s, index) => {
            this.ctx.strokeStyle = '#FFF';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(s.x, s.y);

            // Move
            const angle = Math.atan2(s.ty - s.y, s.tx - s.x);
            s.x += Math.cos(angle) * s.speed;
            s.y += Math.sin(angle) * s.speed;

            this.ctx.lineTo(s.x - Math.cos(angle) * 20, s.y - Math.sin(angle) * 20); // Trail
            this.ctx.stroke();

            s.life--;
            if (s.life <= 0 || s.y > this.height) {
                this.shootingStars.splice(index, 1);
            }
        });

        this.ctx.globalAlpha = 1;

        // Occasional Random Shooting Star
        if (Math.random() < 0.005) {
            this.createShootingStar();
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    new NightSky();
});
