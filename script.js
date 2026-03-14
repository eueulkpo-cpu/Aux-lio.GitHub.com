const senha = "123456"

const STORAGE_KEY = "zsxis_engine_settings"

// Prefer using the global engine if already present (engine.js / engineBundle.js)
const engine = window.engine || new TouchEngine()
window.engine = engine

const defaultSettings = {
  precision: false,
  recoil: false,
  lag: false,
  engine: false
}

function loadSettings(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {...defaultSettings}
    const saved = JSON.parse(raw)
    return {...defaultSettings, ...saved}
  } catch {
    return {...defaultSettings}
  }
}

function saveSettings(settings){
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (_e) {
    // ignore storage errors
  }
}

function applySettings(settings){
  if (settings.precision) {
    engine.sensitivity.x = 0.9
    engine.sensitivity.y = 0.7
  } else {
    engine.sensitivity.x = 0.7
    engine.sensitivity.y = 0.45
  }

  engine.maxPixels = settings.recoil ? 60 : 120
  engine.noiseAlpha = settings.lag ? 0.1 : 0.25

  // Toggle engine exposure in global memory
  if (settings.engine) {
    window.engine = engine
  } else {
    window.engine = null
  }
}

function login(){

const key = document.getElementById("key").value

if(key === senha){

document.getElementById("login").style.display = "none"
document.getElementById("panel").style.display = "block"

ativarControles()

}else{

alert("Senha incorreta")

}

}

// Add event listener for Enter key on password input
document.getElementById("key").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        login();
    }
});

function ativarControles(){

  const precision = document.getElementById("precision")
  const recoil = document.getElementById("recoil")
  const lag = document.getElementById("lag")
  const engineToggle = document.getElementById("engine")

  const settings = loadSettings()

  // Restore settings from storage
  precision.checked = settings.precision
  recoil.checked = settings.recoil
  lag.checked = settings.lag
  engineToggle.checked = settings.engine
  applySettings(settings)

  const updateSettings = () => {
    const newSettings = {
      precision: precision.checked,
      recoil: recoil.checked,
      lag: lag.checked,
      engine: engineToggle.checked
    }

    applySettings(newSettings)
    saveSettings(newSettings)
  }

  precision.addEventListener("change", updateSettings)
  recoil.addEventListener("change", updateSettings)
  lag.addEventListener("change", updateSettings)
  engineToggle.addEventListener("change", updateSettings)

}

function openGame(){

window.location.href="freefire://"

}
