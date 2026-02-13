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

                console.log('Verfügbare deutsche Stimmen:', deVoices.map(v => `${v.name} (${v.lang}, local=${v.localService})`));

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

    function _createUtterance(text, rate) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.rate = rate;
        utterance.pitch = 1.05;
        utterance.volume = 1.0;
        if (germanVoice) {
            utterance.voice = germanVoice;
        }
        return utterance;
    }

    // Speak text, cancelling anything currently playing
    function speak(text, rate = 0.85) {
        return new Promise((resolve) => {
            if (!window.speechSynthesis) { resolve(); return; }
            speechSynthesis.cancel();
            setTimeout(() => {
                const utt = _createUtterance(text, rate);
                utt.onend = () => resolve();
                utt.onerror = () => resolve();
                speechSynthesis.speak(utt);
            }, 50);
        });
    }

    // Wait for any current speech to finish, then speak
    function speakAfterCurrent(text, rate = 0.85) {
        return new Promise((resolve) => {
            if (!window.speechSynthesis) { resolve(); return; }

            function go() {
                const utt = _createUtterance(text, rate);
                utt.onend = () => resolve();
                utt.onerror = () => resolve();
                speechSynthesis.speak(utt);
            }

            if (speechSynthesis.speaking) {
                // Poll until current speech is done
                const check = setInterval(() => {
                    if (!speechSynthesis.speaking) {
                        clearInterval(check);
                        setTimeout(go, 80);
                    }
                }, 50);
            } else {
                go();
            }
        });
    }

    function cancel() {
        if (window.speechSynthesis) {
            speechSynthesis.cancel();
        }
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
            await speakAfterCurrent(syl, 0.65);
            await new Promise(r => setTimeout(r, 300));
        }
    }

    // Speak feedback - waits for current syllable speech to finish first
    function speakFeedback(text) {
        return speakAfterCurrent(text, 0.95);
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

    return { init, speak, speakAfterCurrent, cancel, speakSyllable, speakWord, speakWordWithSyllables, speakFeedback, speakPrompt, isReady, getVoiceName };
})();
