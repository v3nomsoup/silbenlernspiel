/* ============================================
   Puzzle-Belohnungssystem
   ============================================ */

const Puzzle = (() => {
    const PIECES_PER_PUZZLE = 9;
    const CORRECT_PER_PIECE = 10;

    // Puzzle images as SVG inline data (simple colorful images)
    const PUZZLES = [
        {
            name: 'Einhorn',
            colors: [
                '#ff6b6b', '#ff9ff3', '#feca57',
                '#ff6b6b', '#ffffff', '#ff9ff3',
                '#54a0ff', '#48dbfb', '#54a0ff'
            ],
            svg: generateUnicornSVG,
        },
        {
            name: 'Regenbogen',
            colors: [
                '#ff6b6b', '#feca57', '#48dbfb',
                '#ff9ff3', '#54a0ff', '#5f27cd',
                '#00b894', '#55efc4', '#fdcb6e'
            ],
            svg: generateRainbowSVG,
        },
        {
            name: 'Rakete',
            colors: [
                '#54a0ff', '#54a0ff', '#54a0ff',
                '#dfe6e9', '#ff6b6b', '#dfe6e9',
                '#ff9f43', '#feca57', '#ff9f43'
            ],
            svg: generateRocketSVG,
        },
        {
            name: 'Katze',
            colors: [
                '#feca57', '#fdcb6e', '#feca57',
                '#fdcb6e', '#2d3436', '#fdcb6e',
                '#fab1a0', '#fdcb6e', '#fab1a0'
            ],
            svg: generateCatSVG,
        },
        {
            name: 'Stern',
            colors: [
                '#5f27cd', '#feca57', '#5f27cd',
                '#feca57', '#feca57', '#feca57',
                '#5f27cd', '#feca57', '#5f27cd'
            ],
            svg: generateStarSVG,
        },
        {
            name: 'Delfin',
            colors: [
                '#48dbfb', '#48dbfb', '#54a0ff',
                '#48dbfb', '#54a0ff', '#dfe6e9',
                '#54a0ff', '#48dbfb', '#48dbfb'
            ],
            svg: generateDolphinSVG,
        },
    ];

    function generateUnicornSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#f8e8ff"/>
            <ellipse cx="100" cy="130" rx="50" ry="40" fill="#fff" stroke="#ddd" stroke-width="2"/>
            <circle cx="100" cy="80" r="30" fill="#fff" stroke="#ddd" stroke-width="2"/>
            <polygon points="100,20 93,60 107,60" fill="#feca57"/>
            <circle cx="90" cy="75" r="4" fill="#2d3436"/>
            <circle cx="110" cy="75" r="4" fill="#2d3436"/>
            <path d="M 92 88 Q 100 95 108 88" stroke="#ff6b6b" fill="none" stroke-width="2"/>
            <path d="M 60 100 Q 40 80 50 60" stroke="#ff9ff3" fill="none" stroke-width="4" stroke-linecap="round"/>
            <path d="M 140 100 Q 160 80 150 60" stroke="#54a0ff" fill="none" stroke-width="4" stroke-linecap="round"/>
            <ellipse cx="70" cy="165" rx="12" ry="15" fill="#ddd"/>
            <ellipse cx="90" cy="170" rx="12" ry="15" fill="#ddd"/>
            <ellipse cx="110" cy="170" rx="12" ry="15" fill="#ddd"/>
            <ellipse cx="130" cy="165" rx="12" ry="15" fill="#ddd"/>
        </svg>`;
    }

    function generateRainbowSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#e8f4fd"/>
            <path d="M 20 160 A 80 80 0 0 1 180 160" fill="none" stroke="#ff6b6b" stroke-width="12"/>
            <path d="M 30 160 A 70 70 0 0 1 170 160" fill="none" stroke="#feca57" stroke-width="12"/>
            <path d="M 40 160 A 60 60 0 0 1 160 160" fill="none" stroke="#00b894" stroke-width="12"/>
            <path d="M 50 160 A 50 50 0 0 1 150 160" fill="none" stroke="#54a0ff" stroke-width="12"/>
            <path d="M 60 160 A 40 40 0 0 1 140 160" fill="none" stroke="#5f27cd" stroke-width="12"/>
            <circle cx="40" cy="50" r="20" fill="#fff" opacity="0.8"/>
            <circle cx="55" cy="45" r="15" fill="#fff" opacity="0.8"/>
            <circle cx="150" cy="55" r="18" fill="#fff" opacity="0.8"/>
            <circle cx="165" cy="50" r="14" fill="#fff" opacity="0.8"/>
        </svg>`;
    }

    function generateRocketSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#2d3436"/>
            <circle cx="40" cy="40" r="2" fill="#feca57"/>
            <circle cx="160" cy="30" r="3" fill="#feca57"/>
            <circle cx="30" cy="120" r="2" fill="#feca57"/>
            <circle cx="170" cy="100" r="2" fill="#feca57"/>
            <circle cx="150" cy="160" r="2" fill="#feca57"/>
            <ellipse cx="100" cy="90" rx="25" ry="50" fill="#dfe6e9"/>
            <ellipse cx="100" cy="50" rx="15" ry="20" fill="#ff6b6b"/>
            <circle cx="100" cy="85" r="8" fill="#54a0ff"/>
            <polygon points="75,110 60,130 80,115" fill="#54a0ff"/>
            <polygon points="125,110 140,130 120,115" fill="#54a0ff"/>
            <polygon points="90,140 100,170 110,140" fill="#ff9f43"/>
            <polygon points="95,140 100,160 105,140" fill="#feca57"/>
        </svg>`;
    }

    function generateCatSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#ffeaa7"/>
            <ellipse cx="100" cy="130" rx="45" ry="40" fill="#fdcb6e"/>
            <circle cx="100" cy="80" r="35" fill="#fdcb6e"/>
            <polygon points="72,55 65,25 88,48" fill="#fdcb6e"/>
            <polygon points="128,55 135,25 112,48" fill="#fdcb6e"/>
            <polygon points="72,55 65,25 88,48" fill="none" stroke="#f39c12" stroke-width="2"/>
            <polygon points="128,55 135,25 112,48" fill="none" stroke="#f39c12" stroke-width="2"/>
            <circle cx="87" cy="75" r="5" fill="#2d3436"/>
            <circle cx="113" cy="75" r="5" fill="#2d3436"/>
            <circle cx="88" cy="74" r="2" fill="#fff"/>
            <circle cx="114" cy="74" r="2" fill="#fff"/>
            <ellipse cx="100" cy="88" rx="4" ry="3" fill="#fab1a0"/>
            <line x1="65" y1="85" x2="85" y2="88" stroke="#2d3436" stroke-width="1.5"/>
            <line x1="65" y1="90" x2="85" y2="90" stroke="#2d3436" stroke-width="1.5"/>
            <line x1="115" y1="88" x2="135" y2="85" stroke="#2d3436" stroke-width="1.5"/>
            <line x1="115" y1="90" x2="135" y2="90" stroke="#2d3436" stroke-width="1.5"/>
            <path d="M 93 92 Q 100 98 107 92" stroke="#2d3436" fill="none" stroke-width="1.5"/>
        </svg>`;
    }

    function generateStarSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#2d3436"/>
            <polygon points="100,20 120,75 180,80 135,120 150,178 100,145 50,178 65,120 20,80 80,75" fill="#feca57"/>
            <polygon points="100,40 115,80 160,83 125,112 137,160 100,135 63,160 75,112 40,83 85,80" fill="#fdcb6e"/>
            <circle cx="90" cy="90" r="4" fill="#2d3436"/>
            <circle cx="110" cy="90" r="4" fill="#2d3436"/>
            <path d="M 93 102 Q 100 108 107 102" stroke="#2d3436" fill="none" stroke-width="2"/>
        </svg>`;
    }

    function generateDolphinSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#dfe6e9"/>
            <path d="M 170 110 Q 180 90 170 70 Q 150 50 120 60 Q 90 70 60 90 Q 30 110 40 130 Q 50 150 80 145 Q 100 140 130 130 Q 160 120 170 110" fill="#54a0ff"/>
            <circle cx="135" cy="78" r="4" fill="#2d3436"/>
            <circle cx="136" cy="77" r="1.5" fill="#fff"/>
            <path d="M 155 85 Q 165 88 160 82" stroke="#2d3436" fill="none" stroke-width="1.5"/>
            <path d="M 40 120 Q 20 100 35 85" fill="#54a0ff" stroke="#3d8fd6" stroke-width="1"/>
            <path d="M 100 75 Q 95 50 110 45 Q 115 55 105 70" fill="#54a0ff"/>
            <path d="M 0 170 Q 30 155 60 165 Q 90 175 120 165 Q 150 155 180 165 Q 195 170 200 168" fill="none" stroke="#48dbfb" stroke-width="3" opacity="0.5"/>
            <path d="M 0 180 Q 25 168 55 178 Q 85 188 115 178 Q 145 168 175 178 Q 195 183 200 182" fill="none" stroke="#48dbfb" stroke-width="3" opacity="0.3"/>
        </svg>`;
    }

    function getPuzzleCount() {
        return PUZZLES.length;
    }

    function getPuzzle(index) {
        return PUZZLES[index % PUZZLES.length];
    }

    function renderPuzzleGrid(container, puzzleIndex, revealedPieces) {
        const puzzle = getPuzzle(puzzleIndex);
        container.innerHTML = '';

        const title = document.createElement('h3');
        title.textContent = puzzle.name;
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'puzzle-grid';

        // If all pieces revealed, show the SVG image
        if (revealedPieces >= PIECES_PER_PUZZLE) {
            grid.innerHTML = puzzle.svg();
            grid.style.display = 'block';
            const label = document.createElement('div');
            label.className = 'puzzle-complete-label';
            label.textContent = 'Fertig! 🎉';
            container.appendChild(grid);
            container.appendChild(label);
            return;
        }

        for (let i = 0; i < PIECES_PER_PUZZLE; i++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            if (i < revealedPieces) {
                piece.classList.add('revealed');
                piece.style.background = puzzle.colors[i];
            } else {
                piece.classList.add('hidden');
                piece.style.background = '#b2bec3';
            }
            grid.appendChild(piece);
        }

        container.appendChild(grid);

        const progress = document.createElement('div');
        progress.style.color = '#636e72';
        progress.style.fontWeight = '600';
        progress.textContent = `${revealedPieces}/${PIECES_PER_PUZZLE} Teile`;
        container.appendChild(progress);
    }

    function renderAllPuzzles(container, gameState) {
        container.innerHTML = '';

        // Current puzzle
        const totalPuzzles = Math.max(gameState.currentPuzzleIndex + 1, gameState.completedPuzzles.length + 1);

        for (let i = 0; i < totalPuzzles && i < PUZZLES.length; i++) {
            const card = document.createElement('div');
            card.className = 'puzzle-card';

            const isCompleted = gameState.completedPuzzles.includes(i);
            const isCurrent = i === gameState.currentPuzzleIndex;

            const pieces = isCompleted ? PIECES_PER_PUZZLE : (isCurrent ? gameState.puzzlePieces : 0);
            renderPuzzleGrid(card, i, pieces);

            container.appendChild(card);
        }

        if (totalPuzzles === 0) {
            container.innerHTML = '<p style="text-align:center;color:#636e72;font-size:1.2rem;padding:3rem;">Sammle Punkte um Puzzleteile freizuschalten!</p>';
        }
    }

    return {
        PIECES_PER_PUZZLE,
        CORRECT_PER_PIECE,
        getPuzzleCount,
        getPuzzle,
        renderPuzzleGrid,
        renderAllPuzzles,
    };
})();
