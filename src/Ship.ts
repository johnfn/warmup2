import { Gun } from "src/Gun"

export class Ship extends KinematicBody2D {
  you_die_label = this.get_node("/root/RootNode/YouDieLabel") as Label
  final_score_label = this.get_node("/root/RootNode/FinalScoreLabel") as Label
  gun = this.get_node("/root/RootNode/Gun") as Gun

  constructor() {
    super()

    this.position.x = 200
    this.you_die_label.visible = false
    this.final_score_label.visible = false
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
    this.visible = false
    this.you_die_label.visible = true
    this.final_score_label.visible = true

    this.final_score_label.text = "Score: " + str(this.gun.total_bullets_fired)
  }
}
