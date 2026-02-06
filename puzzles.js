/**
 * puzzles.js
 * Handles Locking/Unlocking of special sections using mini-games.
 */

class PuzzleSystem {
    constructor() {
        this.lockedSections = [
            { id: 'video-section', type: 'memory' } // Lock the video section
        ];
        this.init();
    }

    init() {
        this.lockedSections.forEach(section => {
            const el = document.querySelector(`.${section.id}`) || document.getElementById(section.id);
            if (el) {
                this.createLockOverlay(el);
            }
        });
    }

    createLockOverlay(el) {
        // Ensure relative positioning
        if (getComputedStyle(el).position === 'static') {
            el.style.position = 'relative';
        }

        const overlay = document.createElement('div');
        overlay.classList.add('puzzle-overlay');

        const container = document.createElement('div');
        container.classList.add('puzzle-container');

        const title = document.createElement('h3');
        title.className = 'playfair';
        title.innerText = "Unlock this Memory 🔒";
        title.style.color = '#8B6F47';

        const desc = document.createElement('p');
        desc.innerText = "Match the symbols of our love to view.";
        desc.style.marginBottom = '1rem';
        desc.style.fontSize = '0.9rem';

        const grid = document.createElement('div');
        grid.className = 'puzzle-grid';

        // Memory Game Logic
        const icons = ['♥️', '💍', '🏡'];
        // Duplicate for pairs: [A, B, C, A, B, C]
        let cardsData = [...icons, ...icons];

        // Shuffle
        cardsData.sort(() => Math.random() - 0.5);

        let flippedCards = [];
        let matchedPairs = 0;

        cardsData.forEach((icon, index) => {
            const card = document.createElement('div');
            card.className = 'puzzle-card';
            card.dataset.value = icon;
            card.dataset.index = index;

            // Front (Hidden)
            const front = document.createElement('span');
            front.innerText = icon;
            card.appendChild(front);

            card.addEventListener('click', () => {
                if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
                if (flippedCards.length >= 2) return;

                // Flip
                card.classList.add('flipped');
                flippedCards.push(card);

                if (flippedCards.length === 2) {
                    const [c1, c2] = flippedCards;
                    if (c1.dataset.value === c2.dataset.value) {
                        // Match
                        setTimeout(() => {
                            c1.classList.add('matched');
                            c2.classList.add('matched');
                            matchedPairs++;
                            flippedCards = [];

                            if (matchedPairs === icons.length) {
                                // Solved
                                setTimeout(() => {
                                    overlay.classList.add('unlocked');
                                    // el.style.pointerEvents = 'auto'; // Re-enable interaction if blocked
                                    this.playSuccess(container);
                                }, 500);
                            }
                        }, 500);
                    } else {
                        // No Match
                        setTimeout(() => {
                            c1.classList.remove('flipped');
                            c2.classList.remove('flipped');
                            flippedCards = [];
                        }, 1000);
                    }
                }
            });

            grid.appendChild(card);
        });

        container.appendChild(title);
        container.appendChild(desc);
        container.appendChild(grid);
        overlay.appendChild(container);
        el.appendChild(overlay);
    }

    playSuccess(container) {
        container.innerHTML = `<h2 class="playfair" style="color:var(--primary-brown)">Unlocked! ♥️</h2>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PuzzleSystem();
});
