import { Bullet } from "src/Bullet"
import { GoldTscn } from "_godot_defs/dynamic/@scenes"

@autoload
export class GoldManagerClass extends Node {
  tick = 0
  gold_exists = false
  gold_instance: Node2D | null = null
  gold_cooldown = 20
  gold_gotten = 0

  label = this.get_node(
    "/root/RootNode/Control/Margin/LabelCanvas/GoldText"
  ) as Label
  control = this.get_node_safe("/root/RootNode/Control")
  ship = this.get_node_safe("/root/RootNode/Ship")

  constructor() {
    super()

    seed(randi())

    // haha ok that was a joke

    // ...

    // ok time to be serious again

    randomize()

    this.gold_instance = null
  }

  _process() {
    if (++this.tick > this.gold_cooldown && this.gold_instance === null) {
      this.gold_instance = GoldTscn.instance() as Node2D
      this.gold_instance.scale = new Vector2(0.5, 0.5)

      this.get_tree().root.add_child(this.gold_instance)

      this.gold_instance.position.x = rand_range(0, this.get_viewport().size.x)
      this.gold_instance.position.y = rand_range(
        this.control.rect_size.y + 10,
        this.get_viewport().size.y
      )
    }
  }

  get_gold(bullet: Bullet) {
    if (
      this.gold_instance !== null &&
      !this.ship.dead &&
      !bullet.has_crossed_edge_of_screen
    ) {
      this.gold_instance.queue_free()
      this.gold_instance = null
      this.label.text = str(++this.gold_gotten)
    }
  }
}

export const GoldManager = new GoldManagerClass()
