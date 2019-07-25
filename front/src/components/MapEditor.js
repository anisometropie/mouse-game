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
import ColorPicker from 'core.ui/ColorPicker'
import { loadMap } from 'utils/maps'

import styles from './MapEditor.css'

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
      testMode: false,
      message: ''
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
    const stateKeys = ['testMode', 'message']
    return stateKeys.reduce(
      (acc, key) => acc || nextState[key] !== this.state[key],
      false
    )
  }

  componentDidUpdate(prevProps, prevState) {
    const { testMode } = this.state
    if (testMode && !prevState.testMode) {
      window.cancelAnimationFrame(this.request)
    } else if (!testMode && prevState.testMode) {
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
    if (toolOptions[tool][id]) {
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

  handleColorChange = color => {
    const { tool, toolOptions } = this.state
    const newColor = new Color(color)
    if (toolOptions[tool].color) {
      this.setState({
        color: newColor,
        toolOptions: {
          ...toolOptions,
          [tool]: { ...toolOptions[tool], color: newColor }
        }
      })
    } else {
      this.setState({ color: newColor })
    }
  }

  toogleTestMode = () => {
    if (this.state.currentWorld.spawn) {
      this.setState({
        testMode: !this.state.testMode
      })
    } else {
      this.setState({ message: 'First create a spawn' })
    }
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
    const { currentWorld, testMode, message, color } = this.state
    return (
      <div id={styles.mainContainer}>
        <div id={styles.leftBar}>
          <div id={styles.toolBox}>
            <div className={styles.leftBarGroup}>
              <span className={styles.title}>Tool</span>
              <button
                value="rectangle"
                onClick={this.handleToolChange}
                className={styles.button}
              >
                Rectangle
              </button>
              <button
                value="spawn"
                onClick={this.handleToolChange}
                className={styles.button}
              >
                Spawn
              </button>
              <button
                value="checkpoint"
                onClick={this.handleToolChange}
                className={styles.button}
              >
                Checkpoint
              </button>
            </div>
            <CheckboxList
              title="Options"
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
          <div className={styles.message}>{message}</div>
          <ColorPicker
            value={color.hexString}
            noTextField
            onChangeComplete={this.handleColorChange}
          />
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
            id={styles.canvas}
            width={WIDTH}
            height={HEIGHT}
          />
        )}
      </div>
    )
  }
}

export default MapEditor
