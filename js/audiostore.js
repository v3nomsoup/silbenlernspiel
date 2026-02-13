/* ============================================
   IndexedDB Audio Store - Eigene Aufnahmen
   + Prerecorded audio from audio/recordings.json
   ============================================ */

const AudioStore = (() => {
    const DB_NAME = 'silbenteppich_audio';
    const DB_VERSION = 1;
    const STORE_NAME = 'recordings';
    let db = null;

    // In-memory cache for prerecorded audio (from committed JSON file)
    const prerecorded = new Map(); // key → Blob

    function init() {
        return new Promise((resolve) => {
            if (db) { resolve(); return; }
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = (e) => {
                e.target.result.createObjectStore(STORE_NAME);
            };
            request.onsuccess = (e) => {
                db = e.target.result;
                resolve();
            };
            request.onerror = () => {
                console.warn('AudioStore: IndexedDB konnte nicht geöffnet werden');
                resolve();
            };
        });
    }

    // Load prerecorded audio from audio/recordings.json (committed file)
    async function loadPrerecorded() {
        try {
            const resp = await fetch('audio/recordings.json');
            if (!resp.ok) return;
            const data = await resp.json();
            for (const [key, entry] of Object.entries(data)) {
                const binary = atob(entry.data);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                prerecorded.set(key.toLowerCase(), new Blob([bytes], { type: entry.type }));
            }
            console.log(`AudioStore: ${prerecorded.size} voraufgenommene Dateien geladen`);
        } catch (e) {
            // No prerecorded file available — that's fine
        }
    }

    function save(key, blob) {
        return new Promise((resolve, reject) => {
            if (!db) { resolve(); return; }
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).put(blob, key.toLowerCase());
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    // Get blob: IndexedDB first (user recordings override), then prerecorded
    async function get(key) {
        const k = key.toLowerCase();
        // Check IndexedDB first
        if (db) {
            const blob = await new Promise((resolve) => {
                const tx = db.transaction(STORE_NAME, 'readonly');
                const request = tx.objectStore(STORE_NAME).get(k);
                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => resolve(null);
            });
            if (blob) return blob;
        }
        // Fallback to prerecorded
        return prerecorded.get(k) || null;
    }

    async function has(key) {
        const k = key.toLowerCase();
        if (prerecorded.has(k)) return true;
        if (!db) return false;
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const request = tx.objectStore(STORE_NAME).getKey(k);
            request.onsuccess = () => resolve(request.result !== undefined);
            request.onerror = () => resolve(false);
        });
    }

    function remove(key) {
        return new Promise((resolve) => {
            if (!db) { resolve(); return; }
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).delete(key.toLowerCase());
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
        });
    }

    function getAllKeys() {
        return new Promise((resolve) => {
            if (!db) { resolve(new Set(prerecorded.keys())); return; }
            const tx = db.transaction(STORE_NAME, 'readonly');
            const request = tx.objectStore(STORE_NAME).getAllKeys();
            request.onsuccess = () => {
                const keys = new Set(request.result);
                for (const k of prerecorded.keys()) keys.add(k);
                resolve(keys);
            };
            request.onerror = () => resolve(new Set(prerecorded.keys()));
        });
    }

    async function play(key) {
        const blob = await get(key);
        if (!blob) return false;
        return new Promise((resolve) => {
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.onended = () => {
                URL.revokeObjectURL(url);
                resolve(true);
            };
            audio.onerror = () => {
                URL.revokeObjectURL(url);
                resolve(false);
            };
            audio.play().catch(() => {
                URL.revokeObjectURL(url);
                resolve(false);
            });
        });
    }

    return { init, loadPrerecorded, save, get, has, remove, getAllKeys, play };
})();
