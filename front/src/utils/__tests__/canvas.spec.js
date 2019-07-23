import Point from 'objects/Point'
import { pixelToGrid } from '../canvas'

describe('pixelToGrid function', () => {
  it('should convert (10, 20) to pixel grid coordinates', () => {
    const point = new Point(10, 20)
    const ratio = 40
    const coords = pixelToGrid(point, ratio)
    expect(coords.x).toEqual(0)
    expect(coords.y).toEqual(0)
  })
  it('should convert ( 40, 40) to pixel grid coordinates', () => {
    const point = new Point(40, 40)
    const ratio = 40
    const coords = pixelToGrid(point, ratio)
    expect(coords.x).toEqual(1)
    expect(coords.y).toEqual(1)
  })
  it('should convert (155, 215) to pixel grid coordinates', () => {
    const point = new Point(155, 215)
    const ratio = 40
    const coords = pixelToGrid(point, ratio)
    expect(coords.x).toEqual(3)
    expect(coords.y).toEqual(5)
  })
})
