/* ============================================
   Silben- und Wörterdaten
   ============================================ */

const SYLLABLE_DATA = {
    // Level 1: Offene Silben (Konsonant + Vokal)
    openSyllables: [
        'ma', 'me', 'mi', 'mo', 'mu',
        'la', 'le', 'li', 'lo', 'lu',
        'ra', 're', 'ri', 'ro', 'ru',
        'sa', 'se', 'si', 'so', 'su',
        'na', 'ne', 'ni', 'no', 'nu',
        'ta', 'te', 'ti', 'to', 'tu',
        'da', 'de', 'di', 'do', 'du',
        'fa', 'fe', 'fi', 'fo', 'fu',
        'wa', 'we', 'wi', 'wo',
        'ha', 'he', 'hi', 'ho', 'hu',
        'ba', 'be', 'bi', 'bo', 'bu',
        'ka', 'ke', 'ki', 'ko', 'ku',
        'ga', 'ge', 'gi', 'go', 'gu',
        'pa', 'pe', 'pi', 'po', 'pu',
    ],

    // Level 2: Geschlossene Silben (Konsonant + Vokal + Konsonant)
    closedSyllables: [
        'mal', 'mel', 'mil', 'mol', 'mul',
        'lan', 'len', 'lin', 'lon', 'lun',
        'ras', 'res', 'ris', 'ros', 'rus',
        'san', 'sen', 'sin', 'son', 'sun',
        'nat', 'net', 'nit', 'not', 'nut',
        'tal', 'tel', 'til', 'tol', 'tul',
        'dan', 'den', 'din', 'don', 'dun',
        'fas', 'fes', 'fis', 'fos', 'fus',
        'wal', 'wel', 'wil', 'wol',
        'han', 'hen', 'hin', 'hon', 'hun',
        'ban', 'ben', 'bin', 'bon', 'bun',
        'kan', 'ken', 'kin', 'kon', 'kun',
        'gar', 'ger', 'gir', 'gor', 'gur',
        'par', 'per', 'pir', 'por', 'pur',
    ],

    // Level 4+: Zweisilbige Wörter (einfach, offene Silben)
    twoSyllableWordsEasy: [
        { word: 'Mama', syllables: ['Ma', 'ma'] },
        { word: 'Papa', syllables: ['Pa', 'pa'] },
        { word: 'Nase', syllables: ['Na', 'se'] },
        { word: 'Rose', syllables: ['Ro', 'se'] },
        { word: 'Hose', syllables: ['Ho', 'se'] },
        { word: 'Dose', syllables: ['Do', 'se'] },
        { word: 'Lupe', syllables: ['Lu', 'pe'] },
        { word: 'Name', syllables: ['Na', 'me'] },
        { word: 'Hase', syllables: ['Ha', 'se'] },
        { word: 'Sofa', syllables: ['So', 'fa'] },
        { word: 'Limo', syllables: ['Li', 'mo'] },
        { word: 'Rabe', syllables: ['Ra', 'be'] },
        { word: 'Tube', syllables: ['Tu', 'be'] },
        { word: 'Male', syllables: ['Ma', 'le'] },
        { word: 'Bude', syllables: ['Bu', 'de'] },
        { word: 'Kino', syllables: ['Ki', 'no'] },
        { word: 'Lage', syllables: ['La', 'ge'] },
        { word: 'Ruhe', syllables: ['Ru', 'he'] },
        { word: 'Rede', syllables: ['Re', 'de'] },
        { word: 'Wiese', syllables: ['Wie', 'se'] },
        { word: 'Reise', syllables: ['Rei', 'se'] },
        { word: 'Seife', syllables: ['Sei', 'fe'] },
        { word: 'Auge', syllables: ['Au', 'ge'] },
        { word: 'Eule', syllables: ['Eu', 'le'] },
    ],

    // Level 5: Zweisilbige Wörter (schwieriger, geschlossene Silben)
    twoSyllableWordsHard: [
        { word: 'Kinder', syllables: ['Kin', 'der'] },
        { word: 'Garten', syllables: ['Gar', 'ten'] },
        { word: 'Mantel', syllables: ['Man', 'tel'] },
        { word: 'Finger', syllables: ['Fin', 'ger'] },
        { word: 'Winter', syllables: ['Win', 'ter'] },
        { word: 'Sommer', syllables: ['Som', 'mer'] },
        { word: 'Mutter', syllables: ['Mut', 'ter'] },
        { word: 'Butter', syllables: ['But', 'ter'] },
        { word: 'Koffer', syllables: ['Kof', 'fer'] },
        { word: 'Teller', syllables: ['Tel', 'ler'] },
        { word: 'Wasser', syllables: ['Was', 'ser'] },
        { word: 'Messer', syllables: ['Mes', 'ser'] },
        { word: 'Hamster', syllables: ['Ham', 'ster'] },
        { word: 'Monster', syllables: ['Mon', 'ster'] },
        { word: 'Fenster', syllables: ['Fen', 'ster'] },
        { word: 'Kissen', syllables: ['Kis', 'sen'] },
        { word: 'Wolken', syllables: ['Wol', 'ken'] },
        { word: 'Birne', syllables: ['Bir', 'ne'] },
        { word: 'Lampe', syllables: ['Lam', 'pe'] },
        { word: 'Pumpe', syllables: ['Pum', 'pe'] },
    ],

    // Level 6: Dreisilbige Wörter
    threeSyllableWords: [
        { word: 'Banane', syllables: ['Ba', 'na', 'ne'] },
        { word: 'Tomate', syllables: ['To', 'ma', 'te'] },
        { word: 'Laterne', syllables: ['La', 'ter', 'ne'] },
        { word: 'Salami', syllables: ['Sa', 'la', 'mi'] },
        { word: 'Papagei', syllables: ['Pa', 'pa', 'gei'] },
        { word: 'Melone', syllables: ['Me', 'lo', 'ne'] },
        { word: 'Ananas', syllables: ['A', 'na', 'nas'] },
        { word: 'Rakete', syllables: ['Ra', 'ke', 'te'] },
        { word: 'Giraffe', syllables: ['Gi', 'raf', 'fe'] },
        { word: 'Kartoffel', syllables: ['Kar', 'tof', 'fel'] },
        { word: 'Erdbeere', syllables: ['Erd', 'bee', 're'] },
        { word: 'Elefant', syllables: ['E', 'le', 'fant'] },
        { word: 'Telefon', syllables: ['Te', 'le', 'fon'] },
        { word: 'Schokolade', syllables: ['Scho', 'ko', 'la', 'de'] },
        { word: 'Limonade', syllables: ['Li', 'mo', 'na', 'de'] },
        { word: 'Lokomotive', syllables: ['Lo', 'ko', 'mo', 'ti', 've'] },
    ],

    // Ermutigende Nachrichten
    encourageMessages: [
        'Super gemacht! ⭐',
        'Toll! Weiter so! 🌟',
        'Richtig! Du bist klasse! 🎉',
        'Genau! 👏',
        'Perfekt! 💪',
        'Wow, das war schnell! 🚀',
        'Du kannst das! 😊',
        'Fantastisch! 🌈',
    ],

    // Trost-Nachrichten bei Fehlern
    comfortMessages: [
        'Fast! Versuch es nochmal! 💪',
        'Nicht schlimm, nächstes Mal! 😊',
        'Hör nochmal genau hin! 👂',
        'Du schaffst das! 🌟',
    ],
};
