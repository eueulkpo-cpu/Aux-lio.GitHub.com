import { loadWasm } from "./engine_wasm.js"
import { ColorScanner } from "./scanner.js"

let nativeEngine
const scanner = new ColorScanner()

export async function boot(){

const Module = await loadWasm()

nativeEngine = new Module.AimEngine()

await scanner.init()

}

export function handleMove(ev){

const target = scanner.scan()

const vel = Math.sqrt(ev.movementX**2 + ev.movementY**2)

const out = nativeEngine.calculate(

ev.movementX,
ev.movementY,
target.found ? target.x : 0,
target.found ? target.y : 0,
vel

)

return out

}