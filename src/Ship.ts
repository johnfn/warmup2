export class Ship extends Node2D {
  constructor() {
    super()
    this.position.x = 200
  }

  _process(delta: float) {
    const moveDistance = 300.0 * delta
    if (Input.is_key_pressed(KeyList.KEY_W)) {
      this.position.y = this.position.y - moveDistance
    }

    if (Input.is_key_pressed(KeyList.KEY_S)) {
      this.position.y = this.position.y + moveDistance
    }

    if (Input.is_key_pressed(KeyList.KEY_A)) {
      this.position.x = this.position.x - moveDistance
    }

    if (Input.is_key_pressed(KeyList.KEY_D)) {
      this.position.x = this.position.x + moveDistance
    }
  }
}
