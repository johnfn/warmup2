export class Gun extends Node2D {
  fire_speed: float = 0.25;
  time_to_fire: float = this.fire_speed;

  bullet_scene = load("res://Bullet.tscn");

  _process(delta: float) {
    this.time_to_fire -= delta;
    if (this.time_to_fire <= 0) {
      this.time_to_fire += this.fire_speed;

      let bullet = this.bullet_scene.instance();

      let spawn_location = new Vector2(
        this.get_viewport().size.x / 2,
        this.get_viewport().size.y / 2
      );
      bullet.position = spawn_location;

      let mouse_pos = this.get_viewport().get_mouse_position();
      bullet.rotation = atan2(
        mouse_pos.y - spawn_location.y,
        mouse_pos.x - spawn_location.x
      );

      this.add_child(bullet);
    }
  }
}
