/* ============================================
   IndexedDB Audio Store - Eigene Aufnahmen
   ============================================ */

const AudioStore = (() => {
    const DB_NAME = 'silbenteppich_audio';
    const DB_VERSION = 1;
    const STORE_NAME = 'recordings';
    let db = null;

    function init() {
        return new Promise((resolve, reject) => {
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
                resolve(); // Don't block the app
            };
        });
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

    function get(key) {
        return new Promise((resolve) => {
            if (!db) { resolve(null); return; }
            const tx = db.transaction(STORE_NAME, 'readonly');
            const request = tx.objectStore(STORE_NAME).get(key.toLowerCase());
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => resolve(null);
        });
    }

    function has(key) {
        return new Promise((resolve) => {
            if (!db) { resolve(false); return; }
            const tx = db.transaction(STORE_NAME, 'readonly');
            const request = tx.objectStore(STORE_NAME).getKey(key.toLowerCase());
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
            if (!db) { resolve(new Set()); return; }
            const tx = db.transaction(STORE_NAME, 'readonly');
            const request = tx.objectStore(STORE_NAME).getAllKeys();
            request.onsuccess = () => resolve(new Set(request.result));
            request.onerror = () => resolve(new Set());
        });
    }

    function play(key) {
        return new Promise(async (resolve) => {
            const blob = await get(key);
            if (!blob) { resolve(false); return; }
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
            audio.play().catch(() => resolve(false));
        });
    }

    return { init, save, get, has, remove, getAllKeys, play };
})();
