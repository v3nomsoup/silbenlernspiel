/* ============================================
   Silbenteppich - Hauptspiellogik
   ============================================ */

const Game = (() => {
    // State
    let state = null;
    let currentTarget = null;       // Current syllable/word to find
    let currentTargetDisplay = '';   // What to show in UI
    let currentWordSyllables = [];  // For word mode: syllables to click in order
    let nextSyllableIndex = 0;      // For word mode: which syllable is next
    let roundStartTime = 0;
    let isProcessing = false;       // Prevent double-clicks
    let gridTiles = [];

    // Session-level tracking: prevent word/syllable repetition
    let usedTargets = new Set();       // Targets already shown this session (per level)
    let retriedTargets = new Set();    // Targets retried after error (only 1 retry allowed)
    let currentLevelForTracking = 0;   // Reset tracking on level change

    // DOM Elements
    const screens = {
        start: document.getElementById('start-screen'),
        game: document.getElementById('game-screen'),
        puzzle: document.getElementById('puzzle-screen'),
    };

    const el = {
        btnStart: document.getElementById('btn-start'),
        btnContinue: document.getElementById('btn-continue'),
        btnHome: document.getElementById('btn-home'),
        btnPuzzle: document.getElementById('btn-puzzle'),
        btnReplay: document.getElementById('btn-replay'),
        btnBackGame: document.getElementById('btn-back-game'),
        startStats: document.getElementById('start-stats'),
        levelBadge: document.getElementById('level-badge'),
        levelName: document.getElementById('level-name'),
        scoreDisplay: document.getElementById('score-display'),
        streakDisplay: document.getElementById('streak-display'),
        puzzleProgress: document.getElementById('puzzle-progress'),
        targetSyllable: document.getElementById('target-syllable'),
        syllableGrid: document.getElementById('syllable-grid'),
        feedbackOverlay: document.getElementById('feedback-overlay'),
        levelupOverlay: document.getElementById('levelup-overlay'),
        levelupText: document.getElementById('levelup-text'),
        levelupSub: document.getElementById('levelup-sub'),
        confettiCanvas: document.getElementById('confetti-canvas'),
        puzzleContainer: document.getElementById('puzzle-container'),
    };

    // ==========================================
    // Initialization
    // ==========================================
    async function init() {
        await Speech.init();
        setupEventListeners();

        // Check for saved game
        if (Storage.hasSaveData()) {
            el.btnContinue.style.display = '';
            state = Storage.load();
            showStartStats();
        }
    }

    function setupEventListeners() {
        el.btnStart.addEventListener('click', () => startGame(true));
        el.btnContinue.addEventListener('click', () => startGame(false));
        el.btnHome.addEventListener('click', goHome);
        el.btnPuzzle.addEventListener('click', showPuzzleScreen);
        el.btnReplay.addEventListener('click', replaySpeech);
        el.btnBackGame.addEventListener('click', () => showScreen('game'));
    }

    function showStartStats() {
        if (state && state.totalRounds > 0) {
            const accuracy = state.totalCorrect + state.totalWrong > 0
                ? Math.round(state.totalCorrect / (state.totalCorrect + state.totalWrong) * 100)
                : 0;
            const level = getLevelConfig(state.currentLevel);
            el.startStats.style.display = '';
            el.startStats.innerHTML =
                `Level ${state.currentLevel}: ${level.name}<br>` +
                `${state.totalScore} Punkte | ${accuracy}% richtig | ` +
                `${state.completedPuzzles.length} Puzzles fertig`;
        }
    }

    // ==========================================
    // Screen Management
    // ==========================================
    function showScreen(name) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[name].classList.add('active');
    }

    function goHome() {
        if (state) Storage.save(state);
        showScreen('start');
        showStartStats();
        el.btnContinue.style.display = '';
    }

    // ==========================================
    // Game Start
    // ==========================================
    function startGame(isNew) {
        if (isNew) {
            state = Storage.reset();
        } else {
            state = Storage.load();
        }

        // Initialize random puzzle order if not set
        if (!state.puzzleOrder) {
            state.puzzleOrder = Puzzle.generatePuzzleOrder();
            Storage.save(state);
        }

        // Reset session tracking
        usedTargets.clear();
        retriedTargets.clear();
        currentLevelForTracking = state.currentLevel;

        showScreen('game');
        updateUI();
        nextRound();
    }

    // ==========================================
    // UI Updates
    // ==========================================
    function updateUI() {
        const level = getLevelConfig(state.currentLevel);
        el.levelBadge.textContent = `Level ${state.currentLevel}`;
        el.levelName.textContent = level.name;
        el.scoreDisplay.textContent = `${state.totalScore} Punkte`;
        el.puzzleProgress.textContent = `${state.puzzlePieces}/${Puzzle.PIECES_PER_PUZZLE}`;

        if (state.correctStreak >= 3) {
            const mult = getStreakMultiplier(state.correctStreak);
            el.streakDisplay.textContent = `🔥 x${mult}`;
        } else {
            el.streakDisplay.textContent = '';
        }
    }

    // ==========================================
    // Round Logic
    // ==========================================
    function nextRound() {
        isProcessing = false;
        const level = getLevelConfig(state.currentLevel);

        // Reset session tracking when level changes
        if (state.currentLevel !== currentLevelForTracking) {
            usedTargets.clear();
            retriedTargets.clear();
            currentLevelForTracking = state.currentLevel;
        }

        const syllables = getSyllablesForLevel(level);

        if (level.type === 'word') {
            setupWordRound(level, syllables);
        } else {
            setupSyllableRound(level, syllables);
        }

        roundStartTime = Date.now();
    }

    function setupSyllableRound(level, allSyllables) {
        const gridSize = level.gridCols * level.gridRows;

        // Filter out already-used syllables (unless all have been used)
        let available = allSyllables.filter(s => !usedTargets.has(s.toLowerCase()));
        if (available.length === 0) {
            usedTargets.clear();
            retriedTargets.clear();
            available = allSyllables;
        }

        // Pick random syllables for the grid, weighting difficult ones
        const selected = pickSyllables(allSyllables, gridSize, state.difficultSyllables);

        // Pick the target from available (unused) syllables that are in the grid
        const availableInGrid = selected.filter(s => !usedTargets.has(s.toLowerCase()));
        const targetPool = availableInGrid.length > 0 ? availableInGrid : selected;
        const targetIdx = Math.floor(Math.random() * targetPool.length);
        currentTarget = targetPool[targetIdx];
        currentTargetDisplay = currentTarget;
        currentWordSyllables = [];
        nextSyllableIndex = 0;

        // Mark as used
        usedTargets.add(currentTarget.toLowerCase());

        // Display target
        el.targetSyllable.textContent = currentTarget;

        // Render grid
        renderGrid(selected, level.gridCols);

        // Speak
        Speech.speakSyllable(currentTarget);
    }

    function setupWordRound(level, wordList) {
        const gridSize = level.gridCols * level.gridRows;

        // Filter out already-used words (unless all have been used)
        let available = wordList.filter(w => !usedTargets.has(w.word.toLowerCase()));
        if (available.length === 0) {
            usedTargets.clear();
            retriedTargets.clear();
            available = wordList;
        }

        // Pick a random word from available
        const wordObj = available[Math.floor(Math.random() * available.length)];

        // Mark as used
        usedTargets.add(wordObj.word.toLowerCase());
        currentTarget = wordObj.word;
        currentWordSyllables = wordObj.syllables;
        nextSyllableIndex = 0;

        // Display: "Na-se"
        currentTargetDisplay = wordObj.syllables.join('-');
        el.targetSyllable.innerHTML = '';
        wordObj.syllables.forEach((syl, i) => {
            if (i > 0) {
                const sep = document.createElement('span');
                sep.className = 'syllable-separator';
                sep.textContent = '-';
                el.targetSyllable.appendChild(sep);
            }
            const part = document.createElement('span');
            part.className = 'syllable-part';
            part.id = `target-part-${i}`;
            part.textContent = syl;
            el.targetSyllable.appendChild(part);
        });

        // Build grid: include all target syllables + random distractors
        const targetSyls = [...wordObj.syllables];
        const distractors = generateDistractors(targetSyls, allSyllablesForDistraction(level), gridSize - targetSyls.length);
        const allTiles = shuffleArray([...targetSyls, ...distractors]);

        renderGrid(allTiles, level.gridCols);

        // Speak the word
        Speech.speakWordWithSyllables(wordObj.word, wordObj.syllables);
    }

    function allSyllablesForDistraction(level) {
        // Get a mix of syllables for distractors
        const open = SYLLABLE_DATA.openSyllables;
        const closed = SYLLABLE_DATA.closedSyllables;

        // Also grab syllables from other words at this level
        const words = SYLLABLE_DATA[level.dataKey] || [];
        const wordSyls = words.flatMap(w => w.syllables || []);

        return [...new Set([...open, ...closed, ...wordSyls])];
    }

    function generateDistractors(targetSyls, allSyls, count) {
        const targetSet = new Set(targetSyls.map(s => s.toLowerCase()));
        const available = allSyls.filter(s => !targetSet.has(s.toLowerCase()));
        const result = [];

        for (let i = 0; i < count && available.length > 0; i++) {
            const idx = Math.floor(Math.random() * available.length);
            result.push(available[idx]);
            available.splice(idx, 1);
        }

        // If we need more, generate random syllables
        const consonants = 'bcdfghjklmnprstvw';
        const vowels = 'aeiou';
        while (result.length < count) {
            const syl = consonants[Math.floor(Math.random() * consonants.length)] +
                        vowels[Math.floor(Math.random() * vowels.length)];
            if (!targetSet.has(syl) && !result.includes(syl)) {
                result.push(syl);
            }
        }

        return result;
    }

    function pickSyllables(allSyllables, count, difficultMap) {
        // Weight difficult syllables to appear more often
        const weighted = [];
        allSyllables.forEach(s => {
            const errCount = difficultMap[s.toLowerCase()] || 0;
            const weight = 1 + Math.min(errCount, 3); // Max 4x weight
            for (let i = 0; i < weight; i++) {
                weighted.push(s);
            }
        });

        const selected = new Set();
        let attempts = 0;
        while (selected.size < count && attempts < 500) {
            const pick = weighted[Math.floor(Math.random() * weighted.length)];
            selected.add(pick);
            attempts++;
        }

        // If not enough unique, fill from all
        while (selected.size < count) {
            selected.add(allSyllables[Math.floor(Math.random() * allSyllables.length)]);
        }

        return shuffleArray([...selected]);
    }

    // ==========================================
    // Grid Rendering
    // ==========================================
    function renderGrid(syllables, cols) {
        el.syllableGrid.innerHTML = '';
        // In portrait mode, swap cols/rows for better space usage
        const isPortrait = window.innerHeight > window.innerWidth;
        const rows = Math.ceil(syllables.length / cols);
        const effectiveCols = isPortrait && rows < cols ? rows : cols;
        el.syllableGrid.style.gridTemplateColumns = `repeat(${effectiveCols}, 1fr)`;
        gridTiles = [];

        syllables.forEach((syl, i) => {
            const tile = document.createElement('button');
            tile.className = `syllable-tile color-${i % 12}`;
            tile.textContent = syl;
            tile.dataset.syllable = syl;
            tile.addEventListener('click', () => handleTileClick(tile, syl));
            el.syllableGrid.appendChild(tile);
            gridTiles.push(tile);
        });
    }

    // ==========================================
    // Click Handling
    // ==========================================
    function handleTileClick(tile, clickedSyllable) {
        if (isProcessing) return;

        const level = getLevelConfig(state.currentLevel);

        if (level.type === 'word') {
            handleWordClick(tile, clickedSyllable);
        } else {
            handleSyllableClick(tile, clickedSyllable);
        }
    }

    async function handleSyllableClick(tile, clickedSyllable) {
        isProcessing = true;

        // 1. Read the clicked syllable aloud and wait
        await Speech.speakSyllable(clickedSyllable);
        await new Promise(r => setTimeout(r, 300));

        // 2. Then show feedback
        const isCorrect = clickedSyllable.toLowerCase() === currentTarget.toLowerCase();
        if (isCorrect) {
            onCorrectAnswer(tile);
        } else {
            onWrongAnswer(tile, clickedSyllable);
        }
    }

    async function handleWordClick(tile, clickedSyllable) {
        const expectedSyllable = currentWordSyllables[nextSyllableIndex];
        const isCorrect = clickedSyllable.toLowerCase() === expectedSyllable.toLowerCase();

        // 1. Read the clicked syllable aloud and wait
        await Speech.speakSyllable(clickedSyllable);

        if (isCorrect) {
            tile.classList.add('correct', 'disabled');

            // Highlight the matched part in the target display
            const partEl = document.getElementById(`target-part-${nextSyllableIndex}`);
            if (partEl) {
                partEl.style.color = '#00b894';
                partEl.style.fontWeight = '900';
            }

            nextSyllableIndex++;

            if (nextSyllableIndex >= currentWordSyllables.length) {
                // All syllables found - pause then feedback
                isProcessing = true;
                await new Promise(r => setTimeout(r, 300));
                onCorrectAnswer(tile);
            }
        } else {
            isProcessing = true;
            await new Promise(r => setTimeout(r, 300));
            onWrongAnswer(tile, clickedSyllable);
        }
    }

    // ==========================================
    // Correct / Wrong Handling
    // ==========================================
    async function onCorrectAnswer(tile) {
        tile.classList.add('correct');
        disableAllTiles();

        // Calculate points
        const elapsed = (Date.now() - roundStartTime) / 1000;
        let points = 100;
        if (elapsed < 2) points += 50;
        else if (elapsed < 4) points += 25;
        else if (elapsed < 6) points += 10;

        // Streak
        state.correctStreak++;
        state.errorStreak = 0;
        const multiplier = getStreakMultiplier(state.correctStreak);
        points = Math.round(points * multiplier);

        // Update state
        state.totalScore += points;
        state.totalCorrect++;
        state.totalRounds++;

        // Confetti on streaks
        if (state.correctStreak >= 3) {
            launchConfetti();
        }

        // Check puzzle piece
        const puzzleResult = checkPuzzlePiece();

        updateUI();
        Storage.save(state);

        // Show feedback and WAIT for speech to finish
        const msgObj = SYLLABLE_DATA.encourageMessages[
            Math.floor(Math.random() * SYLLABLE_DATA.encourageMessages.length)
        ];
        showFeedback(msgObj.text, 'correct');
        await Speech.speakFeedback(msgObj.speech);

        // Announce puzzle piece if earned
        if (puzzleResult === 'complete') {
            showFeedback('Puzzle fertig! 🎉', 'correct');
            await Speech.speakAfterCurrent('Puzzle fertig! Toll gemacht!');
        } else if (puzzleResult === 'piece') {
            showFeedback('Neues Puzzleteil! 🧩', 'correct');
            await Speech.speakAfterCurrent('Neues Puzzleteil!');
        }

        // Small pause after speech so it feels natural
        await new Promise(r => setTimeout(r, 400));
        hideFeedback();

        // Check level up
        const level = getLevelConfig(state.currentLevel);
        if (state.correctStreak >= level.streakToAdvance && state.currentLevel < getMaxLevel()) {
            showLevelUp();
        } else {
            nextRound();
        }
    }

    async function onWrongAnswer(tile, clickedSyllable) {
        tile.classList.add('wrong');

        // Track difficult syllable
        const key = (currentTarget || clickedSyllable).toLowerCase();
        state.difficultSyllables[key] = (state.difficultSyllables[key] || 0) + 1;

        // Streak
        state.errorStreak++;
        state.correctStreak = 0;
        state.totalWrong++;
        state.totalRounds++;

        updateUI();
        Storage.save(state);

        // Show comfort message and WAIT for speech to finish
        const msgObj = SYLLABLE_DATA.comfortMessages[
            Math.floor(Math.random() * SYLLABLE_DATA.comfortMessages.length)
        ];
        showFeedback(msgObj.text, 'wrong');
        await Speech.speakFeedback(msgObj.speech);

        // Small pause after speech
        await new Promise(r => setTimeout(r, 400));
        hideFeedback();

        // Check level down
        const level = getLevelConfig(state.currentLevel);
        if (state.errorStreak >= level.errorsToRegress && state.currentLevel > 1) {
            showLevelDown();
        } else {
            // Allow one retry: re-add to available targets if not already retried
            const targetKey = currentTarget.toLowerCase();
            if (!retriedTargets.has(targetKey)) {
                retriedTargets.add(targetKey);
                usedTargets.delete(targetKey);
            }
            // Re-speak the target so the child can try again
            await Speech.speakSyllable(currentTarget);
            isProcessing = false;
        }
    }

    // ==========================================
    // Level Up / Down
    // ==========================================
    async function showLevelUp() {
        state.currentLevel = Math.min(state.currentLevel + 1, getMaxLevel());
        state.correctStreak = 0;
        state.errorStreak = 0;
        Storage.save(state);

        const level = getLevelConfig(state.currentLevel);
        el.levelupText.textContent = 'Super! ⭐';
        el.levelupSub.textContent = `Level ${state.currentLevel}: ${level.name}`;
        el.levelupOverlay.classList.add('show');

        launchConfetti();
        await Speech.speak('Super! Nächstes Level!');
        await new Promise(r => setTimeout(r, 800));

        el.levelupOverlay.classList.remove('show');
        updateUI();
        nextRound();
    }

    async function showLevelDown() {
        state.currentLevel = Math.max(state.currentLevel - 1, 1);
        state.correctStreak = 0;
        state.errorStreak = 0;
        Storage.save(state);

        const level = getLevelConfig(state.currentLevel);
        el.levelupText.textContent = 'Kein Problem! 💪';
        el.levelupSub.textContent = `Wir üben nochmal: ${level.name}`;
        el.levelupOverlay.classList.add('show');

        await Speech.speak('Kein Problem! Wir üben nochmal!');
        await new Promise(r => setTimeout(r, 800));

        el.levelupOverlay.classList.remove('show');
        updateUI();
        nextRound();
    }

    // ==========================================
    // Puzzle Pieces
    // ==========================================
    function checkPuzzlePiece() {
        // Award puzzle piece when streak reaches threshold (5 in a row)
        if (state.correctStreak > 0 && state.correctStreak % Puzzle.STREAK_FOR_PIECE === 0) {
            state.puzzlePieces++;

            // Generate shuffle order when earning the first piece of a new puzzle
            if (state.puzzlePieces === 1 && !state.puzzleShuffleOrder) {
                state.puzzleShuffleOrder = Puzzle.getShuffledPositions(Puzzle.PIECES_PER_PUZZLE);
            }

            if (state.puzzlePieces >= Puzzle.PIECES_PER_PUZZLE) {
                state.completedPuzzles.push(state.currentPuzzleIndex);
                state.currentPuzzleIndex++;
                state.puzzlePieces = 0;
                state.puzzleShuffleOrder = null;
                return 'complete';
            }
            return 'piece';
        }
        return null;
    }

    // ==========================================
    // Feedback
    // ==========================================
    function showFeedback(text, type) {
        el.feedbackOverlay.textContent = text;
        el.feedbackOverlay.className = `feedback-overlay show ${type}`;
    }

    function hideFeedback() {
        el.feedbackOverlay.className = 'feedback-overlay';
    }

    function disableAllTiles() {
        gridTiles.forEach(t => t.classList.add('disabled'));
    }

    // ==========================================
    // Speech Replay
    // ==========================================
    function replaySpeech() {
        const level = getLevelConfig(state.currentLevel);
        if (level.type === 'word' && currentWordSyllables.length > 0) {
            Speech.speakWordWithSyllables(currentTarget, currentWordSyllables);
        } else {
            Speech.speakSyllable(currentTarget);
        }
    }

    // ==========================================
    // Puzzle Screen
    // ==========================================
    function showPuzzleScreen() {
        Puzzle.renderAllPuzzles(el.puzzleContainer, state);
        showScreen('puzzle');
    }

    // ==========================================
    // Confetti
    // ==========================================
    function launchConfetti() {
        const canvas = el.confettiCanvas;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#00b894', '#fdcb6e'];

        for (let i = 0; i < 80; i++) {
            particles.push({
                x: canvas.width / 2 + (Math.random() - 0.5) * 200,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 12,
                vy: -Math.random() * 15 - 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                life: 1,
            });
        }

        let animFrame;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;

            particles.forEach(p => {
                if (p.life <= 0) return;
                alive = true;

                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.4; // gravity
                p.rotation += p.rotationSpeed;
                p.life -= 0.015;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });

            if (alive) {
                animFrame = requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cancelAnimationFrame(animFrame);
            }
        }

        animate();
    }

    // ==========================================
    // Helpers
    // ==========================================
    function getStreakMultiplier(streak) {
        if (streak >= 10) return 3;
        if (streak >= 7) return 2.5;
        if (streak >= 5) return 2;
        if (streak >= 3) return 1.5;
        return 1;
    }

    function shuffleArray(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    return { init };
})();

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => Game.init());
