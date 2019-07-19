import Wall from '../Wall'
import Point from 'objects/Point'

jest.mock('engine/physics')

describe('Wall class', () => {
  describe('constructor', () => {
    describe('one section wall', () => {
      it('should handle creating a rectangle bottom to top', () => {
        const wall = new Wall([new Point(0, 0), new Point(0, -10)], 5)
        expect(wall.rectangles[0].x).toEqual(0)
        expect(wall.rectangles[0].y).toEqual(-10)
        expect(wall.rectangles[0].width).toEqual(5)
        expect(wall.rectangles[0].height).toEqual(10)
      })
      it('should handle creating a rectangle left to right', () => {
        const wall = new Wall([new Point(0, 0), new Point(10, 0)], 5)
        expect(wall.rectangles[0].x).toEqual(0)
        expect(wall.rectangles[0].y).toEqual(0)
        expect(wall.rectangles[0].width).toEqual(10)
        expect(wall.rectangles[0].height).toEqual(5)
      })
      it('should handle creating a rectangle top to bottom', () => {
        const wall = new Wall([new Point(0, 0), new Point(0, 10)], 5)
        expect(wall.rectangles[0].x).toEqual(0)
        expect(wall.rectangles[0].y).toEqual(0)
        expect(wall.rectangles[0].width).toEqual(5)
        expect(wall.rectangles[0].height).toEqual(10)
      })
      it('should handle creating a rectangle right to left', () => {
        const wall = new Wall([new Point(0, 0), new Point(-10, 0)], 5)
        expect(wall.rectangles[0].x).toEqual(-10)
        expect(wall.rectangles[0].y).toEqual(0)
        expect(wall.rectangles[0].width).toEqual(10)
        expect(wall.rectangles[0].height).toEqual(5)
      })
    })
    describe('two sections wall', () => {
      it('up —> up', () => {
        const wall = new Wall(
          [new Point(0, 0), new Point(0, -10), new Point(0, -20)],
          5
        )
        expect(wall.rectangles[0].x).toEqual(0)
        expect(wall.rectangles[0].y).toEqual(-10)
        expect(wall.rectangles[0].width).toEqual(5)
        expect(wall.rectangles[0].height).toEqual(10)
        expect(wall.rectangles[1].x).toEqual(0)
        expect(wall.rectangles[1].y).toEqual(-20)
        expect(wall.rectangles[1].width).toEqual(5)
        expect(wall.rectangles[1].height).toEqual(10)
      })
      it('up —> right', () => {
        const wall = new Wall(
          [new Point(0, 0), new Point(0, -10), new Point(10, -10)],
          5
        )
        expect(wall.rectangles[0].x).toEqual(0)
        expect(wall.rectangles[0].y).toEqual(-10)
        expect(wall.rectangles[0].width).toEqual(5)
        expect(wall.rectangles[0].height).toEqual(10)
        expect(wall.rectangles[1].x).toEqual(5)
        expect(wall.rectangles[1].y).toEqual(-10)
        expect(wall.rectangles[1].width).toEqual(5)
        expect(wall.rectangles[1].height).toEqual(5)
      })
      it('up —> left', () => {
        const wall = new Wall(
          [new Point(0, 0), new Point(0, -10), new Point(-10, -10)],
          5
        )
        expect(wall.rectangles[0].x).toEqual(0)
        expect(wall.rectangles[0].y).toEqual(-10)
        expect(wall.rectangles[0].width).toEqual(5)
        expect(wall.rectangles[0].height).toEqual(10)
        expect(wall.rectangles[1].x).toEqual(-10)
        expect(wall.rectangles[1].y).toEqual(-10)
        expect(wall.rectangles[1].width).toEqual(10)
        expect(wall.rectangles[1].height).toEqual(5)
      })

      it('right —> right', () => {
        const wall = new Wall(
          [new Point(0, 0), new Point(10, 0), new Point(20, 0)],
          5
        )
        expect(wall.rectangles[0].x).toEqual(0)
        expect(wall.rectangles[0].y).toEqual(0)
        expect(wall.rectangles[0].width).toEqual(10)
        expect(wall.rectangles[0].height).toEqual(5)
        expect(wall.rectangles[1].x).toEqual(10)
        expect(wall.rectangles[1].y).toEqual(0)
        expect(wall.rectangles[1].width).toEqual(10)
        expect(wall.rectangles[1].height).toEqual(5)
      })
      it('right —> down', () => {
        const wall = new Wall(
          [new Point(0, 0), new Point(10, 0), new Point(10, 10)],
          5
        )
        expect(wall.rectangles[0].x).toEqual(0)
        expect(wall.rectangles[0].y).toEqual(0)
        expect(wall.rectangles[0].width).toEqual(10)
        expect(wall.rectangles[0].height).toEqual(5)
        expect(wall.rectangles[1].x).toEqual(10)
        expect(wall.rectangles[1].y).toEqual(0)
        expect(wall.rectangles[1].width).toEqual(5)
        expect(wall.rectangles[1].height).toEqual(10)
      })
      it('right —> up', () => {
        const wall = new Wall(
          [new Point(0, 0), new Point(10, 0), new Point(10, -10)],
          5
        )
        expect(wall.rectangles[0].x).toEqual(0)
        expect(wall.rectangles[0].y).toEqual(0)
        expect(wall.rectangles[0].width).toEqual(10)
        expect(wall.rectangles[0].height).toEqual(5)
        expect(wall.rectangles[1].x).toEqual(10)
        expect(wall.rectangles[1].y).toEqual(-10)
        expect(wall.rectangles[1].width).toEqual(5)
        expect(wall.rectangles[1].height).toEqual(15)
      })

      it('down —> down', () => {
        const wall = new Wall(
          [new Point(0, 0), new Point(0, 10), new Point(0, 20)],
          5
        )
        expect(wall.rectangles[0].x).toEqual(0)
        expect(wall.rectangles[0].y).toEqual(0)
        expect(wall.rectangles[0].width).toEqual(5)
        expect(wall.rectangles[0].height).toEqual(10)
        expect(wall.rectangles[1].x).toEqual(0)
        expect(wall.rectangles[1].y).toEqual(10)
        expect(wall.rectangles[1].width).toEqual(5)
        expect(wall.rectangles[1].height).toEqual(10)
      })
      it('down —> left', () => {
        const wall = new Wall(
          [new Point(0, 0), new Point(0, 10), new Point(-10, 10)],
          5
        )
        expect(wall.rectangles[0].x).toEqual(0)
        expect(wall.rectangles[0].y).toEqual(0)
        expect(wall.rectangles[0].width).toEqual(5)
        expect(wall.rectangles[0].height).toEqual(10)
        expect(wall.rectangles[1].x).toEqual(-10)
        expect(wall.rectangles[1].y).toEqual(10)
        expect(wall.rectangles[1].width).toEqual(15)
        expect(wall.rectangles[1].height).toEqual(5)
      })
      it('down —> right', () => {
        const wall = new Wall(
          [new Point(0, 0), new Point(0, 10), new Point(10, 10)],
          5
        )
        expect(wall.rectangles[0].x).toEqual(0)
        expect(wall.rectangles[0].y).toEqual(0)
        expect(wall.rectangles[0].width).toEqual(5)
        expect(wall.rectangles[0].height).toEqual(10)
        expect(wall.rectangles[1].x).toEqual(0)
        expect(wall.rectangles[1].y).toEqual(10)
        expect(wall.rectangles[1].width).toEqual(10)
        expect(wall.rectangles[1].height).toEqual(5)
      })

      it('left —> left', () => {
        const wall = new Wall(
          [new Point(0, 0), new Point(-10, 0), new Point(-20, 0)],
          5
        )
        expect(wall.rectangles[0].x).toEqual(-10)
        expect(wall.rectangles[0].y).toEqual(0)
        expect(wall.rectangles[0].width).toEqual(10)
        expect(wall.rectangles[0].height).toEqual(5)
        expect(wall.rectangles[1].x).toEqual(-20)
        expect(wall.rectangles[1].y).toEqual(0)
        expect(wall.rectangles[1].width).toEqual(10)
        expect(wall.rectangles[1].height).toEqual(5)
      })
      it('left —> up', () => {
        const wall = new Wall(
          [new Point(0, 0), new Point(-10, 0), new Point(-10, -10)],
          5
        )
        expect(wall.rectangles[0].x).toEqual(-10)
        expect(wall.rectangles[0].y).toEqual(0)
        expect(wall.rectangles[0].width).toEqual(10)
        expect(wall.rectangles[0].height).toEqual(5)
        expect(wall.rectangles[1].x).toEqual(-10)
        expect(wall.rectangles[1].y).toEqual(-10)
        expect(wall.rectangles[1].width).toEqual(5)
        expect(wall.rectangles[1].height).toEqual(10)
      })
      it('left —> down', () => {
        const wall = new Wall(
          [new Point(0, 0), new Point(-10, 0), new Point(-10, 10)],
          5
        )
        expect(wall.rectangles[0].x).toEqual(-10)
        expect(wall.rectangles[0].y).toEqual(0)
        expect(wall.rectangles[0].width).toEqual(10)
        expect(wall.rectangles[0].height).toEqual(5)
        expect(wall.rectangles[1].x).toEqual(-10)
        expect(wall.rectangles[1].y).toEqual(5)
        expect(wall.rectangles[1].width).toEqual(5)
        expect(wall.rectangles[1].height).toEqual(5)
      })
    })
  })
})
