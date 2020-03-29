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

import { WIDTH, HEIGHT } from '../Game'

const buttons = {
  select: {
    value: 'select',
    icon: 'MousePointer',
    tooltip: 'Select',
    config: {}
  },
  rectangle: {
    value: 'rectangle',
    icon: 'Crop',
    tooltip: 'Rectangle',
    config: {
      ids: ['isMovable', 'color', 'hasCollision', 'kills', 'path', 'velocity'],
      labels: ['Movable', 'Color', 'Collision', 'Kills', 'Path', 'Velocity']
    }
  },
  spawn: {
    value: 'spawn',
    icon: 'Target',
    tooltip: 'Spawn',
    config: {
      ids: ['isMovable', 'color', 'path', 'velocity'],
      labels: ['Movable', 'Color', 'Path', 'Velocity']
    }
  },
  checkpoint: {
    value: 'checkpoint',
    icon: 'UserCheck',
    tooltip: 'Checkpoint',
    config: {
      ids: ['isMovable', 'color', 'path', 'velocity'],
      labels: ['Movable', 'Color', 'Path', 'Velocity']
    }
  },
  trap: {
    value: 'trap',
    icon: 'XSquare',
    tooltip: 'Trap',
    config: {
      ids: ['isMovable', 'color', 'kills', 'path', 'velocity'],
      labels: ['Movable', 'Color', 'Kills', 'Path', 'Velocity']
    }
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
      toolOptions: {
        select: {},
        rectangle: {},
        spawn: {},
        checkpoint: {},
        trap: {}
      },
      trapEditor: {
        trapSystemSelection: null,
        groupSelection: null
      },
      selection: [],
      size: 40,
      color: new Color(),
      path: [],
      velocity: 0,
      shapeBeingDrawn: null,
      testMode: false,
      message: ''
    }
    this.canvas = React.createRef()
    this.width = WIDTH
    this.height = HEIGHT
    this.ctx = null
  }

  componentDidMount() {
    window.onmouseup = this.mouseUp
    this.ctx = this.canvas.current.getContext('2d')
    this.ctx.font = `${pixelRatio * 10}px sans-serif`
    this.request = window.requestAnimationFrame(this.draw)
  }

  componentWillUnmount() {
    window.onmouseup = null
    window.cancelAnimationFrame(this.request)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateKeys = [
      'currentWorld',
      'tool',
      'testMode',
      'message',
      'trapEditor',
      'selection'
    ]
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
    if (category === 'traps') {
      currentWorld[category][index].clearLoop()
    }
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

  mouseDown = event => {
    const { tool, gridPosition, currentWorld } = this.state
    if (tool === 'select') {
      const mouse = getMousePos(this.canvas.current, event)
      const selection = Object.values(currentWorld).reduce(
        (acc, category, index) => {
          const categoryName = Object.keys(currentWorld)[index]
          return Array.isArray(category)
            ? [
                ...acc,
                ...category.reduce((categoryAcc, el, categoryIndex) => {
                  return has(el, 'groups')
                    ? // TRAP SYSTEM
                      [
                        ...categoryAcc,
                        ...el.groups.reduce((groupAcc, group, groupIndex) => {
                          return [
                            ...groupAcc,
                            ...group.traps.reduce(
                              (rectangleAcc, rectangle, rectangleIndex) => {
                                return rectangle.isPointInside(mouse)
                                  ? [
                                      ...rectangleAcc,
                                      {
                                        category: categoryName,
                                        index: categoryIndex,
                                        groupIndex: groupIndex,
                                        rectangleIndex: rectangleIndex,
                                        element: rectangle
                                      }
                                    ]
                                  : rectangleAcc
                              },
                              []
                            )
                          ]
                        }, [])
                      ]
                    : // SIMPLY AN ARRAY
                    el.isPointInside(mouse)
                    ? [
                        ...categoryAcc,
                        {
                          category: categoryName,
                          index: categoryIndex,
                          element: el
                        }
                      ]
                    : categoryAcc
                }, [])
              ]
            : category !== null && category.isPointInside(mouse)
            ? [
                ...acc,
                {
                  category: 'spawn',
                  element: category
                }
              ]
            : acc

          // category.groups.reduce((acc, group) => {}, [])
        },
        []
      )
      this.setState({ selection })
    } else {
      this.setState({ shapeBeingDrawn: gridPosition })
    }
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
      const newRectangle = new RectangleBuilder().fromObject(options).build()
      if (tool === 'spawn') {
        this.updateItem(category, null, newRectangle)
      } else if (tool === 'trap') {
        const { trapSystemSelection, groupSelection } = this.state.trapEditor
        if (trapSystemSelection && groupSelection) {
          const trapIndex = currentWorld.traps.indexOf(trapSystemSelection)
          const groupIndex = trapSystemSelection.groups.indexOf(groupSelection)
          const updatedTrapSystem = trapSystemSelection.addedRectangle(
            groupIndex,
            newRectangle
          )
          this.updateItem(category, trapIndex, updatedTrapSystem)
          this.setTrapSelection(
            updatedTrapSystem,
            trapSystemSelection.groups[groupIndex]
          )
        } else {
          this.setState({
            message: 'First select a group to draw a trap rectangle'
          })
        }
      } else {
        this.addItem(category, newRectangle)
      }
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

  /**
   * @param {undefined|null|TrapSystem} trap
     — give undefined to leave it untouched
     — give null to set it to null
  */
  setTrapSelection = (trap, group) => {
    const { trapEditor } = this.state
    const { trapSystemSelection, groupSelection } = trapEditor
    if (trap !== undefined && trap !== trapSystemSelection) {
      this.setState({
        trapEditor: { trapSystemSelection: trap, groupSelection: group }
      })
    } else if (group !== groupSelection) {
      this.setState({
        trapEditor: { ...trapEditor, groupSelection: group }
      })
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
      spawn,
      walls,
      movableWalls,
      traps,
      checkpoints
    } = this.state.currentWorld
    const { tool, size, gridPosition, shapeBeingDrawn, selection } = this.state
    this.request = window.requestAnimationFrame(this.draw)
    this.ctx.clearRect(0, 0, this.width * pixelRatio, this.height * pixelRatio)
    this.ctx.fillText(
      fpsCounter.fps,
      (this.width - 40) * pixelRatio,
      20 * pixelRatio
    )
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
    selection.forEach(t => {
      t.element.drawBorder(this.ctx)
    })
    this.updateDrawing()
    // CURSOR
    if (tool !== 'select' && gridPosition && !shapeBeingDrawn) {
      this.ctx.fillRect(
        size * gridPosition.x * pixelRatio,
        size * gridPosition.y * pixelRatio,
        size * pixelRatio,
        size * pixelRatio
      )
    }
    if (tool !== 'select' && gridPosition && shapeBeingDrawn) {
      const { x, y, width, height } = computeRectangle(
        shapeBeingDrawn,
        gridPosition,
        size
      )
      this.ctx.fillRect(
        x * pixelRatio,
        y * pixelRatio,
        width * pixelRatio,
        height * pixelRatio
      )
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
      selection,
      trapEditor
    } = this.state
    const buttonComponents = Object.values(buttons).map(button => {
      const { value, icon, tooltip } = button
      return (
        <ButtonWithIcon
          key={value}
          value={value}
          icon={icon}
          tooltip={tooltip}
          selected={tool === value}
          onClick={this.handleToolChange}
        />
      )
    })
    return (
      <div id={styles.editorMainContainer}>
        <div id={styles.leftBar}>
          <div id={styles.toolBar}>
            <div className={styles.toolbarSection}>
              <span className={styles.title}>Tool</span>
              <div id={styles.toolButtonsContainer}>{buttonComponents}</div>
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
                addTrap={this.addItem('traps')}
                updateTrap={this.updateItem('traps')}
                deleteTrap={this.deleteItem('traps')}
                trapSystemSelection={trapEditor.trapSystemSelection}
                groupSelection={trapEditor.groupSelection}
                setTrapSelection={this.setTrapSelection}
              />
            ) : (
              <CheckboxList
                title="Options"
                ids={get(buttons[tool].config, 'ids', [])}
                labels={get(buttons[tool].config, 'labels', [])}
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
            style={{
              width: `${this.width}px`,
              height: `${this.height}px`,
              border: 'solid 2px black'
            }}
            width={this.width * pixelRatio}
            height={this.height * pixelRatio}
          />
        )}
      </div>
    )
  }
}

export default MapEditor
