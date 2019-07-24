import React from 'react'
import { get } from 'lodash'

import * as server from 'network/send'
import { openConnection, closeConnection } from 'network/socket'
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

import Interval from 'objects/Interval'
import Color from 'effects/Color'

import RectangleBuilder from 'objects/Rectangle'
import Vector from 'objects/Vector'
import Point from 'objects/Point'
import User from 'objects/User'
import TrapSystem from 'objects/TrapSystem'

export const WIDTH = window.innerWidth
export const HEIGHT = window.innerHeight

class Game extends React.Component {
  constructor(props) {
    super(props)
    const world = props.world
    this.currentWorld = world
    this.users = {}
    this.user = new User(
      world.spawn.center.x,
      world.spawn.center.y,
      12,
      Color.random(),
      '',
      world.spawn
    )
    this.canvas = React.createRef()
    this.ctx = null
  }

  componentDidMount() {
    if (!this.props.noNetwork) {
      server.userConnects(this.user)
      openConnection(this.user, this.users)
    }
    this.ctx = this.canvas.current.getContext('2d')
    setPointerLock(this.canvas.current, this.mouseMoved)
    this.request = window.requestAnimationFrame(this.draw)
  }

  componentWillUnmount() {
    if (!this.props.noNetwork) {
      closeConnection()
    }
    window.cancelAnimationFrame(this.request)
  }

  shouldComponentUpdate() {
    return false
  }

  mouseMoved = event => {
    const displacement = new Vector(
      event.movementX / pixelRatio,
      event.movementY / pixelRatio
    )
    this.user.translate(displacement)
    resolveWorldBordersCircleCollision(this.user)
    for (const w of this.currentWorld.walls) {
      if (w.hasCollision) stepCollisionResolve(this.user, w)
    }
    server.updateUserPosition(this.user)
  }

  draw = () => {
    const { spawn, walls, movableWalls, traps, checkpoints } = this.currentWorld
    this.request = window.requestAnimationFrame(this.draw)
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT)
    this.ctx.fillText(fpsCounter.fps, 1000, 20)
    spawn.display(this.ctx)
    walls.forEach(w => {
      if (w.hasCollision && resolveCollisionCircleRectangle(this.user, w)) {
        server.updateUserPosition(this.user)
      }
      w.display(this.ctx)
    })
    movableWalls.forEach(w => {
      w.walkPath()
      if (w.hasCollision && resolveCollisionCircleRectangle(this.user, w)) {
        server.updateUserPosition(this.user)
      }
      w.display(this.ctx)
    })
    traps.forEach(t => {
      t.display(this.ctx)
      if (t.hasUserWalkedIn(this.user)) {
        this.user.kill()
        server.updateUserPosition(this.user)
      }
    })
    checkpoints.forEach(c => {
      c.display(this.ctx)
      if (c.hasUserWalkedIn(this.user)) {
        this.user.spawnPoint = c
      }
    })
    this.user.display(this.ctx, false)
    Object.values(this.users)
      .filter(u => u.id !== this.user.id)
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
