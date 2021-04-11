export class Ship extends KinematicBody2D {
  constructor() {
    super()

    this.position.x = 200
  }

  _process(delta: float) {
    const moveDistance = 300.0

    let dpos: Vector2 = new Vector2(0, 0)

    if (Input.is_key_pressed(KeyList.KEY_W)) {
      dpos.y += -moveDistance
    }

    if (Input.is_key_pressed(KeyList.KEY_S)) {
      dpos.y = +moveDistance
    }

    if (Input.is_key_pressed(KeyList.KEY_A)) {
      dpos.x = -moveDistance
    }

    if (Input.is_key_pressed(KeyList.KEY_D)) {
      dpos.x = +moveDistance
    }

    this.move_and_slide(dpos)
  }

  die() {
    this.queue_free()
  }
}
