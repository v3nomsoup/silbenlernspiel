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
                const deVoices = voices.filter(v => v.lang === 'de-DE' || v.lang === 'de_DE' || v.lang.startsWith('de'));

                // Log available German voices for debugging
                console.log('Verfügbare deutsche Stimmen:', deVoices.map(v => `${v.name} (${v.lang}, local=${v.localService})`));

                // Priority order for best German pronunciation:
                // 1. macOS premium/enhanced voices (Petra, Yannick, Anna Premium)
                // 2. Local (non-network) German voices - better pronunciation
                // 3. Any de-DE voice that is NOT Google (Google voices have English accent)
                // 4. Any German voice as fallback
                germanVoice =
                    deVoices.find(v => /petra|yannick|markus/i.test(v.name)) ||
                    deVoices.find(v => /premium|enhanced|natural/i.test(v.name)) ||
                    deVoices.find(v => v.localService && v.lang === 'de-DE' && !/google/i.test(v.name)) ||
                    deVoices.find(v => v.lang === 'de-DE' && !/google/i.test(v.name)) ||
                    deVoices.find(v => v.lang === 'de-DE') ||
                    deVoices[0] || null;

                if (germanVoice) {
                    console.log('Gewählte Stimme:', germanVoice.name, germanVoice.lang);
                    ready = true;
                    resolve(true);
                } else if (voices.length === 0) {
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

            // Small delay after cancel to avoid Chrome bug
            setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'de-DE';
                utterance.rate = rate;
                utterance.pitch = 1.05;
                utterance.volume = 1.0;

                if (germanVoice) {
                    utterance.voice = germanVoice;
                }

                utterance.onend = () => resolve();
                utterance.onerror = () => resolve();

                speechSynthesis.speak(utterance);
            }, 50);
        });
    }

    // Speak without cancelling current speech (for queuing)
    function speakQueued(text, rate = 0.85) {
        return new Promise((resolve) => {
            if (!window.speechSynthesis) {
                resolve();
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'de-DE';
            utterance.rate = rate;
            utterance.pitch = 1.05;
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
        return speak(syllable, 0.75);
    }

    function speakWord(word) {
        return speak(word, 0.7);
    }

    async function speakWordWithSyllables(word, syllables) {
        await speak(word, 0.7);
        await new Promise(r => setTimeout(r, 500));
        for (const syl of syllables) {
            await speak(syl, 0.65);
            await new Promise(r => setTimeout(r, 300));
        }
    }

    function speakFeedback(text) {
        return speak(text, 0.95);
    }

    function speakPrompt(targetText) {
        return speak('Klicke auf ' + targetText, 0.85);
    }

    function isReady() {
        return ready;
    }

    function getVoiceName() {
        return germanVoice ? germanVoice.name : 'Standard';
    }

    return { init, speak, speakQueued, speakSyllable, speakWord, speakWordWithSyllables, speakFeedback, speakPrompt, isReady, getVoiceName };
})();
