import Rectangle from './Rectangle'
import MovableRectangle from './MovableRectangle'
import Color from 'effects/Color'

import { isObject } from 'lodash'

class RectangleBuilder {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  makeMovable() {
    this.isMovable = true
    return this
  }

  makeCollide() {
    this.hasCollision = true
    return this
  }

  makeKill() {
    this.kills = true
    return this
  }

  withPath(path) {
    this.path = path
    return this
  }

  withVelocity(velocity) {
    this.velocity = velocity
    return this
  }

  withColor(red, green, blue) {
    if (isObject(red)) {
      this.color = red
    } else {
      this.color = new Color(red, green, blue)
    }
    return this
  }

  build() {
    if (this.isMovable) {
      return new MovableRectangle(
        this.x,
        this.y,
        this.width,
        this.height,
        this.color,
        this.hasCollision,
        this.kills,
        this.path,
        this.velocity
      )
    }
    return new Rectangle(
      this.x,
      this.y,
      this.width,
      this.height,
      this.color,
      this.hasCollision,
      this.kills
    )
  }
}

export default RectangleBuilder
