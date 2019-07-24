import React from 'react'

import { get, isArray, isEmpty } from 'lodash'
import { fpsCounter } from 'utils/FpsCounter'
import { setPointerLock } from 'engine/pointerLock'
import { getMousePos, pixelRatio, pixelToGrid } from 'utils/canvas'
import { computeRectangle, extractRectangleData } from 'utils/objects'

import Interval from 'objects/Interval'
import Color from 'effects/Color'

import Game from 'components/Game'
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
        checkpoints: []
      },
      tool: 'rectangle',
      toolOptions: { rectangle: {}, spawn: {}, checkpoint: {} },
      size: 40,
      color: new Color(),
      path: [],
      velocity: 0,
      shapeBeingDrawn: null,
      testMode: false
    }
    this.canvas = React.createRef()
    this.ctx = null
  }

  componentDidMount() {
    this.ctx = this.canvas.current.getContext('2d')
    this.request = window.requestAnimationFrame(this.draw)
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.request)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateKeys = ['testMode']
    return stateKeys.reduce(
      (acc, key) => acc || nextState[key] !== this.state[key],
      false
    )
  }

  componentDidUpdate(prevProps, prevState) {
    const { testMode } = this.state
    if (testMode) {
      window.cancelAnimationFrame(this.request)
    } else {
      this.ctx = this.canvas.current.getContext('2d')
      this.request = window.requestAnimationFrame(this.draw)
    }
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
    const { size } = this.state
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
      size,
      tool,
      toolOptions,
      currentWorld,
      gridPosition,
      shapeBeingDrawn
    } = this.state
    const options = {
      ...computeRectangle(shapeBeingDrawn, gridPosition, size),
      ...toolOptions[tool]
    }
    const category =
      tool === 'rectangle'
        ? toolOptions[tool].isMovable
          ? 'movableWalls'
          : toolOptions[tool].kills
          ? 'traps'
          : 'walls'
        : tool === 'checkpoint'
        ? 'checkpoints'
        : tool
    this.setState({
      currentWorld: {
        ...currentWorld,
        [category]:
          tool === 'spawn'
            ? new RectangleBuilder().fromObject(options).build()
            : [
                ...currentWorld[category],
                new RectangleBuilder().fromObject(options).build()
              ]
      },
      shapeBeingDrawn: null
    })
  }

  handleCheckboxChange = event => {
    const { tool, toolOptions } = this.state
    const { value: id } = event.target
    // if the option exists, remove it
    if (toolOptions[id]) {
      const { [id]: removedKey, ...newOptions } = toolOptions[tool]
      this.setState({
        toolOptions: { ...toolOptions, [tool]: newOptions }
      })
    } else {
      this.setState({
        toolOptions: {
          ...toolOptions,
          [tool]: {
            [id]: get(this.state, id, true)
          }
        }
      })
    }
  }

  handleToolChange = event => {
    this.setState({ tool: event.target.value })
  }

  toogleTestMode = () => {
    this.setState({
      testMode: !this.state.testMode
    })
  }

  updateDrawing = () => {
    const { tool, toolOptions } = this.state
    const { color } = toolOptions[tool]
    if (color) {
      this.ctx.fillStyle = color.hexString
    } else {
      this.ctx.fillStyle = 'black'
    }
  }

  draw = () => {
    const {
      currentWorld: { spawn, walls, movableWalls, traps, checkpoints },
      size,
      gridPosition,
      shapeBeingDrawn
    } = this.state
    this.request = window.requestAnimationFrame(this.draw)
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT)
    this.ctx.fillText(fpsCounter.fps, WIDTH - 40, 20)
    if (spawn) spawn.display(this.ctx)
    walls.forEach(w => {
      w.display(this.ctx)
    })
    movableWalls.forEach(w => {
      w.display(this.ctx)
    })
    traps.forEach(t => {
      t.display(this.ctx)
    })
    traps.forEach(t => {
      t.display(this.ctx)
    })
    checkpoints.forEach(t => {
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
    const { currentWorld, testMode } = this.state
    return (
      <div id="mainContainer">
        <div>
          <button
            value="rectangle"
            onClick={this.handleToolChange}
            className="button"
          >
            Rectangle
          </button>
          <button
            value="spawn"
            onClick={this.handleToolChange}
            className="button"
          >
            Spawn
          </button>
          <button
            value="checkpoint"
            onClick={this.handleToolChange}
            className="button"
          >
            Checkpoint
          </button>
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
          <button onClick={this.toogleTestMode}>
            {testMode ? 'Back to Editor' : 'Test map'}
          </button>
        </div>
        {testMode ? (
          <Game world={currentWorld} noNetwork />
        ) : (
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
        )}
      </div>
    )
  }
}

export default MapEditor
