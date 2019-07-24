import React from 'react'
import { shallow, mount, render } from 'enzyme'

import MapEditor from '../MapEditor'
import Color from 'effects/Color'
// const canvas = require.requireActual('utils/canvas')
// canvas.getMousePos = jest.fn((c, coords) => {
//   return coords
// })
jest.mock('engine/physics')
jest.mock('components/Game')

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
      instance.mouseUp()
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
      instance.mouseUp()
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
      instance.mouseUp()
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
      instance.mouseUp()
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
      instance.mouseUp()
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
      instance.mouseUp()
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
      instance.mouseUp()
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
      instance.mouseUp()
      const state = wrapper.state()
      const rectangle = state.currentWorld.checkpoints[0]
      expect(rectangle.constructor.name).toEqual('Rectangle')
    })
  })
})
