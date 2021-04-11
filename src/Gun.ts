import { BulletTscn } from "_godot_defs/dynamic/@scenes"

export class Gun extends Node2D {
  fire_speed: float = 0.25
  time_to_fire: float = this.fire_speed
  ship = this.get_node_safe("/root/RootNode/Ship")
  root = this.get_node_safe("/root/RootNode")
  total_bullets_fired = 0
  bullets_per_stage = 20

  thingy = load("res://Bullet.tscn")

  constructor() {
    super()
  }

  _process(delta: float) {
    this.time_to_fire -= delta

    if (this.ship.dead) {
      return
    }

    let mouse_pos = this.get_viewport().get_mouse_position()
    const mouse_angle = atan2(
      mouse_pos.y - this.ship.global_position.y,
      mouse_pos.x - this.ship.global_position.x
    )
    this.ship.rotation = mouse_angle
    if (this.time_to_fire <= 0 && this.ship.visible) {
      this.time_to_fire += this.fire_speed

      let bullet = BulletTscn.instance()

      bullet.position = this.ship.global_position
      bullet.lives =
        1 + int(floor(this.total_bullets_fired / this.bullets_per_stage))

      bullet.rotation = mouse_angle

      this.root.add_child(bullet)
      this.total_bullets_fired++
    }
  }
}
