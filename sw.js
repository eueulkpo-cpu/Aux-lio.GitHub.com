const CACHE_NAME = 'full-vermelho-v1';

self.addEventListener('message', (e) => {
    if (e.data.type === 'SAVE_OFFSET') {
        // Armazena o endereço de memória de sensibilidade na persistência do navegador
        indexedDB.open("SensDB", 1).onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction("offsets", "readwrite");
            tx.objectStore("offsets").put({ id: "current", val: e.data.value });
        };
    }
});