import { Bullet } from "src/Bullet"
import { GoldManager } from "src/GoldManager"

export class Gold extends Area2D {
  tick = 0

  constructor() {
    super()

    this.connect("area_entered", this, "on_area_enter")
  }

  on_area_enter(other: Node) {
    if (other instanceof Bullet) {
      GoldManager.get_gold(other)
    }
  }

  _process() {
    ++this.tick

    this.scale = new Vector2(
      0.8 + sin(this.tick / 10.0) / 4.0,
      0.8 + sin(this.tick / 10.0) / 4.0
    )
  }
}
