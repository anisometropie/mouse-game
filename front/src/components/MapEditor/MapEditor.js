import React from 'react'
import _, { has, get, isArray, isEmpty, curry } from 'lodash'

import { fpsCounter } from 'utils/FpsCounter'
import { setPointerLock } from 'engine/pointerLock'
import { getMousePos, pixelRatio, pixelToGrid } from 'utils/canvas'
import { computeRectangle, extractRectangleData } from 'utils/objects'

import Interval from 'objects/Interval'
import Color from 'effects/Color'

import Game from 'components/Game'
import TrapEditor from 'components/TrapEditor'
import RectangleBuilder from 'objects/Rectangle'
import Vector from 'objects/Vector'
import Point from 'objects/Point'
import User from 'objects/User'
import TrapSystem from 'objects/TrapSystem'
import CheckboxList from 'core.ui/CheckboxList'
import ColorPicker from 'core.ui/ColorPicker'
import ButtonWithIcon from 'core.ui/ButtonWithIcon'
import ListEditor from 'core.ui/ListEditor'

import { loadMap } from 'utils/maps'

import styles from './MapEditor.css'

export const WIDTH = 1000
export const HEIGHT = 800

const toolsConfig = {
  rectangle: {
    ids: ['isMovable', 'color', 'hasCollision', 'kills', 'path', 'velocity'],
    labels: ['Movable', 'Color', 'Collision', 'Kills', 'Path', 'Velocity']
  },
  spawn: {
    ids: ['isMovable', 'color', 'path', 'velocity'],
    labels: ['Movable', 'Color', 'Path', 'Velocity']
  },
  checkpoint: {
    ids: ['isMovable', 'color', 'path', 'velocity'],
    labels: ['Movable', 'Color', 'Path', 'Velocity']
  },
  trap: {
    ids: ['isMovable', 'color', 'kills', 'path', 'velocity'],
    labels: ['Movable', 'Color', 'Kills', 'Path', 'Velocity']
  }
}
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
      toolOptions: { rectangle: {}, spawn: {}, checkpoint: {}, trap: {} },
      // selection: { category: '', element: null },
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
    window.onmouseup = this.mouseUp
    this.ctx = this.canvas.current.getContext('2d')
    this.request = window.requestAnimationFrame(this.draw)
  }

  componentWillUnmount() {
    window.onmouseup = null
    window.cancelAnimationFrame(this.request)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateKeys = ['currentWorld', 'tool', 'testMode', 'message']
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

  addItem = curry((category, item) => {
    const { currentWorld } = this.state
    const updatedCategory = Array.isArray(currentWorld[category])
      ? [...currentWorld[category], item]
      : item
    this.setState({
      currentWorld: {
        ...currentWorld,
        [category]: updatedCategory
      }
    })
  })

  updateItem = curry((category, index, newItem) => {
    const { currentWorld } = this.state
    const updatedCategory = Array.isArray(currentWorld[category])
      ? [
          ...currentWorld[category].slice(0, index),
          newItem,
          ...currentWorld[category].slice(index + 1)
        ]
      : newItem
    this.setState({
      currentWorld: {
        ...currentWorld,
        [category]: updatedCategory
      }
    })
  })

  deleteItem = curry((category, index) => {
    const { currentWorld } = this.state
    const updatedCategory = Array.isArray(currentWorld[category])
      ? [
          ...currentWorld[category].slice(0, index),
          ...currentWorld[category].slice(index + 1)
        ]
      : null
    this.setState({
      currentWorld: {
        ...currentWorld,
        [category]: updatedCategory
      }
    })
  })

  makeJson() {
    const { currentWorld } = this.state
    const json = JSON.stringify(
      Object.keys(currentWorld).reduce((acc, key) => {
        if (isArray(currentWorld[key])) {
          return {
            ...acc,
            [key]: currentWorld[key].map(extractRectangleData)
          }
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

  mouseUp = event => {
    event.stopPropagation()
    const {
      currentWorld,
      size,
      tool,
      toolOptions,
      gridPosition,
      shapeBeingDrawn
    } = this.state
    if (shapeBeingDrawn) {
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
          : tool === 'trap'
          ? 'traps'
          : tool
      currentWorld[category] =
        tool === 'spawn'
          ? new RectangleBuilder().fromObject(options).build()
          : [
              ...currentWorld[category],
              new RectangleBuilder().fromObject(options).build()
            ]
      this.setState({
        shapeBeingDrawn: null
      })
    }
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
            ...toolOptions[tool],
            [id]: get(this.state, id, true)
          }
        }
      })
    }
  }

  handleToolChange = value => {
    this.setState({ tool: value })
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

  // handleSelection = selection => {
  //   this.setState({
  //     selection: { element: selection, category: this.state.tool }
  //   })
  // }

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
      spawn,
      walls,
      movableWalls,
      traps,
      checkpoints
    } = this.state.currentWorld
    const { size, gridPosition, shapeBeingDrawn } = this.state
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
    const {
      currentWorld,
      tool,
      toolOptions,
      testMode,
      message,
      color,
      selection
    } = this.state
    return (
      <div id={styles.editorMainContainer}>
        <div id={styles.leftBar}>
          <div id={styles.toolBar}>
            <div className={styles.toolbarSection}>
              <span className={styles.title}>Tool</span>
              <div id={styles.toolButtonsContainer}>
                <ButtonWithIcon
                  value="rectangle"
                  icon="Crop"
                  tooltip="Rectangle"
                  selected={tool === 'rectangle'}
                  onClick={this.handleToolChange}
                />
                <ButtonWithIcon
                  value="spawn"
                  icon="Target"
                  tooltip="Spawn"
                  selected={tool === 'spawn'}
                  onClick={this.handleToolChange}
                />
                <ButtonWithIcon
                  value="checkpoint"
                  icon="UserCheck"
                  tooltip="Checkpoint"
                  selected={tool === 'checkpoint'}
                  onClick={this.handleToolChange}
                />
                <ButtonWithIcon
                  value="trap"
                  icon="XSquare"
                  tooltip="Trap"
                  selected={tool === 'trap'}
                  onClick={this.handleToolChange}
                />
              </div>
            </div>
            <ColorPicker
              value={color.hexString}
              noTextField
              onChangeComplete={this.handleColorChange}
            />
            {tool === 'trap' ? (
              <TrapEditor
                list={currentWorld.traps}
                objectClass={TrapSystem}
                addItem={this.addItem('traps')}
                updateItem={this.updateItem('traps')}
                deleteItem={this.deleteItem('traps')}
              />
            ) : (
              <CheckboxList
                title="Options"
                ids={toolsConfig[tool].ids}
                labels={toolsConfig[tool].labels}
                values={toolOptions[tool]}
                onChange={this.handleCheckboxChange}
              />
            )}
            <button onClick={this.toogleTestMode}>
              {testMode ? 'Back to Editor' : 'Test map'}
            </button>
          </div>
          <div className={styles.message}>{message}</div>
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
