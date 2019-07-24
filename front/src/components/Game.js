import React from 'react'
import { get } from 'lodash'

import * as server from 'network/send'
import { fpsCounter } from 'utils/FpsCounter'
import { setPointerLock } from 'engine/pointerLock'
import { getMousePos, pixelRatio } from 'utils/canvas'
import {
  circleIntersectsRectangle,
  segmentIntersectsCircle,
  resolveWorldBordersCircleCollision,
  resolveCollisionCircleRectangle,
  stepCollisionResolve
} from 'engine/physics'
import { loadMap } from 'utils/maps'

import Interval from 'objects/Interval'
import Color from 'effects/Color'

import RectangleBuilder from 'objects/Rectangle'
import Vector from 'objects/Vector'
import Point from 'objects/Point'
import User from 'objects/User'
import TrapSystem from 'objects/TrapSystem'

export const WIDTH = window.innerWidth
export const HEIGHT = window.innerHeight

let currentWorld = loadMap('world1')
export const users = {}
export const user = new User(
  currentWorld.spawn.center.x,
  currentWorld.spawn.center.y,
  12,
  Color.random(),
  '',
  currentWorld.spawn
)

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.canvas = React.createRef()
    this.ctx = null
  }

  componentDidMount() {
    server.userConnects(user)
    this.ctx = this.canvas.current.getContext('2d')
    setPointerLock(this.canvas.current, this.mouseMoved)
    this.request = window.requestAnimationFrame(this.draw)
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.request)
  }

  mouseMoved = event => {
    const displacement = new Vector(
      event.movementX / pixelRatio,
      event.movementY / pixelRatio
    )
    user.translate(displacement)
    resolveWorldBordersCircleCollision(user)
    for (const w of currentWorld.walls) {
      if (w.hasCollision) stepCollisionResolve(user, w)
    }
    server.updateUserPosition(user)
  }

  draw = () => {
    this.request = window.requestAnimationFrame(this.draw)
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT)
    this.ctx.fillText(fpsCounter.fps, 1000, 20)
    currentWorld.walls.forEach(w => {
      if (w.hasCollision && resolveCollisionCircleRectangle(user, w)) {
        server.updateUserPosition(user)
      }
      w.display(this.ctx)
    })
    currentWorld.movableWalls.forEach(w => {
      w.walkPath()
      if (w.hasCollision && resolveCollisionCircleRectangle(user, w)) {
        server.updateUserPosition(user)
      }
      w.display(this.ctx)
    })
    currentWorld.traps.forEach(t => {
      t.display(this.ctx)
      if (t.hasUserFallenInTrap(user)) {
        user.kill()
        server.updateUserPosition(user)
      }
    })
    user.display(this.ctx, false)
    Object.values(users)
      .filter(u => u.id !== user.id)
      .forEach(u => {
        u.display(this.ctx, true)
      })
  }

  render() {
    return (
      <>
        <canvas ref={this.canvas} id="canvas" width={WIDTH} height={HEIGHT} />
      </>
    )
  }
}

export default Game
