/* ============================================
   Level-Definitionen & Schwierigkeitsgrade
   ============================================ */

const LEVELS = [
    {
        id: 1,
        name: 'Offene Silben',
        description: 'Einfache Silben wie ma, le, ro',
        type: 'single',        // Einzelne Silben anklicken
        dataKey: 'openSyllables',
        gridCols: 4,
        gridRows: 3,
        streakToAdvance: 5,
        errorsToRegress: 3,
    },
    {
        id: 2,
        name: 'Geschlossene Silben',
        description: 'Silben wie man, tel, rin',
        type: 'single',
        dataKey: 'closedSyllables',
        gridCols: 4,
        gridRows: 3,
        streakToAdvance: 5,
        errorsToRegress: 3,
    },
    {
        id: 3,
        name: 'Gemischte Silben',
        description: 'Offene und geschlossene Silben gemischt',
        type: 'single',
        dataKey: 'mixed',       // Special: combines open + closed
        gridCols: 5,
        gridRows: 3,
        streakToAdvance: 5,
        errorsToRegress: 3,
    },
    {
        id: 4,
        name: 'Einfache Wörter',
        description: 'Zweisilbige Wörter wie Na-se, Ro-se',
        type: 'word',           // Silben in Reihenfolge anklicken
        dataKey: 'twoSyllableWordsEasy',
        gridCols: 4,
        gridRows: 3,
        streakToAdvance: 5,
        errorsToRegress: 3,
    },
    {
        id: 5,
        name: 'Schwierigere Wörter',
        description: 'Wörter wie Kin-der, Gar-ten',
        type: 'word',
        dataKey: 'twoSyllableWordsHard',
        gridCols: 5,
        gridRows: 3,
        streakToAdvance: 5,
        errorsToRegress: 3,
    },
    {
        id: 6,
        name: 'Lange Wörter',
        description: 'Dreisilbige Wörter wie Ba-na-ne',
        type: 'word',
        dataKey: 'threeSyllableWords',
        gridCols: 5,
        gridRows: 4,
        streakToAdvance: 5,
        errorsToRegress: 3,
    },
];

function getLevelConfig(levelId) {
    return LEVELS.find(l => l.id === levelId) || LEVELS[0];
}

function getMaxLevel() {
    return LEVELS.length;
}

function getSyllablesForLevel(levelConfig) {
    if (levelConfig.dataKey === 'mixed') {
        return [...SYLLABLE_DATA.openSyllables, ...SYLLABLE_DATA.closedSyllables];
    }

    const data = SYLLABLE_DATA[levelConfig.dataKey];
    if (!data) return SYLLABLE_DATA.openSyllables;

    // For word levels, return the word objects
    if (levelConfig.type === 'word') {
        return data;
    }

    return data;
}
