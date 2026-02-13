/* ============================================
   Puzzle-Belohnungssystem
   ============================================ */

const Puzzle = (() => {
    const PIECES_PER_PUZZLE = 4;
    const STREAK_FOR_PIECE = 5;

    // Quadrant offsets: translate the 200%-sized SVG to show the right portion
    // Each piece shows a quarter of the image
    const QUADRANTS = [
        { tx: '0',    ty: '0',    label: 'oben links'   },  // top-left
        { tx: '-100%', ty: '0',    label: 'oben rechts'  },  // top-right
        { tx: '0',    ty: '-100%', label: 'unten links'  },  // bottom-left
        { tx: '-100%', ty: '-100%', label: 'unten rechts' },  // bottom-right
    ];

    const PUZZLES = [
        { name: 'Einhorn',     svg: generateUnicornSVG },
        { name: 'Regenbogen',  svg: generateRainbowSVG },
        { name: 'Rakete',      svg: generateRocketSVG },
        { name: 'Katze',       svg: generateCatSVG },
        { name: 'Stern',       svg: generateStarSVG },
        { name: 'Delfin',      svg: generateDolphinSVG },
    ];

    // --- SVG generators (unchanged) ---

    function generateUnicornSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs><radialGradient id="ug" cx="50%" cy="40%"><stop offset="0%" stop-color="#fce4ff"/><stop offset="100%" stop-color="#e0b0ff"/></radialGradient></defs>
            <rect width="200" height="200" fill="url(#ug)"/>
            <ellipse cx="100" cy="190" rx="95" ry="20" fill="#55efc4"/>
            <ellipse cx="100" cy="132" rx="48" ry="36" fill="#fff" stroke="#e0d4f5" stroke-width="1.5"/>
            <rect x="68" y="155" width="12" height="30" rx="5" fill="#fff" stroke="#e0d4f5" stroke-width="1"/>
            <rect x="84" y="158" width="12" height="30" rx="5" fill="#f8f8f8" stroke="#e0d4f5" stroke-width="1"/>
            <rect x="104" y="158" width="12" height="30" rx="5" fill="#f8f8f8" stroke="#e0d4f5" stroke-width="1"/>
            <rect x="120" y="155" width="12" height="30" rx="5" fill="#fff" stroke="#e0d4f5" stroke-width="1"/>
            <ellipse cx="100" cy="78" rx="28" ry="26" fill="#fff" stroke="#e0d4f5" stroke-width="1.5"/>
            <polygon points="100,18 94,52 106,52" fill="#feca57" stroke="#f39c12" stroke-width="1"/>
            <ellipse cx="80" cy="58" rx="8" ry="12" fill="#fff" stroke="#e0d4f5" stroke-width="1" transform="rotate(-15 80 58)"/>
            <ellipse cx="120" cy="58" rx="8" ry="12" fill="#fff" stroke="#e0d4f5" stroke-width="1" transform="rotate(15 120 58)"/>
            <circle cx="89" cy="76" r="5" fill="#2d3436"/><circle cx="90" cy="74" r="2" fill="#fff"/>
            <circle cx="111" cy="76" r="5" fill="#2d3436"/><circle cx="112" cy="74" r="2" fill="#fff"/>
            <ellipse cx="82" cy="84" rx="6" ry="3" fill="#ffb8d0" opacity="0.5"/>
            <ellipse cx="118" cy="84" rx="6" ry="3" fill="#ffb8d0" opacity="0.5"/>
            <path d="M 95 87 Q 100 92 105 87" stroke="#e17055" fill="none" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M 76 62 Q 58 50 62 35" stroke="#ff6b6b" fill="none" stroke-width="4" stroke-linecap="round"/>
            <path d="M 78 66 Q 55 58 56 42" stroke="#feca57" fill="none" stroke-width="4" stroke-linecap="round"/>
            <path d="M 80 70 Q 52 66 50 50" stroke="#48dbfb" fill="none" stroke-width="4" stroke-linecap="round"/>
            <path d="M 148 125 Q 170 110 175 90" stroke="#ff6b6b" fill="none" stroke-width="3" stroke-linecap="round"/>
            <path d="M 148 130 Q 172 118 180 98" stroke="#feca57" fill="none" stroke-width="3" stroke-linecap="round"/>
            <path d="M 148 135 Q 174 126 185 106" stroke="#54a0ff" fill="none" stroke-width="3" stroke-linecap="round"/>
        </svg>`;
    }

    function generateRainbowSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#74b9ff"/><stop offset="100%" stop-color="#dfe6e9"/></linearGradient></defs>
            <rect width="200" height="200" fill="url(#sky)"/>
            <circle cx="160" cy="35" r="22" fill="#feca57" opacity="0.9"/>
            <path d="M 10 165 A 90 90 0 0 1 190 165" fill="none" stroke="#ff6b6b" stroke-width="10"/>
            <path d="M 20 165 A 80 80 0 0 1 180 165" fill="none" stroke="#ff9f43" stroke-width="10"/>
            <path d="M 30 165 A 70 70 0 0 1 170 165" fill="none" stroke="#feca57" stroke-width="10"/>
            <path d="M 40 165 A 60 60 0 0 1 160 165" fill="none" stroke="#00b894" stroke-width="10"/>
            <path d="M 50 165 A 50 50 0 0 1 150 165" fill="none" stroke="#54a0ff" stroke-width="10"/>
            <path d="M 60 165 A 40 40 0 0 1 140 165" fill="none" stroke="#a29bfe" stroke-width="10"/>
            <ellipse cx="35" cy="55" rx="22" ry="14" fill="#fff" opacity="0.9"/>
            <ellipse cx="50" cy="48" rx="18" ry="12" fill="#fff" opacity="0.9"/>
            <ellipse cx="22" cy="50" rx="15" ry="10" fill="#fff" opacity="0.85"/>
            <ellipse cx="100" cy="195" rx="100" ry="15" fill="#55efc4"/>
            <circle cx="30" cy="180" r="4" fill="#ff6b6b"/><circle cx="30" cy="180" r="1.5" fill="#feca57"/>
            <circle cx="80" cy="183" r="4" fill="#ff9ff3"/><circle cx="80" cy="183" r="1.5" fill="#feca57"/>
            <circle cx="140" cy="181" r="4" fill="#54a0ff"/><circle cx="140" cy="181" r="1.5" fill="#feca57"/>
        </svg>`;
    }

    function generateRocketSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs><radialGradient id="space" cx="50%" cy="50%"><stop offset="0%" stop-color="#2d3436"/><stop offset="100%" stop-color="#0c0c1d"/></radialGradient></defs>
            <rect width="200" height="200" fill="url(#space)"/>
            <circle cx="20" cy="20" r="1.5" fill="#fff"/><circle cx="50" cy="45" r="1" fill="#fff"/>
            <circle cx="170" cy="25" r="2" fill="#feca57"/><circle cx="155" cy="60" r="1" fill="#fff"/>
            <circle cx="25" cy="100" r="1" fill="#fff"/><circle cx="180" cy="110" r="1.5" fill="#fff"/>
            <circle cx="35" cy="155" r="1" fill="#fff"/><circle cx="170" cy="165" r="1" fill="#feca57"/>
            <circle cx="155" cy="160" r="15" fill="#a29bfe" opacity="0.6"/>
            <path d="M 100 30 Q 115 50 118 90 L 118 130 Q 118 140 100 145 Q 82 140 82 130 L 82 90 Q 85 50 100 30" fill="#dfe6e9" stroke="#b2bec3" stroke-width="1"/>
            <path d="M 100 30 Q 110 45 112 65 L 88 65 Q 90 45 100 30" fill="#ff6b6b"/>
            <circle cx="100" cy="85" r="12" fill="#0984e3" stroke="#b2bec3" stroke-width="2"/>
            <circle cx="100" cy="85" r="8" fill="#74b9ff"/>
            <path d="M 82 115 L 60 140 L 75 140 L 82 128" fill="#ff6b6b"/>
            <path d="M 118 115 L 140 140 L 125 140 L 118 128" fill="#ff6b6b"/>
            <path d="M 88 145 Q 94 170 100 185 Q 106 170 112 145" fill="#ff9f43" opacity="0.9"/>
            <path d="M 92 145 Q 96 165 100 175 Q 104 165 108 145" fill="#feca57"/>
        </svg>`;
    }

    function generateCatSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#ffeaa7"/>
            <ellipse cx="100" cy="140" rx="42" ry="35" fill="#fdcb6e" stroke="#f39c12" stroke-width="1"/>
            <path d="M 142 135 Q 170 120 175 95 Q 178 80 170 75" stroke="#fdcb6e" fill="none" stroke-width="10" stroke-linecap="round"/>
            <ellipse cx="72" cy="172" rx="14" ry="8" fill="#fdcb6e" stroke="#f39c12" stroke-width="1"/>
            <ellipse cx="128" cy="172" rx="14" ry="8" fill="#fdcb6e" stroke="#f39c12" stroke-width="1"/>
            <ellipse cx="80" cy="168" rx="10" ry="7" fill="#fdcb6e" stroke="#f39c12" stroke-width="1"/>
            <ellipse cx="120" cy="168" rx="10" ry="7" fill="#fdcb6e" stroke="#f39c12" stroke-width="1"/>
            <circle cx="100" cy="82" r="34" fill="#fdcb6e" stroke="#f39c12" stroke-width="1"/>
            <polygon points="72,56 60,22 90,46" fill="#fdcb6e" stroke="#f39c12" stroke-width="1"/>
            <polygon points="128,56 140,22 110,46" fill="#fdcb6e" stroke="#f39c12" stroke-width="1"/>
            <polygon points="74,54 66,30 87,47" fill="#fab1a0" opacity="0.5"/>
            <polygon points="126,54 134,30 113,47" fill="#fab1a0" opacity="0.5"/>
            <ellipse cx="86" cy="78" rx="7" ry="8" fill="#fff"/>
            <ellipse cx="114" cy="78" rx="7" ry="8" fill="#fff"/>
            <circle cx="87" cy="79" r="5" fill="#2d3436"/><circle cx="89" cy="77" r="2" fill="#fff"/>
            <circle cx="113" cy="79" r="5" fill="#2d3436"/><circle cx="115" cy="77" r="2" fill="#fff"/>
            <path d="M 97 90 L 100 93 L 103 90" fill="#fab1a0"/>
            <path d="M 93 98 Q 100 103 107 98" stroke="#e17055" fill="none" stroke-width="1" stroke-linecap="round"/>
            <line x1="60" y1="86" x2="82" y2="90" stroke="#2d3436" stroke-width="1" opacity="0.4"/>
            <line x1="58" y1="92" x2="82" y2="93" stroke="#2d3436" stroke-width="1" opacity="0.4"/>
            <line x1="118" y1="90" x2="140" y2="86" stroke="#2d3436" stroke-width="1" opacity="0.4"/>
            <line x1="118" y1="93" x2="142" y2="92" stroke="#2d3436" stroke-width="1" opacity="0.4"/>
        </svg>`;
    }

    function generateStarSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="starbg" cx="50%" cy="50%"><stop offset="0%" stop-color="#1a1a3e"/><stop offset="100%" stop-color="#0c0c1d"/></radialGradient>
                <radialGradient id="starglow" cx="50%" cy="50%"><stop offset="0%" stop-color="#feca57" stop-opacity="0.3"/><stop offset="100%" stop-color="#feca57" stop-opacity="0"/></radialGradient>
            </defs>
            <rect width="200" height="200" fill="url(#starbg)"/>
            <circle cx="25" cy="30" r="1" fill="#fff"/><circle cx="175" cy="20" r="1.5" fill="#fff"/>
            <circle cx="15" cy="100" r="1" fill="#fff"/><circle cx="185" cy="90" r="1" fill="#fff"/>
            <circle cx="30" cy="170" r="1" fill="#fff"/><circle cx="170" cy="175" r="1.5" fill="#fff"/>
            <circle cx="100" cy="95" r="60" fill="url(#starglow)"/>
            <polygon points="100,15 118,72 180,78 130,118 146,178 100,143 54,178 70,118 20,78 82,72" fill="#feca57" stroke="#f39c12" stroke-width="1"/>
            <polygon points="100,35 112,75 155,80 122,110 133,158 100,133 67,158 78,110 45,80 88,75" fill="#fdcb6e"/>
            <circle cx="88" cy="92" r="4.5" fill="#2d3436"/><circle cx="89" cy="91" r="1.8" fill="#fff"/>
            <circle cx="112" cy="92" r="4.5" fill="#2d3436"/><circle cx="113" cy="91" r="1.8" fill="#fff"/>
            <path d="M 92 105 Q 100 114 108 105" stroke="#f39c12" fill="none" stroke-width="2" stroke-linecap="round"/>
        </svg>`;
    }

    function generateDolphinSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#74b9ff"/><stop offset="60%" stop-color="#0984e3"/><stop offset="100%" stop-color="#0652DD"/></linearGradient></defs>
            <rect width="200" height="200" fill="url(#ocean)"/>
            <path d="M 0 80 Q 25 70 50 80 Q 75 90 100 80 Q 125 70 150 80 Q 175 90 200 80 L 200 200 L 0 200Z" fill="#0984e3" opacity="0.3"/>
            <path d="M 160 85 Q 175 65 160 48 Q 140 32 115 42 Q 85 55 55 75 Q 30 90 38 108 Q 48 128 75 122 Q 95 116 125 105 Q 150 95 160 85" fill="#48dbfb" stroke="#34a8d4" stroke-width="1"/>
            <path d="M 145 82 Q 130 95 95 108 Q 70 118 55 112 Q 42 105 48 92 Q 60 80 90 70 Q 120 58 145 55" fill="#dfe6e9" opacity="0.6"/>
            <path d="M 110 55 Q 105 28 118 22 Q 120 35 115 50" fill="#48dbfb"/>
            <path d="M 38 108 Q 18 95 15 78" fill="#48dbfb"/>
            <path d="M 15 78 Q 8 70 12 60 Q 20 72 28 80" fill="#48dbfb"/>
            <path d="M 15 78 Q 5 85 8 95 Q 18 88 25 85" fill="#48dbfb"/>
            <circle cx="145" cy="58" r="5" fill="#fff"/><circle cx="146" cy="58" r="3.5" fill="#2d3436"/><circle cx="147" cy="57" r="1.5" fill="#fff"/>
            <path d="M 165 62 Q 170 65 165 68" stroke="#2d3436" fill="none" stroke-width="1" stroke-linecap="round"/>
            <circle cx="160" cy="95" r="3" fill="#fff" opacity="0.3"/>
            <circle cx="150" cy="105" r="2" fill="#fff" opacity="0.25"/>
            <path d="M 0 155 Q 30 145 60 155 Q 90 165 120 155 Q 150 145 180 155 Q 195 160 200 158 L 200 200 L 0 200Z" fill="#0652DD" opacity="0.3"/>
        </svg>`;
    }

    // --- Rendering ---

    function getPuzzleCount() {
        return PUZZLES.length;
    }

    function getPuzzle(index) {
        return PUZZLES[index % PUZZLES.length];
    }

    // Generate a shuffled order for displaying pieces (scrambled positions)
    function getShuffledPositions(pieceCount) {
        const positions = [];
        for (let i = 0; i < pieceCount; i++) positions.push(i);
        // Fisher-Yates shuffle
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        return positions;
    }

    function renderPuzzleGrid(container, puzzleIndex, revealedPieces, shuffledOrder) {
        const puzzle = getPuzzle(puzzleIndex);
        container.innerHTML = '';

        const title = document.createElement('h3');
        title.textContent = puzzle.name;
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'puzzle-grid puzzle-grid-2x2';

        const isComplete = revealedPieces >= PIECES_PER_PUZZLE;

        for (let slot = 0; slot < PIECES_PER_PUZZLE; slot++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';

            // Which actual quadrant goes in this slot?
            // When complete, each slot shows its own quadrant (correct position)
            // When incomplete, use shuffled order
            const quadrantIndex = isComplete ? slot : (shuffledOrder ? shuffledOrder[slot] : slot);
            const isRevealed = isComplete ? true : (slot < revealedPieces);

            if (isRevealed) {
                piece.classList.add('revealed');
                // Show the SVG offset to reveal this quadrant
                const svgWrap = document.createElement('div');
                svgWrap.className = 'puzzle-piece-svg';
                svgWrap.innerHTML = puzzle.svg();
                const q = QUADRANTS[quadrantIndex];
                svgWrap.style.transform = `translate(${q.tx}, ${q.ty})`;
                piece.appendChild(svgWrap);

                if (isComplete) {
                    piece.classList.add('solved');
                }
            } else {
                piece.classList.add('hidden');
                piece.innerHTML = '<span class="puzzle-piece-placeholder">?</span>';
            }

            grid.appendChild(piece);
        }

        container.appendChild(grid);

        if (isComplete) {
            const label = document.createElement('div');
            label.className = 'puzzle-complete-label';
            label.textContent = 'Fertig! 🎉';
            container.appendChild(label);
        } else {
            const progress = document.createElement('div');
            progress.style.cssText = 'color:#636e72;font-weight:600;margin-top:0.5rem;';
            progress.textContent = `${revealedPieces}/${PIECES_PER_PUZZLE} Teile`;
            container.appendChild(progress);
        }
    }

    function renderAllPuzzles(container, gameState) {
        container.innerHTML = '';

        const totalPuzzles = Math.max(gameState.currentPuzzleIndex + 1, gameState.completedPuzzles.length + 1);

        for (let i = 0; i < totalPuzzles && i < PUZZLES.length; i++) {
            const card = document.createElement('div');
            card.className = 'puzzle-card';

            const isCompleted = gameState.completedPuzzles.includes(i);
            const isCurrent = i === gameState.currentPuzzleIndex;
            const pieces = isCompleted ? PIECES_PER_PUZZLE : (isCurrent ? gameState.puzzlePieces : 0);

            // Use stored shuffle order for current puzzle, or generate stable one
            const order = (isCurrent && gameState.puzzleShuffleOrder)
                ? gameState.puzzleShuffleOrder
                : getShuffledPositions(PIECES_PER_PUZZLE);

            renderPuzzleGrid(card, i, pieces, order);
            container.appendChild(card);
        }

        if (totalPuzzles === 0) {
            container.innerHTML = '<p style="text-align:center;color:#636e72;font-size:1.2rem;padding:3rem;">Sammle Punkte um Puzzleteile freizuschalten!</p>';
        }
    }

    return {
        PIECES_PER_PUZZLE,
        STREAK_FOR_PIECE,
        getPuzzleCount,
        getPuzzle,
        getShuffledPositions,
        renderPuzzleGrid,
        renderAllPuzzles,
    };
})();
