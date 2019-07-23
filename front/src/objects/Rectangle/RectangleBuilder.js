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

  fromObject(source) {
    Object.assign(this, source)
    return this
  }

  makeMovable() {
    this.isMovable = true
    return this
  }

  withColor(v1, v2, v3) {
    if (isObject(v1)) {
      this.color = v1
    } else {
      this.color = new Color(v1, v2, v3)
    }
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
