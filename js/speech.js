/* ============================================
   Web Speech API - Sprachausgabe
   ============================================ */

const Speech = (() => {
    let germanVoice = null;
    let ready = false;

    function init() {
        return new Promise((resolve) => {
            if (!window.speechSynthesis) {
                console.warn('Speech Synthesis nicht verfügbar');
                resolve(false);
                return;
            }

            function loadVoices() {
                const voices = speechSynthesis.getVoices();
                // Prefer German voices, with priority for specific good ones
                germanVoice = voices.find(v => v.lang === 'de-DE' && v.name.includes('Anna')) ||
                              voices.find(v => v.lang === 'de-DE' && !v.name.includes('Google')) ||
                              voices.find(v => v.lang === 'de-DE') ||
                              voices.find(v => v.lang.startsWith('de'));

                if (germanVoice) {
                    ready = true;
                    resolve(true);
                } else if (voices.length === 0) {
                    // Voices not loaded yet, wait
                    return false;
                } else {
                    console.warn('Keine deutsche Stimme gefunden, nutze Standard');
                    ready = true;
                    resolve(true);
                }
                return true;
            }

            if (!loadVoices()) {
                speechSynthesis.addEventListener('voiceschanged', () => {
                    loadVoices();
                });
                // Timeout fallback
                setTimeout(() => {
                    if (!ready) {
                        loadVoices();
                        if (!ready) {
                            ready = true;
                            resolve(true);
                        }
                    }
                }, 2000);
            }
        });
    }

    function speak(text, rate = 0.85) {
        return new Promise((resolve) => {
            if (!window.speechSynthesis) {
                resolve();
                return;
            }

            // Cancel any ongoing speech
            speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'de-DE';
            utterance.rate = rate;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            if (germanVoice) {
                utterance.voice = germanVoice;
            }

            utterance.onend = () => resolve();
            utterance.onerror = () => resolve();

            speechSynthesis.speak(utterance);
        });
    }

    function speakSyllable(syllable) {
        return speak(syllable, 0.8);
    }

    function speakWord(word) {
        return speak(word, 0.75);
    }

    async function speakWordWithSyllables(word, syllables) {
        // First speak the whole word
        await speak(word, 0.75);
        // Short pause
        await new Promise(r => setTimeout(r, 400));
        // Then speak syllables separately
        for (const syl of syllables) {
            await speak(syl, 0.7);
            await new Promise(r => setTimeout(r, 250));
        }
    }

    function speakPrompt(targetText) {
        return speak('Klicke auf ' + targetText, 0.9);
    }

    function isReady() {
        return ready;
    }

    return { init, speak, speakSyllable, speakWord, speakWordWithSyllables, speakPrompt, isReady };
})();
