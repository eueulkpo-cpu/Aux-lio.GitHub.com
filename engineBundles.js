const engine = window.TouchEngine;

const area = document.getElementById('area');
const info = document.getElementById('info');

let touching = false;

area.addEventListener('touchstart', (e) => {
  const t = e.touches[0];

  engine.lastX = t.clientX;
  engine.lastY = t.clientY;

  touching = true;
}, { passive: true });

area.addEventListener('touchmove', (e) => {
  if (!touching) return;

  const t = e.touches[0];
  const out = engine.update(t.clientX, t.clientY);

  // ✅ CORRIGIDO AQUI (COM CRASE)
  info.innerText = `Movimento: ${out.x.toFixed(2)}, ${out.y.toFixed(2)}`;
 

}, { passive: true });

area.addEventListener('touchend', () => {
  touching = false;
});

// loop suave
function loop() {
  requestAnimationFrame(loop);
}

loop();