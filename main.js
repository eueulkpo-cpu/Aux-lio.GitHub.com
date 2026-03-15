import { AimEngine } from './engine.js';

const engine = new AimEngine();
let isPrecisionActive = false;
let isHeadlockActive = false;

// Controle de Telas
const btnEntrar = document.getElementById('btn-entrar');
btnEntrar.addEventListener('click', () => {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('panel-screen').style.display = 'flex';
    initServiceWorker();
});

// Listener dos Switches (Ativação das Engines)
document.getElementById('switch-precision').addEventListener('change', (e) => {
    isPrecisionActive = e.target.checked;
    if(isPrecisionActive) showToast();
});

document.getElementById('switch-headlock').addEventListener('change', (e) => {
    isHeadlockActive = e.target.checked;
    if(isHeadlockActive) showToast();
});

// Captura de Movimento Otimizada (Chrome & iOS)
const handleInput = (e) => {
    if (!isPrecisionActive && !isHeadlockActive) return;
    if (e.cancelable) e.preventDefault();

    const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    
    for (let ev of events) {
        let moveX = ev.movementX || 0;
        let moveY = ev.movementY || 0;

        if (isHeadlockActive) {
            moveY = engine.calculate(moveY);
        }

        // Simulação de saída para o jogo
        console.log(`[Engine Ativa] Movendo X:${moveX.toFixed(1)} Y:${moveY.toFixed(1)}`);
    }
};

document.addEventListener('pointermove', handleInput, { passive: false });

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2000);
}

function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
    }
}
