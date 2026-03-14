const senha = "123456";

const STORAGE_KEY = "zsxis_engine_settings";

// Prefer using the global engine if already present (engine.js / engineBundle.js)
// If TouchEngine is not available, fall back to a safe empty object so the script still runs.
const engine = window.engine || (typeof TouchEngine !== "undefined" ? new TouchEngine() : {});
window.engine = engine;

const defaultSettings = {
    precision: false,
    recoil: false,
    lag: false,
    engine: false
};

function loadSettings() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...defaultSettings };
        const saved = JSON.parse(raw);
        return { ...defaultSettings, ...saved };
    } catch {
        return { ...defaultSettings };
    }
}

function saveSettings(settings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (_e) {
        // ignore storage errors
    }
}

function applySettings(settings) {
    // If engine isn't available, skip applying settings.
    if (!engine || typeof engine !== "object" || !engine.hasOwnProperty("sensitivity")) {
        return;
    }

    if (settings.precision) {
        engine.sensitivity.x = 0.9;
        engine.sensitivity.y = 0.7;
    } else {
        engine.sensitivity.x = 0.7;
        engine.sensitivity.y = 0.45;
    }

    engine.maxPixels = settings.recoil ? 60 : 120;
    engine.noiseAlpha = settings.lag ? 0.1 : 0.25;

    // Toggle engine exposure in global memory
    if (settings.engine) {
        window.engine = engine;
    } else {
        window.engine = null;
    }
}

function login() {
    const msgEl = document.getElementById("loginMessage");
    const key = document.getElementById("key").value;

    if (msgEl) {
        msgEl.textContent = "";
    }

    if (key === senha) {
        if (msgEl) msgEl.textContent = "Senha correta! Abrindo painel...";
        document.getElementById("login").style.display = "none";
        document.getElementById("panel").style.display = "block";
        ativarControles();
    } else {
        if (msgEl) msgEl.textContent = "Senha incorreta";
    }
}

function ativarControles() {
    const precision = document.getElementById("precision");
    const recoil = document.getElementById("recoil");
    const lag = document.getElementById("lag");
    const engineToggle = document.getElementById("engine");

    const settings = loadSettings();

    // Restore settings from storage
    precision.checked = settings.precision;
    recoil.checked = settings.recoil;
    lag.checked = settings.lag;
    engineToggle.checked = settings.engine;
    applySettings(settings);

    const updateSettings = () => {
        const newSettings = {
            precision: precision.checked,
            recoil: recoil.checked,
            lag: lag.checked,
            engine: engineToggle.checked
        };
        applySettings(newSettings);
        saveSettings(newSettings);
    };

    precision.addEventListener("change", updateSettings);
    recoil.addEventListener("change", updateSettings);
    lag.addEventListener("change", updateSettings);
    engineToggle.addEventListener("change", updateSettings);
}

function openGame() {
    window.location.href = "freefire://";
}

// Add event listeners once DOM is ready
window.addEventListener("DOMContentLoaded", function() {
    const keyInput = document.getElementById("key");
    if (keyInput) {
        keyInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                login();
            }
        });
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            login();
        });
    }
});
