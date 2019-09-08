import React from 'react'
import { shallow, mount, render } from 'enzyme'

import MapEditor from '../MapEditor'
import Color from 'effects/Color'
import RectangleBuilder from 'objects/Rectangle'
import TrapSystem from 'objects/TrapSystem'

const canvas = require.requireActual('utils/canvas')

jest.mock('components/Game')
const fakeEvent = {
  stopPropagation: () => {}
}

describe('map editor component', () => {
  describe('checkboxes', () => {
    it('should update options correctly', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      const value = 'isMovable'
      instance.handleCheckboxChange({ target: { value } })
      const { toolOptions } = wrapper.state()
      expect(toolOptions.rectangle).toHaveProperty(value)
    })
    it('should update options in the right tool', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      const value = 'hasCollision'
      const tool = 'spawn'
      wrapper.setState({
        tool
      })
      instance.handleCheckboxChange({ target: { value } })
      const { toolOptions } = wrapper.state()
      expect(toolOptions[tool]).toHaveProperty(value)
    })
  })

  describe('creation of objects', () => {
    it('should create simple Rectangle', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      wrapper.setState({
        shapeBeingDrawn: { x: 0, y: 0 },
        gridPosition: { x: 3, y: 3 }
      })
      instance.mouseUp(fakeEvent)
      const state = wrapper.state()
      const rectangle = state.currentWorld.walls[0]
      expect(rectangle.constructor.name).toEqual('Rectangle')
      expect(rectangle.x).toEqual(0)
      expect(rectangle.y).toEqual(0)
      expect(rectangle.width).toEqual(160)
      expect(rectangle.height).toEqual(160)
      expect(rectangle).toHaveProperty('color')
      expect(rectangle.color).toEqual(undefined)
      expect(rectangle.hasCollision).toEqual(false)
      expect(rectangle.kills).toEqual(false)
      expect(rectangle).not.toHaveProperty('path')
      expect(rectangle).not.toHaveProperty('velocity')
      expect(state.currentWorld.walls.length).toEqual(1)
    })
    it('should create movable Rectangle', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      wrapper.setState({
        shapeBeingDrawn: { x: 0, y: 0 },
        gridPosition: { x: 3, y: 3 },
        toolOptions: { rectangle: { isMovable: true } }
      })
      instance.mouseUp(fakeEvent)
      const state = wrapper.state()
      const rectangle = state.currentWorld.movableWalls[0]
      expect(rectangle.constructor.name).toEqual('MovableRectangle')
      expect(rectangle.x).toEqual(0)
      expect(rectangle.y).toEqual(0)
      expect(rectangle.width).toEqual(160)
      expect(rectangle.height).toEqual(160)
      expect(rectangle).toHaveProperty('color')
      expect(rectangle.color).toEqual(undefined)
      expect(rectangle.hasCollision).toEqual(false)
      expect(rectangle.kills).toEqual(false)
      expect(rectangle.path).toEqual([])
      expect(rectangle.velocity).toEqual(0)
      expect(state.currentWorld.movableWalls.length).toEqual(1)
    })
    it('should create Rectangle with color', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      const color = Color.random()
      wrapper.setState({
        shapeBeingDrawn: { x: 0, y: 0 },
        gridPosition: { x: 3, y: 3 },
        toolOptions: { rectangle: { color } }
      })
      instance.mouseUp(fakeEvent)
      const state = wrapper.state()
      const rectangle = state.currentWorld.walls[0]
      expect(rectangle.constructor.name).toEqual('Rectangle')
      expect(rectangle.color).toEqual(color)
    })
    it('should create Rectangle with collision', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      wrapper.setState({
        shapeBeingDrawn: { x: 0, y: 0 },
        gridPosition: { x: 3, y: 3 },
        toolOptions: { rectangle: { hasCollision: true } }
      })
      instance.mouseUp(fakeEvent)
      const state = wrapper.state()
      const rectangle = state.currentWorld.walls[0]
      expect(rectangle.constructor.name).toEqual('Rectangle')
      expect(rectangle.hasCollision).toEqual(true)
    })
    it('should create Rectangle with kill', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      wrapper.setState({
        shapeBeingDrawn: { x: 0, y: 0 },
        gridPosition: { x: 3, y: 3 },
        toolOptions: { rectangle: { kills: true } }
      })
      instance.mouseUp(fakeEvent)
      const state = wrapper.state()
      const rectangle = state.currentWorld.traps[0]
      expect(rectangle.constructor.name).toEqual('Rectangle')
      expect(rectangle.kills).toEqual(true)
    })
    it('should create Movable Rectangle with path & velocity', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      const path = [{ x: 500, y: 666 }, { x: 600, y: 10000 }]
      const velocity = 500
      wrapper.setState({
        shapeBeingDrawn: { x: 0, y: 0 },
        gridPosition: { x: 3, y: 3 },
        toolOptions: { rectangle: { path, velocity, isMovable: true } }
      })
      instance.mouseUp(fakeEvent)
      const state = wrapper.state()
      const rectangle = state.currentWorld.movableWalls[0]
      expect(rectangle.constructor.name).toEqual('MovableRectangle')
      expect(rectangle.path).toEqual(path)
      expect(rectangle.velocity).toEqual(velocity)
    })
    it('should create spawn', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      const path = [{ x: 500, y: 666 }, { x: 600, y: 10000 }]
      const velocity = 500
      wrapper.setState({
        shapeBeingDrawn: { x: 0, y: 0 },
        gridPosition: { x: 3, y: 3 },
        tool: 'spawn'
      })
      instance.mouseUp(fakeEvent)
      const state = wrapper.state()
      const rectangle = state.currentWorld.spawn
      expect(rectangle.constructor.name).toEqual('Rectangle')
    })
    it('should create checkpoint', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      const path = [{ x: 500, y: 666 }, { x: 600, y: 10000 }]
      const velocity = 500
      wrapper.setState({
        shapeBeingDrawn: { x: 0, y: 0 },
        gridPosition: { x: 3, y: 3 },
        tool: 'checkpoint'
      })
      instance.mouseUp(fakeEvent)
      const state = wrapper.state()
      const rectangle = state.currentWorld.checkpoints[0]
      expect(rectangle.constructor.name).toEqual('Rectangle')
    })
  })

  describe('adding items', () => {
    it('should be able to create element in non array category', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      const spawn = new RectangleBuilder(0, 0, 1, 1).build()
      instance.addItem('spawn', spawn)
      const state = wrapper.state()
      expect(state.currentWorld.spawn).toEqual(spawn)
    })
    it('should be able to create element in array category', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      const newWall = new RectangleBuilder(0, 0, 44, 44).build()
      instance.addItem('walls', newWall)
      const state = wrapper.state()
      expect(state.currentWorld.walls[0]).toEqual(newWall)
    })
    it('should be able to add several elements in array category', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      const newWall = new RectangleBuilder(0, 0, 1, 1).build()
      const newWall2 = new RectangleBuilder(0, 0, 2, 2).build()
      const newWall3 = new RectangleBuilder(0, 0, 3, 4).build()
      instance.addItem('walls', newWall)
      instance.addItem('walls', newWall2)
      instance.addItem('walls', newWall3)
      const state = wrapper.state()
      expect(state.currentWorld.walls[0]).toEqual(newWall)
      expect(state.currentWorld.walls[1]).toEqual(newWall2)
      expect(state.currentWorld.walls[2]).toEqual(newWall3)
    })
  })

  describe('updating items', () => {
    it('should be able to update element in non array category', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      const oldSpawn = new RectangleBuilder(0, 0, 1, 1).build()
      const newSpawn = new RectangleBuilder(0, 0, 2, 2).build()
      wrapper.setState({
        currentWorld: {
          spawn: oldSpawn,
          walls: [],
          movableWalls: [],
          traps: [],
          checkpoints: []
        }
      })
      instance.updateItem('spawn', null, newSpawn)
      const state = wrapper.state()
      expect(state.currentWorld).toMatchObject({
        spawn: newSpawn,
        walls: [],
        movableWalls: [],
        traps: [],
        checkpoints: []
      })
    })
    it('should be able to update element in array category', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      const newWall = new RectangleBuilder(500, 500, 1, 1).build()
      wrapper.setState({
        currentWorld: {
          spawn: null,
          walls: [
            new RectangleBuilder(0, 0, 1, 1).build(),
            new RectangleBuilder(1, 0, 1, 1).build(),
            new RectangleBuilder(2, 0, 1, 1).build(),
            new RectangleBuilder(3, 0, 1, 1).build()
          ],
          movableWalls: [],
          traps: [],
          checkpoints: []
        }
      })
      instance.updateItem('walls', 2, newWall)
      const state = wrapper.state()
      expect(state.currentWorld).toMatchObject({
        spawn: null,
        walls: [
          new RectangleBuilder(0, 0, 1, 1).build(),
          new RectangleBuilder(1, 0, 1, 1).build(),
          newWall,
          new RectangleBuilder(3, 0, 1, 1).build()
        ],
        movableWalls: [],
        traps: [],
        checkpoints: []
      })
    })
  })

  describe('deleting items', () => {
    it('should be able to delete element in non array category', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      const spawn = new RectangleBuilder(0, 0, 1, 1).build()
      wrapper.setState({
        currentWorld: {
          spawn: spawn,
          walls: [],
          movableWalls: [],
          traps: [],
          checkpoints: []
        }
      })
      instance.deleteItem('spawn', null)
      const state = wrapper.state()
      expect(state.currentWorld).toMatchObject({
        spawn: null,
        walls: [],
        movableWalls: [],
        traps: [],
        checkpoints: []
      })
    })
    it('should be able to delete element in array category', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      const newWall = new RectangleBuilder(500, 500, 1, 1).build()
      wrapper.setState({
        currentWorld: {
          spawn: null,
          walls: [
            new RectangleBuilder(0, 0, 1, 1).build(),
            new RectangleBuilder(1, 0, 1, 1).build(),
            new RectangleBuilder(2, 0, 1, 1).build(),
            new RectangleBuilder(3, 0, 1, 1).build()
          ],
          movableWalls: [],
          traps: [],
          checkpoints: []
        }
      })
      instance.deleteItem('walls', 2, newWall)
      const state = wrapper.state()
      expect(state.currentWorld).toMatchObject({
        spawn: null,
        walls: [
          new RectangleBuilder(0, 0, 1, 1).build(),
          new RectangleBuilder(1, 0, 1, 1).build(),
          new RectangleBuilder(3, 0, 1, 1).build()
        ],
        movableWalls: [],
        traps: [],
        checkpoints: []
      })
    })
    it('should be able to delete several elements in array category', () => {
      const wrapper = mount(<MapEditor />)
      const instance = wrapper.instance()
      const newWall = new RectangleBuilder(500, 500, 1, 1).build()
      wrapper.setState({
        currentWorld: {
          spawn: null,
          walls: [
            new RectangleBuilder(0, 0, 1, 1).build(),
            new RectangleBuilder(1, 0, 1, 1).build(),
            new RectangleBuilder(2, 0, 1, 1).build(),
            new RectangleBuilder(3, 0, 1, 1).build()
          ],
          movableWalls: [],
          traps: [],
          checkpoints: []
        }
      })
      instance.deleteItem('walls', 0, newWall)
      instance.deleteItem('walls', 1, newWall)
      const state = wrapper.state()
      expect(state.currentWorld).toMatchObject({
        spawn: null,
        walls: [
          new RectangleBuilder(1, 0, 1, 1).build(),
          new RectangleBuilder(3, 0, 1, 1).build()
        ],
        movableWalls: [],
        traps: [],
        checkpoints: []
      })
    })
  })

  describe('trap selector', () => {
    it('should be able to select trap in list', () => {
      const wrapper = mount(<MapEditor />)
      const trap1 = new TrapSystem()
      const trap2 = new TrapSystem()
      const instance = wrapper.instance()
      wrapper.setState({
        currentWorld: {
          spawn: null,
          walls: [],
          movableWalls: [],
          traps: [trap1, trap2],
          checkpoints: []
        },
        trapEditor: {}
      })
      instance.setTrapSelection(trap1)
      const state = wrapper.state()
      expect(state.trapEditor).toMatchObject({
        trapSystemSelection: trap1,
        groupSelection: null
      })
    })
  })

  describe.only('selecting rectangle on the canvas', () => {
    describe('selecting spawn', () => {
      it('should be able to select spawn by clicking on it', () => {
        canvas.getMousePos = jest.fn(() => {
          return {
            x: 15,
            y: 15
          }
        })
        const wrapper = mount(<MapEditor />)
        wrapper.setState({ tool: 'select' })
        const instance = wrapper.instance()
        const spawn = new RectangleBuilder(10, 10, 10, 10).build()
        instance.addItem('spawn', spawn)
        instance.mouseDown()
        const state = wrapper.state()
        expect(state.selection).toEqual([
          {
            category: 'spawn',
            element: spawn
          }
        ])
      })
      it('should not select spawn if click somewhere else', () => {
        canvas.getMousePos = jest.fn(() => {
          return {
            x: 100,
            y: 15
          }
        })
        const wrapper = mount(<MapEditor />)
        wrapper.setState({ tool: 'select' })
        const instance = wrapper.instance()
        const spawn = new RectangleBuilder(10, 10, 10, 10).build()
        instance.addItem('spawn', spawn)
        instance.mouseDown()
        const state = wrapper.state()
        expect(state.selection).toEqual([])
      })
    })
    describe('selecting something in an array of currentWorld', () => {
      it('should be able to select a rectangle by clicking on it', () => {
        const rectangle = new RectangleBuilder(100, 100, 40, 40).build()
        const category = 'walls'
        canvas.getMousePos = jest.fn(() => {
          return {
            x: 130,
            y: 110
          }
        })
        const wrapper = mount(<MapEditor />)
        const instance = wrapper.instance()
        wrapper.setState({ tool: 'select' })
        instance.addItem(category, rectangle)
        instance.mouseDown()
        const state = wrapper.state()
        expect(state.selection).toEqual([
          {
            category: 'walls',
            index: 0,
            element: rectangle
          }
        ])
      })
      it('should return all corresponding rectangle in an array', () => {
        const rectangle = new RectangleBuilder(100, 100, 100, 100).build()
        const rectangle2 = new RectangleBuilder(150, 100, 100, 100).build()
        canvas.getMousePos = jest.fn(() => {
          return {
            x: 175,
            y: 150
          }
        })
        const wrapper = mount(<MapEditor />)
        const instance = wrapper.instance()
        wrapper.setState({ tool: 'select' })
        instance.addItem('walls', rectangle)
        instance.addItem('checkpoints', rectangle2)
        instance.mouseDown()
        const state = wrapper.state()
        expect(state.selection).toEqual([
          {
            category: 'walls',
            index: 0,
            element: rectangle
          },
          {
            category: 'checkpoints',
            index: 0,
            element: rectangle2
          }
        ])
      })
      it('should return empty array if no rectangle is found', () => {
        const rectangle = new RectangleBuilder(100, 100, 100, 100).build()
        const rectangle2 = new RectangleBuilder(250, 100, 100, 100).build()
        const category = 'walls'
        canvas.getMousePos = jest.fn(() => {
          return {
            x: 225,
            y: 150
          }
        })
        const wrapper = mount(<MapEditor />)
        const instance = wrapper.instance()
        wrapper.setState({ tool: 'select' })
        instance.addItem(category, rectangle)
        instance.addItem(category, rectangle2)
        instance.mouseDown()
        const state = wrapper.state()
        expect(state.selection).toEqual([])
      })
      it('should be able to select rectangle in a trap system', () => {
        const rectangle = new RectangleBuilder(100, 100, 100, 100).build()
        const trapSystem = new TrapSystem()
        trapSystem.addGroup()
        trapSystem.addRectangle(0, rectangle)
        canvas.getMousePos = jest.fn(() => {
          return {
            x: 150,
            y: 150
          }
        })
        const wrapper = mount(<MapEditor />)
        const instance = wrapper.instance()
        wrapper.setState({ tool: 'select' })
        instance.addItem('traps', trapSystem)
        instance.mouseDown()
        const state = wrapper.state()
        expect(state.selection).toEqual([
          {
            category: 'traps',
            index: 0,
            groupIndex: 0,
            rectangleIndex: 0,
            element: rectangle
          }
        ])
      })
      it('should be able to select rectangle in all categories', () => {
        const rectangle1 = new RectangleBuilder(100, 100, 101, 100).build()
        const rectangle2 = new RectangleBuilder(100, 100, 102, 100).build()
        const rectangle3 = new RectangleBuilder(100, 100, 103, 100).build()
        const rectangle4 = new RectangleBuilder(100, 100, 104, 100).build()
        const rectangle5 = new RectangleBuilder(100, 100, 105, 100).build()
        const trapSystem = new TrapSystem()
        trapSystem.addGroup()
        trapSystem.addRectangle(0, rectangle5)
        canvas.getMousePos = jest.fn(() => {
          return {
            x: 150,
            y: 150
          }
        })
        const wrapper = mount(<MapEditor />)
        const instance = wrapper.instance()
        wrapper.setState({ tool: 'select' })
        instance.addItem('spawn', rectangle1)
        instance.addItem('walls', rectangle2)
        instance.addItem('movableWalls', rectangle3)
        instance.addItem('checkpoints', rectangle4)
        instance.addItem('traps', trapSystem)
        instance.mouseDown()
        const state = wrapper.state()
        expect(state.selection).toEqual([
          {
            category: 'spawn',
            element: rectangle1
          },
          {
            category: 'walls',
            index: 0,
            element: rectangle2
          },
          {
            category: 'movableWalls',
            index: 0,
            element: rectangle3
          },
          {
            category: 'traps',
            index: 0,
            groupIndex: 0,
            rectangleIndex: 0,
            element: rectangle5
          },
          {
            category: 'checkpoints',
            index: 0,
            element: rectangle4
          }
        ])
      })
    })
  })
})
