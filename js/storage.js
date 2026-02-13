/* ============================================
   LocalStorage - Spielstand Persistenz
   ============================================ */

const Storage = (() => {
    const STORAGE_KEY = 'silbenteppich_save';

    const DEFAULT_STATE = {
        currentLevel: 1,
        totalScore: 0,
        correctStreak: 0,
        errorStreak: 0,
        totalCorrect: 0,
        totalWrong: 0,
        totalRounds: 0,
        puzzlePieces: 0,         // Pieces toward current puzzle
        completedPuzzles: [],    // Array of completed puzzle indices
        currentPuzzleIndex: 0,
        puzzleShuffleOrder: null, // Shuffled positions for current puzzle pieces
        difficultSyllables: {},  // { syllable: errorCount }
    };

    function load() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                // Merge with defaults for any missing fields
                return { ...DEFAULT_STATE, ...parsed };
            }
        } catch (e) {
            console.warn('Spielstand konnte nicht geladen werden:', e);
        }
        return { ...DEFAULT_STATE };
    }

    function save(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('Spielstand konnte nicht gespeichert werden:', e);
        }
    }

    function hasSaveData() {
        return localStorage.getItem(STORAGE_KEY) !== null;
    }

    function reset() {
        localStorage.removeItem(STORAGE_KEY);
        return { ...DEFAULT_STATE };
    }

    return { load, save, hasSaveData, reset, DEFAULT_STATE };
})();
