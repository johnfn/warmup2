import { BulletTscn } from "_godot_defs/dynamic/@scenes"

export class Gun extends Node2D {
  fire_speed: float = 0.25
  time_to_fire: float = this.fire_speed

  _process(delta: float) {
    this.time_to_fire -= delta

    if (this.time_to_fire <= 0) {
      this.time_to_fire += this.fire_speed

      let bullet = BulletTscn.instance()

      let spawn_location = this.position
      bullet.position = spawn_location

      let mouse_pos = this.get_viewport().get_mouse_position()
      bullet.rotation = atan2(
        mouse_pos.y - this.global_position.y,
        mouse_pos.x - this.global_position.x
      )

      this.add_child(bullet)
    }
  }
}
