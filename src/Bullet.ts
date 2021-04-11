export class Bullet extends Area2D {
  speed: float = 100.0;
  bounds: Rect2;
  x_d: float;
  y_d: float;

  _ready() {
    this.bounds = this.get_viewport_rect();
    this.x_d = cos(this.rotation) * this.speed;
    this.y_d = sin(this.rotation) * this.speed;
  }

  _process(delta: float) {
    this.position.x += this.x_d * delta;
    this.position.y += this.y_d * delta;
    if (this.x_d < 0 && this.position.x < this.bounds.position.x) {
      this.position.x += this.bounds.size.x;
    } else if (this.x_d > 0 && this.position.x > this.bounds.end.x) {
      this.position.x -= this.bounds.size.x;
    }
    if (this.y_d < 0 && this.position.y < this.bounds.position.y) {
      this.position.y += this.bounds.size.y;
    } else if (this.y_d > 0 && this.position.y > this.bounds.end.y) {
      this.position.y -= this.bounds.size.y;
    }
  }
}
