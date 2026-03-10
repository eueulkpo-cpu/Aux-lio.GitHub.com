// engine.js

class TouchEngine {

  constructor(){

    this.lastX = 0
    this.lastY = 0

    this.prevFilteredX = 0
    this.prevFilteredY = 0

    this.config = {

      sensitivityX: 1.4,
      sensitivityY: 0.9,

      horizontalBoost: 1.25,

      alphaX: 0.65,
      alphaY: 0.4,

      maxPixelStep: 28,

      verticalDeadzone: 1.5

    }

  }

  lowPass(input, prev, alpha){
    return prev + alpha * (input - prev)
  }

  clamp(v,max){
    if(v > max) return max
    if(v < -max) return -max
    return v
  }

  process(x,y){

    let dx = x - this.lastX
    let dy = y - this.lastY

    this.lastX = x
    this.lastY = y

    // zona morta vertical
    if(Math.abs(dy) < this.config.verticalDeadzone){
      dy = 0
    }

    // sensibilidade
    dx *= this.config.sensitivityX
    dy *= this.config.sensitivityY

    // deixa mais leve pros lados
    dx *= this.config.horizontalBoost

    // filtro anti ruído
    let fx = this.lowPass(dx,this.prevFilteredX,this.config.alphaX)
    let fy = this.lowPass(dy,this.prevFilteredY,this.config.alphaY)

    this.prevFilteredX = fx
    this.prevFilteredY = fy

    // trava de pixels
    fx = this.clamp(fx,this.config.maxPixelStep)
    fy = this.clamp(fy,this.config.maxPixelStep)

    return {
      x: fx,
      y: fy
    }

  }

}

window.TouchEngine = TouchEngine