import React from 'react'
import { get } from 'lodash'

import { fpsCounter } from 'utils/FpsCounter'
import { setPointerLock } from 'engine/pointerLock'
import {
  getMousePos,
  pixelRatio,
  pixelToGrid,
  computeRectangle
} from 'utils/canvas'
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

class MapEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gridPosition: null,
      currentWorld: { walls: [], movableWalls: [], traps: [] },
      currentTool: { size: 40 },
      shapeBeingDrawn: null
    }
    this.canvas = React.createRef()
    this.ctx = null
  }

  componentDidMount() {
    this.ctx = this.canvas.current.getContext('2d')
    window.requestAnimationFrame(this.draw)
  }

  mouseMoved = event => {
    const {
      currentTool: { size }
    } = this.state
    const mouse = getMousePos(this.canvas.current, event)
    this.setState({ gridPosition: pixelToGrid(mouse, size) })
  }

  mouseOut = () => {
    this.setState({ gridPosition: null })
  }

  mouseDown = () => {
    const { gridPosition } = this.state
    this.setState({ shapeBeingDrawn: gridPosition })
  }

  mouseUp = () => {
    const {
      currentTool: { size },
      currentWorld,
      gridPosition,
      shapeBeingDrawn
    } = this.state
    const { x, y, width, height } = computeRectangle(
      shapeBeingDrawn,
      gridPosition,
      size
    )
    this.setState({
      currentWorld: {
        ...currentWorld,
        walls: [
          ...currentWorld.walls,
          new RectangleBuilder(x, y, width, height).build()
        ]
      },
      shapeBeingDrawn: null
    })
  }

  draw = () => {
    const {
      currentWorld,
      currentTool: { size },
      gridPosition,
      shapeBeingDrawn
    } = this.state
    window.requestAnimationFrame(this.draw)
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT)
    // CURSOR
    if (gridPosition && !shapeBeingDrawn) {
      this.ctx.fillRect(
        size * gridPosition.x,
        size * gridPosition.y,
        size,
        size
      )
    }
    if (gridPosition && shapeBeingDrawn) {
      const { x, y, width, height } = computeRectangle(
        shapeBeingDrawn,
        gridPosition,
        size
      )
      this.ctx.fillRect(x, y, width, height)
    }
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
        <canvas
          onMouseMove={this.mouseMoved}
          onMouseLeave={this.mouseOut}
          onMouseDown={this.mouseDown}
          onMouseUp={this.mouseUp}
          ref={this.canvas}
          id="canvas"
          width={WIDTH}
          height={HEIGHT}
        />
      </>
    )
  }
}

export default MapEditor
