import { Gun } from "src/Gun"

export class Ship extends KinematicBody2D {
  velocity = new Vector2(0, 0)
  max_velocity = 400.0
  accel = 60000.0
  deaccel = 60000.0
  you_die_label = this.get_node("/root/RootNode/YouDieLabel") as Label
  final_score_label = this.get_node("/root/RootNode/FinalScoreLabel") as Label
  gun = this.get_node("/root/RootNode/Gun") as Gun

  w_held: bool = false
  a_held: bool = false
  s_held: bool = false
  d_held: bool = false

  constructor() {
    super()
    this.position.x = 200
    this.you_die_label.visible = false
    this.final_score_label.visible = false
  }

  _process(delta: float) {
    const move_left =
      Input.is_key_pressed(KeyList.KEY_A) && (this.a_held || !this.d_held)
    const move_right = Input.is_key_pressed(KeyList.KEY_D) && !this.a_held
    const move_up =
      Input.is_key_pressed(KeyList.KEY_W) && (this.w_held || !this.s_held)
    const move_down = Input.is_key_pressed(KeyList.KEY_S) && !this.w_held

    this.w_held = Input.is_key_pressed(KeyList.KEY_W)
    this.a_held = Input.is_key_pressed(KeyList.KEY_A)
    this.s_held = Input.is_key_pressed(KeyList.KEY_S)
    this.d_held = Input.is_key_pressed(KeyList.KEY_D)

    if (move_up) {
      this.velocity.y = max(
        -this.max_velocity,
        this.velocity.y - this.accel * delta
      )
    } else if (move_down) {
      this.velocity.y = min(
        this.max_velocity,
        this.velocity.y + this.accel * delta
      )
    } else if (this.velocity.y > 0) {
      this.velocity.y = max(0, this.velocity.y - this.deaccel * delta)
    } else if (this.velocity.y < 0) {
      this.velocity.y = min(0, this.velocity.y + this.deaccel * delta)
    }

    if (move_left) {
      this.velocity.x = max(
        -this.max_velocity,
        this.velocity.x - this.accel * delta
      )
    } else if (move_right) {
      this.velocity.x = min(
        this.max_velocity,
        this.velocity.x + this.accel * delta
      )
    } else if (this.velocity.x > 0) {
      this.velocity.x = max(0, this.velocity.x - this.deaccel * delta)
    } else if (this.velocity.x < 0) {
      this.velocity.x = min(0, this.velocity.x + this.deaccel * delta)
    }

    if (this.velocity.length() > this.max_velocity) {
      const move_angle = atan2(this.velocity.y, this.velocity.x)
      this.move_and_slide(
        new Vector2(cos(move_angle), sin(move_angle)).mul(this.max_velocity)
      )
    } else {
      this.move_and_slide(this.velocity)
    }
  }

  die() {
    this.visible = false
    this.you_die_label.visible = true
    this.final_score_label.visible = true

    this.final_score_label.text = "Score: " + str(this.gun.total_bullets_fired)

    this.queue_free()
  }
}
