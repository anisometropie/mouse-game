import React from 'react'

import { get, isArray, isEmpty } from 'lodash'
import { fpsCounter } from 'utils/FpsCounter'
import { setPointerLock } from 'engine/pointerLock'
import { getMousePos, pixelRatio, pixelToGrid } from 'utils/canvas'
import { computeRectangle, extractRectangleData } from 'utils/objects'

import Interval from 'objects/Interval'
import Color from 'effects/Color'

import RectangleBuilder from 'objects/Rectangle'
import Vector from 'objects/Vector'
import Point from 'objects/Point'
import User from 'objects/User'
import TrapSystem from 'objects/TrapSystem'
import CheckboxList from 'core.ui/CheckboxList'
import { loadMap } from 'utils/maps'

import './MapEditor.css'

export const WIDTH = 1000
export const HEIGHT = 800

class MapEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gridPosition: null,
      currentWorld: {
        spawn: null,
        walls: [],
        movableWalls: [],
        traps: [],
        checkPoints: []
      },
      currentTool: { size: 40 },
      toolOptions: {},
      color: new Color(),
      path: [],
      velocity: 0,
      shapeBeingDrawn: null
    }
    this.canvas = React.createRef()
    this.ctx = null
  }

  componentDidMount() {
    this.ctx = this.canvas.current.getContext('2d')
    window.requestAnimationFrame(this.draw)
  }

  shouldComponentUpdate(nextProps, nextState) {
    // const stateKeys = ['toolOptions']
    // return stateKeys.reduce(
    //   (acc, key) => acc || nextState[key] !== this.state[key],
    //   false
    // )
    return false
  }

  makeJson() {
    const { currentWorld } = this.state
    const json = JSON.stringify(
      Object.keys(currentWorld).reduce((acc, key) => {
        if (isArray(currentWorld[key])) {
          return { ...acc, [key]: currentWorld[key].map(extractRectangleData) }
        } else {
          return { ...acc, [key]: extractRectangleData(currentWorld[key]) }
        }
      }, {})
    )
    return json
  }

  mouseMoved = event => {
    const {
      currentTool: { size }
    } = this.state
    const mouse = getMousePos(this.canvas.current, event)
    this.setState({ gridPosition: pixelToGrid(mouse, size) })
  }

  mouseOut = () => {
    if (!this.state.shapeBeingDrawn) {
      this.setState({ gridPosition: null })
    }
  }

  mouseDown = () => {
    const { gridPosition } = this.state
    this.setState({ shapeBeingDrawn: gridPosition })
  }

  mouseUp = () => {
    const {
      currentTool: { size },
      toolOptions,
      currentWorld,
      gridPosition,
      shapeBeingDrawn
    } = this.state
    const options = {
      ...computeRectangle(shapeBeingDrawn, gridPosition, size),
      ...toolOptions
    }
    this.setState({
      currentWorld: {
        ...currentWorld,
        walls: [
          ...currentWorld.walls,
          new RectangleBuilder().fromObject(options).build()
        ]
      },
      shapeBeingDrawn: null
    })
  }

  handleCheckboxChange = event => {
    const { toolOptions } = this.state
    const { value: id } = event.target
    // if the option exists, remove it
    if (toolOptions[id]) {
      const { [id]: removedKey, ...newOptions } = toolOptions
      this.setState({
        toolOptions: newOptions
      })
    } else {
      this.setState({
        toolOptions: {
          ...toolOptions,
          [id]: get(this.state, id, true)
        }
      })
    }
  }

  updateDrawing = () => {
    const { toolOptions, color } = this.state
    if (toolOptions.color) {
      this.ctx.fillStyle = color.hexString
    } else {
      this.ctx.fillStyle = 'black'
    }
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
    this.ctx.fillText(fpsCounter.fps, WIDTH - 40, 20)
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
    this.updateDrawing()
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
  }

  render() {
    return (
      <div id="mainContainer">
        <div>
          <button className="button">Wall</button>
          <CheckboxList
            list={[
              ['isMovable', 'Movable'],
              ['color', 'Color'],
              ['hasCollision', 'Collision'],
              ['kills', 'Kills'],
              ['path', 'Path'],
              ['velocity', 'Velocity']
            ]}
            onChange={this.handleCheckboxChange}
          />
        </div>
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
      </div>
    )
  }
}

export default MapEditor
