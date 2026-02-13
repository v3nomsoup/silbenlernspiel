/* ============================================
   Web Speech API - Sprachausgabe
   Mit Fallback: eigene Aufnahmen > synthetische Stimme
   ============================================ */

const Speech = (() => {
    let germanVoice = null;
    let ready = false;
    let audioStoreReady = false;

    async function init() {
        // Init AudioStore (custom recordings)
        if (typeof AudioStore !== 'undefined') {
            try {
                await AudioStore.init();
                await AudioStore.loadPrerecorded();
                audioStoreReady = true;
            } catch (e) {
                console.warn('AudioStore init fehlgeschlagen:', e);
            }
        }

        // Init Web Speech API
        return new Promise((resolve) => {
            if (!window.speechSynthesis) {
                console.warn('Speech Synthesis nicht verfügbar');
                ready = true;
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

    // Try to play a custom recording. Returns true if played, false if not available.
    async function _playCustom(text) {
        if (!audioStoreReady) return false;
        try {
            return await AudioStore.play(text);
        } catch (e) {
            return false;
        }
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

    // Speak text using synth, cancelling anything currently playing
    function _speakSynth(text, rate = 0.85) {
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

    // Speak text: custom recording first, fallback to synth
    async function speak(text, rate = 0.85) {
        if (await _playCustom(text)) return;
        return _speakSynth(text, rate);
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

    async function speakSyllable(syllable) {
        if (await _playCustom(syllable)) return;
        return _speakSynth(syllable, 0.75);
    }

    async function speakWord(word) {
        if (await _playCustom(word)) return;
        return _speakSynth(word, 0.7);
    }

    async function speakWordWithSyllables(word, syllables) {
        // Play whole word
        if (!(await _playCustom(word))) {
            await _speakSynth(word, 0.7);
        }
        await new Promise(r => setTimeout(r, 500));
        // Play each syllable
        for (const syl of syllables) {
            if (!(await _playCustom(syl))) {
                await speakAfterCurrent(syl, 0.65);
            }
            await new Promise(r => setTimeout(r, 300));
        }
    }

    // Speak feedback - always synthetic (not recorded)
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
