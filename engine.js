class TouchEngine {

constructor(){

this.lastX = 0
this.lastY = 0

this.filteredX = 0
this.filteredY = 0

this.maxPixels = 120

this.noiseAlpha = 0.25

this.sensitivity = {
x:0.7,
y:0.45
}

this.magnetStrength = 0.2

this.target = {
x:window.innerWidth/2,
y:window.innerHeight/2
}

}

bezier(t){

return (
3*t*(1-t)*(1-t)*0.25 +
3*t*t*(1-t)*0.75 +
t*t*t
)

}

filter(dx,dy){

this.filteredX += this.noiseAlpha * (dx - this.filteredX)
this.filteredY += this.noiseAlpha * (dy - this.filteredY)

return {
x:this.filteredX,
y:this.filteredY
}

}

pixelLock(dx,dy){

const dist = Math.sqrt(dx*dx + dy*dy)

if(dist > this.maxPixels){

dx *= 0.3
dy *= 0.3

}

return {x:dx,y:dy}

}

magnet(x,y){

const dx = this.target.x - x
const dy = this.target.y - y

const dist = Math.sqrt(dx*dx + dy*dy)

if(dist < 500){

x += dx * this.magnetStrength
y += dy * this.magnetStrength

}

return {x,y}

}

process(dx,dy){

const filtered = this.filter(dx,dy)

const locked = this.pixelLock(filtered.x,filtered.y)

const speed = Math.min(
Math.sqrt(locked.x*locked.x + locked.y*locked.y)/80,
1
)

const curve = this.bezier(speed)

// Se a mira deve seguir uma linha reta, preservamos a direção do movimento
// usando um fator de escala único em vez de ajustar x e y separadamente.
const avgSensitivity = (this.sensitivity.x + this.sensitivity.y) / 2
const magnitude = Math.sqrt(locked.x*locked.x + locked.y*locked.y)

if(magnitude === 0){
return {x:0,y:0}
}

const scale = curve * avgSensitivity

return {

x: (locked.x / magnitude) * magnitude * scale,
 y: (locked.y / magnitude) * magnitude * scale

}

}

}

window.engine = new TouchEngine()