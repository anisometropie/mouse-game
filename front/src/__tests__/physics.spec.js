import Rectangle from '../Rectangle'
import user from '../user'

import {
  isPointInRectangle,
  segmentIntersectsCircle,
  circleIntersectsRectangle
} from '../physics'

describe('point in rectangle', () => {
  it('should return true if point is inside square', () => {
    const rectangle = new Rectangle(100, 100, 100, 100)
    const point = { x: 150, y: 150 }
    expect(isPointInRectangle(point, rectangle)).toBe(true)
  })

  it('should return true if point is inside square border', () => {
    const rectangle = new Rectangle(100, 100, 100, 100)
    const point = { x: 100, y: 150 }
    expect(isPointInRectangle(point, rectangle)).toBe(true)
  })

  it('should return true if point is inside thin rectangle', () => {
    const rectangle = new Rectangle(100, 100, 200, 10)
    const point = { x: 180, y: 105 }
    expect(isPointInRectangle(point, rectangle)).toBe(true)
  })

  it('should return false if point is outside the rectangle', () => {
    const rectangle = new Rectangle(100, 100, 200, 200)
    const point = { x: 50, y: 50 }
    expect(isPointInRectangle(point, rectangle)).toBe(false)
  })
})

describe('segment intersects circle', () => {
  it('should return true if segment intersects circle', () => {
    const segment = [{ x: 0, y: 0 }, { x: 100, y: 0 }]
    const circle = new user(null, null, 50, 25, 30)
    expect(segmentIntersectsCircle(segment, circle)).toBe(true)
  })

  it('should return false if segment does not intersects circle', () => {
    const segment = [{ x: 0, y: 0 }, { x: 100, y: 0 }]
    const circle = new user(null, null, 50, 25, 10)
    expect(segmentIntersectsCircle(segment, circle)).toBe(false)
  })

  it('should return true if segment intersects circle', () => {
    const segment = [{ x: 0, y: 0 }, { x: 100, y: 0 }]
    const circle = new user(null, null, 105, 25, 30)
    expect(segmentIntersectsCircle(segment, circle)).toBe(true)
  })

  it('should return false if segment does not intersects circle', () => {
    const segment = [{ x: 0, y: 0 }, { x: 100, y: 0 }]
    const circle = new user(null, null, 105, 25, 10)
    expect(segmentIntersectsCircle(segment, circle)).toBe(false)
  })

  it('should return false if segment does not intersects circle', () => {
    const segment = [{ x: 0, y: 0 }, { x: 100, y: 0 }]
    const circle = new user(null, null, 100, 25, 10)
    expect(segmentIntersectsCircle(segment, circle)).toBe(false)
  })

  it('should return true if segment intersects circle', () => {
    const segment = [{ x: 0, y: 0 }, { x: 100, y: 0 }]
    const circle = new user(null, null, 110, 0, 15)
    expect(segmentIntersectsCircle(segment, circle)).toBe(true)
  })

  it('should return false if segment does not intersects circle', () => {
    const segment = [{ x: 0, y: 0 }, { x: 100, y: 0 }]
    const circle = new user(null, null, 110, 0, 8)
    expect(segmentIntersectsCircle(segment, circle)).toBe(false)
  })
})
