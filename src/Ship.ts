import { Gun } from "src/Gun"

enum State {
  Normal,
  DyingAnimation,
  Dead,
}

export class Ship extends KinematicBody2D {
  ui_buffer = 69
  max_velocity = 350.0
  velocity = new Vector2(0, 0)
  accel = 55000.0
  deaccel = 55000.0

  gun = this.get_node("/root/RootNode/Gun") as Gun

  you_die_label = this.get_node(
    "/root/RootNode/DeathCanvas/YouDieLabel"
  ) as Label
  final_score_label = this.get_node(
    "/root/RootNode/Control/Margin/LabelCanvas/ScoreText"
  ) as Label
  stage_label = this.get_node(
    "/root/RootNode/Control/Margin/LabelCanvas/StageText"
  ) as Label
  bounds: Rect2
  dead: bool = false

  w_held: bool = false
  a_held: bool = false
  s_held: bool = false
  d_held: bool = false

  state: State = State.Normal
  death_tick = 0

  constructor() {
    super()

    this.final_score_label.visible = false
    this.bounds = this.get_viewport_rect()
    this.position.x = 200
    this.you_die_label.visible = false
  }

  die_animation() {
    ++this.death_tick

    this.scale.x = 1 + float(this.death_tick) / 30.0
    this.scale.y = 1 + float(this.death_tick) / 30.0

    this.get_node_safe("sprite").modulate.a =
      1.0 - float(this.death_tick) / 100.0

    if (this.death_tick > 100) {
      this.state = State.Dead
      // this.queue_free() // note this kills the physics_process which also works as our main game loop. kinda.
    }
  }

  _physics_process(delta: float) {
    if (this.state === State.DyingAnimation) {
      this.die_animation()

      if (Input.is_action_pressed("new_game")) {
        this.get_tree().reload_current_scene()
      }

      return
    }

    if (this.state === State.Dead) {
      if (Input.is_action_pressed("new_game")) {
        this.get_tree().reload_current_scene()
      }

      return
    }

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

    if (this.position.x < 0 && move_left) {
      this.position = this.position.add(new Vector2(this.bounds.size.x, 0))
    } else if (this.position.x > this.bounds.size.x && move_right) {
      this.position = this.position.sub(new Vector2(this.bounds.size.x, 0))
    }
    if (this.position.y < this.ui_buffer && move_up) {
      this.position = this.position.add(
        new Vector2(0, this.bounds.size.y - this.ui_buffer)
      )
    } else if (this.position.y > this.bounds.size.y && move_down) {
      this.position = this.position.sub(
        new Vector2(0, this.bounds.size.y - this.ui_buffer)
      )
    }
    this.final_score_label.text = str(this.gun.total_bullets_fired)
    this.stage_label.text = str(
      1 + floor(this.gun.total_bullets_fired / this.gun.bullets_per_stage)
    )
  }

  die() {
    this.you_die_label.visible = true

    this.final_score_label.text = str(this.gun.total_bullets_fired)

    this.dead = true

    this.state = State.DyingAnimation
  }
}
