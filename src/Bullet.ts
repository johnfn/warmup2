import { Ship } from "src/Ship"

const BULLET_COLORS = [
  new Color(193 / 256.0, 48 / 256.0, 28 / 256.0),
  new Color(201 / 256.0, 97 / 256.0, 18 / 256.0),
  new Color(196 / 256.0, 167 / 256.0, 5 / 256.0),
  new Color(23 / 256.0, 114 / 256.0, 69 / 256.0),
  new Color(46 / 256.0, 87 / 256.0, 147 / 256.0),
  new Color(75 / 256.0, 40 / 256.0, 130 / 256.0),
]

const NUM_LIVES = 6

export class Bullet extends Area2D {
  alive_counter = 0
  @exports
  lives = 3
  speed: float = 350.0
  bounds: Rect2
  x_d: float
  y_d: float
  safe_spawn_buffer = 0.5
  horiz_lives = this.lives
  vert_lives = this.lives
  ui_buffer = 69

  constructor() {
    super()

    this.bounds = this.get_viewport_rect()

    this.x_d = cos(this.rotation) * this.speed
    this.y_d = sin(this.rotation) * this.speed
    this.horiz_lives = this.lives
    this.vert_lives = this.lives

    this.connect("body_entered", this, "on_body_enter")
  }

  on_body_enter(body: Node2D) {
    // safe_spawn_buffer prevents newly spawned bullets from immediately killing you

    if (body instanceof Ship && this.safe_spawn_buffer <= 0) {
      body.die()
    }
  }

  _process(delta: float) {
    this.safe_spawn_buffer -= delta

    this.position.x += this.x_d * delta
    this.position.y += this.y_d * delta

    if (this.x_d < 0 && this.position.x < this.bounds.position.x) {
      this.position.x += this.bounds.size.x
      this.horiz_lives--
    } else if (this.x_d > 0 && this.position.x > this.bounds.end.x) {
      this.position.x -= this.bounds.size.x
      this.horiz_lives--
    }

    if (
      this.y_d < 0 &&
      this.position.y < this.bounds.position.y + this.ui_buffer
    ) {
      this.position.y += this.bounds.size.y - this.ui_buffer
      this.vert_lives--
    } else if (this.y_d > 0 && this.position.y > this.bounds.end.y) {
      this.position.y -= this.bounds.size.y - this.ui_buffer
      this.vert_lives--
    }

    const min_lives = min(this.horiz_lives, this.vert_lives)
    if (min_lives <= 0) {
      this.queue_free()
    }

    // Leave the bullet white on spawning to indicate it's safe
    if (this.safe_spawn_buffer <= 0) {
      this.get_node_safe("Sprite").modulate =
        BULLET_COLORS[max(0, min(BULLET_COLORS.size(), min_lives) - 1)]
    }
  }
}
