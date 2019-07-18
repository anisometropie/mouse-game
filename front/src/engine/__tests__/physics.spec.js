import Rectangle from 'objects/Rectangle'
import Point from 'objects/Point'
import Circle from 'objects/Circle'

import {
  isPointInRectangle,
  segmentIntersectsCircle,
  circleIntersectsRectangle
} from '../physics'

describe('point in rectangle function', () => {
  it('should return true if point is inside square', () => {
    const rectangle = new Rectangle(100, 100, 100, 100)
    const point = new Point(150, 150)
    expect(isPointInRectangle(point, rectangle)).toBe(true)
  })

  it('should return true if point is inside square border', () => {
    const rectangle = new Rectangle(100, 100, 100, 100)
    const point = new Point(100, 150)
    expect(isPointInRectangle(point, rectangle)).toBe(true)
  })

  it('should return true if point is inside thin rectangle', () => {
    const rectangle = new Rectangle(100, 100, 200, 10)
    const point = new Point(180, 105)
    expect(isPointInRectangle(point, rectangle)).toBe(true)
  })

  it('should return false if point is outside the rectangle', () => {
    const rectangle = new Rectangle(100, 100, 200, 200)
    const point = new Point(50, 50)
    expect(isPointInRectangle(point, rectangle)).toBe(false)
  })
})

describe('segment intersects circle function', () => {
  describe('horizontal segment [AB]', () => {
    const segment = [new Point(0, 0), new Point(100, 0)]
    describe('circle bottom-center', () => {
      it('should return true if segment intersects circle', () => {
        const circle = new Circle(50, 20, 30)
        expect(segmentIntersectsCircle(segment, circle)).toBe(true)
      })
      it('should return false if segment does not intersects circle', () => {
        const circle = new Circle(50, 20, 10)
        expect(segmentIntersectsCircle(segment, circle)).toBe(false)
      })
    })

    describe('circle bottom-right, just below B', () => {
      it('should return true if segment intersects circle', () => {
        const circle = new Circle(100, 20, 30)
        expect(segmentIntersectsCircle(segment, circle)).toBe(true)
      })
      it('should return false if segment does not intersects circle', () => {
        const circle = new Circle(100, 20, 10)
        expect(segmentIntersectsCircle(segment, circle)).toBe(false)
      })
    })

    describe('circle bottom right, to the right of point B', () => {
      it('should return true if segment intersects circle', () => {
        const circle = new Circle(120, 20, 40)
        expect(segmentIntersectsCircle(segment, circle)).toBe(true)
      })
      it('should return true if segment intersects circle', () => {
        const circle = new Circle(120, 20, 30)
        expect(segmentIntersectsCircle(segment, circle)).toBe(true)
      })
      it('should return false if segment does not intersects circle', () => {
        const circle = new Circle(120, 20, 25)
        expect(segmentIntersectsCircle(segment, circle)).toBe(false)
      })
      it('should return false if segment does not intersects circle', () => {
        const circle = new Circle(120, 20, 20)
        expect(segmentIntersectsCircle(segment, circle)).toBe(false)
      })
      it('should return false if segment does not intersects circle', () => {
        const circle = new Circle(120, 20, 10)
        expect(segmentIntersectsCircle(segment, circle)).toBe(false)
      })
    })

    describe('circle right, same level as segment', () => {
      it('should return true if segment intersects circle', () => {
        const circle = new Circle(120, 0, 30)
        expect(segmentIntersectsCircle(segment, circle)).toBe(true)
      })
      it('should return false if segment does not intersects circle', () => {
        const circle = new Circle(120, 0, 10)
        expect(segmentIntersectsCircle(segment, circle)).toBe(false)
      })
    })
  })
})

describe('circle Intersects Rectangle function', () => {
  describe('axis aligned rectangle', () => {
    const rectangle = new Rectangle(0, 0, 20, 10)
    describe('circle center inside rectangle', () => {
      it('should return true if circle is completely inside', () => {
        const circle = new Circle(10, 5, 3)
        expect(circleIntersectsRectangle(circle, rectangle)).toBe(true)
      })
      it('should return true if circle is partially inside', () => {
        const circle = new Circle(10, 9, 3)
        expect(circleIntersectsRectangle(circle, rectangle)).toBe(true)
      })
      it('should return true if circle is partially inside', () => {
        const circle = new Circle(19, 9, 3)
        expect(circleIntersectsRectangle(circle, rectangle)).toBe(true)
      })
      it('should return true if circle center is on the edge', () => {
        const circle = new Circle(20, 5, 3)
        expect(circleIntersectsRectangle(circle, rectangle)).toBe(true)
      })
      it('should return true if circle wraps rectangle completely', () => {
        const circle = new Circle(15, 5, 20)
        expect(circleIntersectsRectangle(circle, rectangle)).toBe(true)
      })
    })

    describe('circle center outside rectangle', () => {
      describe('circle to the right-center of rectangle', () => {
        it('should return true if circle intersects rectangle', () => {
          const circle = new Circle(25, 5, 10)
          expect(circleIntersectsRectangle(circle, rectangle)).toBe(true)
        })
        it('should return false if circle does not intersects rectangle', () => {
          const circle = new Circle(25, 5, 3)
          expect(circleIntersectsRectangle(circle, rectangle)).toBe(false)
        })
      })

      describe('circle 45° of B vertex', () => {
        it('should return true if circle intersects rectangle', () => {
          const circle = new Circle(25, 15, 10)
          expect(circleIntersectsRectangle(circle, rectangle)).toBe(true)
        })
        it('should return false if circle does not intersects rectangle', () => {
          const circle = new Circle(25, 15, 6)
          expect(circleIntersectsRectangle(circle, rectangle)).toBe(false)
        })
        it('should return false if circle does not intersects rectangle', () => {
          const circle = new Circle(25, 15, 5)
          expect(circleIntersectsRectangle(circle, rectangle)).toBe(false)
        })
      })

      describe('circle aligned with one edge', () => {
        it('should return false if circle does not intersects rectangle', () => {
          const circle = new Circle(20, 20, 5)
          expect(circleIntersectsRectangle(circle, rectangle)).toBe(false)
        })
        it('should return false if circle does not intersects rectangle', () => {
          const circle = new Circle(0, 20, 5)
          expect(circleIntersectsRectangle(circle, rectangle)).toBe(false)
        })
        it('should return false if circle does not intersects rectangle', () => {
          const circle = new Circle(20, -10, 5)
          expect(circleIntersectsRectangle(circle, rectangle)).toBe(false)
        })
        it('should return false if circle does not intersects rectangle', () => {
          const circle = new Circle(0, -10, 5)
          expect(circleIntersectsRectangle(circle, rectangle)).toBe(false)
        })
      })
    })
  })
})
