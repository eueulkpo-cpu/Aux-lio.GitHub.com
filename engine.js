class TouchEngine {
  constructor() {
    this.lastX = 0;
    this.lastY = 0;

    this.velX = 0;
    this.velY = 0;

    this.smooth = 0.18;
    this.noise = 0.4;

    this.maxSpeed = 25;

    // controle vertical (anti subir demais)
    this.upLimit = -8;
    this.downLimit = 20;
  }

  bezier(t) {
    return t * t * (3 - 2 * t);
  }

  normalize(delta) {
    return Math.min(Math.abs(delta) / 50, 1);
  }

  filterNoise(d) {
    return Math.abs(d) < this.noise ? 0 : d;
  }

  curve(d) {
    let sign = Math.sign(d);
    let n = this.normalize(d);
    let curved = this.bezier(n);
    return sign * curved * 50;
  }

  clamp(d) {
    if (Math.abs(d) > this.maxSpeed) {
      return this.maxSpeed * Math.sign(d);
    }
    return d;
  }

  verticalControl(dy) {
    // limite bruto
    if (dy < this.upLimit) dy = this.upLimit;
    if (dy > this.downLimit) dy = this.downLimit;

    // desaceleração inteligente
    if (dy < 0 && Math.abs(dy) < 5) {
      dy *= 0.6;
    }

    if (dy < -5) {
      dy *= 0.5;
    }

    return dy;
  }

  update(x, y) {
    let dx = x - this.lastX;
    let dy = y - this.lastY;

    dx = this.filterNoise(dx);
    dy = this.filterNoise(dy);

    dx = this.curve(dx);
    dy = this.curve(dy);

    dy = this.verticalControl(dy);

    dx = this.clamp(dx);
    dy = this.clamp(dy);

    this.velX += (dx - this.velX) * this.smooth;
    this.velY += (dy - this.velY) * this.smooth;

    this.lastX = x;
    this.lastY = y;

    return {
      x: this.velX,
      y: this.velY
    };
  }
}

export default new TouchEngine();