// engine.js - Processador de Sensibilidade Profissional
export class AimEngine {
    constructor() {
        this.baseSens = 1.5;
        this.headLimitY = window.innerHeight * 0.28; // 28% do topo
        this.currentY = window.innerHeight / 2;
        this.lastDeltas = []; // Para média móvel (Reduz ruído)
    }

    // Filtro para remover o ruído (jitter) do touch do Android
    filterNoise(delta) {
        this.lastDeltas.push(delta);
        if (this.lastDeltas.length > 3) this.lastDeltas.shift();
        return this.lastDeltas.reduce((a, b) => a + b, 0) / this.lastDeltas.length;
    }

    // Curva de Bezier para suavizar a subida da mira
    applyCurve(delta, velocity) {
        const t = Math.min(velocity / 25, 1);
        const multiplier = (1 - t) * (1 - t) * 0.5 + 2 * (1 - t) * t * 1.2 + t * t * this.baseSens;
        return delta * multiplier;
    }

    // Lógica principal de trava (Headlock)
    calculate(deltaY) {
        const cleanDelta = this.filterNoise(deltaY);
        const velocity = Math.abs(cleanDelta);
        let finalMove = this.applyCurve(cleanDelta, velocity);

        // Trava: se subir muito rápido ou passar do limite, aplica freio
        if (finalMove < 0 && (this.currentY + finalMove) < this.headLimitY) {
            const resistance = 0.15; // 85% de frenagem
            finalMove *= resistance;
        }

        this.currentY += finalMove;
        return finalMove;
    }
}
