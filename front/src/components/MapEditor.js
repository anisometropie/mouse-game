import React from 'react'
import { get } from 'lodash'

import { fpsCounter } from 'utils/FpsCounter'
import { setPointerLock } from 'engine/pointerLock'
import { getMousePos, pixelRatio, pixelToGrid } from 'utils/canvas'
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

import { loadMap } from 'utils/maps'

export const WIDTH = window.innerWidth
export const HEIGHT = window.innerHeight

let gridPosition = { x: 0, y: 0 }
let currentWorld = { walls: [], movableWalls: [], traps: [] }
const currentTool = { size: 40 }

class MapEditor extends React.Component {
  constructor(props) {
    super(props)
    this.canvas = React.createRef()
    this.ctx = null
  }

  componentDidMount() {
    this.ctx = this.canvas.current.getContext('2d')
    this.canvas.current.onmousemove = this.mouseMoved
    window.requestAnimationFrame(this.draw)
  }

  mouseMoved = event => {
    const mouse = getMousePos(this.canvas.current, event)
    Object.assign(gridPosition, pixelToGrid(mouse, currentTool.size))
  }

  draw = () => {
    const { size } = currentTool
    window.requestAnimationFrame(this.draw)
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT)
    this.ctx.fillRect(size * gridPosition.x, size * gridPosition.y, size, size)
    this.ctx.fillText(fpsCounter.fps, 1000, 20)
    currentWorld.walls.forEach(w => {
      w.display(this.ctx)
    })
    currentWorld.movableWalls.forEach(w => {
      w.walkPath()
      w.display(this.ctx)
    })
    currentWorld.traps.forEach(t => {
      t.display(this.ctx)
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

export default MapEditor
