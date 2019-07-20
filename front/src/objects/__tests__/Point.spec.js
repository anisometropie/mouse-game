import Point from '../Point'
import Vector from '../Vector'

describe('Point class', () => {
  describe('distanceBetween', () => {})

  describe('distanceToSegment', () => {
    describe('horizontal segment (-1,0) (1,0)', () => {
      const A = new Point(-1, 0)
      const B = new Point(1, 0)
      describe('point with y=1', () => {
        it('should return sqrt(2) with C=(-2,1)', () => {
          const C = new Point(-2, 1)
          expect(Point.distanceToSegment(C, [A, B]).distance).toBeCloseTo(
            Math.sqrt(2)
          )
        })
        it('should return 1 with C=(-1,1)', () => {
          const C = new Point(-1, 1)
          expect(Point.distanceToSegment(C, [A, B]).distance).toEqual(1)
        })
        it('should return 1 with C=(0,1)', () => {
          const C = new Point(0, 1)
          expect(Point.distanceToSegment(C, [A, B]).distance).toEqual(1)
        })
        it('should return 1 with C=(1,1)', () => {
          const C = new Point(1, 1)
          expect(Point.distanceToSegment(C, [A, B]).distance).toEqual(1)
        })
        it('should return sqrt(2) with C=(2,1)', () => {
          const C = new Point(2, 1)
          expect(Point.distanceToSegment(C, [A, B]).distance).toBeCloseTo(
            Math.sqrt(2)
          )
        })
      })

      describe('points with y=0', () => {
        it('should return 1 with C=(-2,0)', () => {
          const C = new Point(-2, 0)
          expect(Point.distanceToSegment(C, [A, B]).distance).toEqual(1)
        })
        it('should return 0 with C=(-1,0)', () => {
          const C = new Point(-1, 0)
          expect(Point.distanceToSegment(C, [A, B]).distance).toEqual(0)
        })
        it('should return 0 with C=(0,0)', () => {
          const C = new Point(0, 0)
          expect(Point.distanceToSegment(C, [A, B]).distance).toEqual(0)
        })
        it('should return 0 with C=(1,0)', () => {
          const C = new Point(1, 0)
          expect(Point.distanceToSegment(C, [A, B]).distance).toEqual(0)
        })
        it('should return 1 with C=(2,0)', () => {
          const C = new Point(2, 0)
          expect(Point.distanceToSegment(C, [A, B]).distance).toEqual(1)
        })
      })

      describe('point with y=-1', () => {
        it('should return sqrt(2) with C=(-2,-1)', () => {
          const C = new Point(-2, -1)
          expect(Point.distanceToSegment(C, [A, B]).distance).toBeCloseTo(
            Math.sqrt(2)
          )
        })
        it('should return 1 with C=(-1,-1)', () => {
          const C = new Point(-1, -1)
          expect(Point.distanceToSegment(C, [A, B]).distance).toEqual(1)
        })
        it('should return 1 with C=(0,-1)', () => {
          const C = new Point(0, -1)
          expect(Point.distanceToSegment(C, [A, B]).distance).toEqual(1)
        })
        it('should return 1 with C=(1,-1)', () => {
          const C = new Point(1, -1)
          expect(Point.distanceToSegment(C, [A, B]).distance).toEqual(1)
        })
        it('should return sqrt(2) with C=(2,-1)', () => {
          const C = new Point(2, -1)
          expect(Point.distanceToSegment(C, [A, B]).distance).toBeCloseTo(
            Math.sqrt(2)
          )
        })
      })
    })
  })

  describe('static move method', () => {
    it('should move using x,y', () => {
      const point = new Point(0, 0)
      Point.move(point, 30, 20)
      expect(point.x).toEqual(30)
      expect(point.y).toEqual(20)
    })
    it('should move using a point', () => {
      const point = new Point(0, 0)
      const newCoords = new Point(2, 15)
      Point.move(point, newCoords)
      expect(point.x).toEqual(2)
      expect(point.y).toEqual(15)
    })
  })

  describe('move method', () => {
    it('should move using x,y', () => {
      const point = new Point(0, 0)
      point.move(300, 200)
      expect(point.x).toEqual(300)
      expect(point.y).toEqual(200)
    })
    it('should move using a point', () => {
      const point = new Point(0, 0)
      const newCoords = new Point(25, 155)
      point.move(newCoords)
      expect(point.x).toEqual(25)
      expect(point.y).toEqual(155)
    })
  })

  describe('static translate method', () => {
    it('should move using x,y', () => {
      const point = new Point(10, 100)
      Point.translate(point, 300, 200)
      expect(point.x).toEqual(310)
      expect(point.y).toEqual(300)
    })
    it('should move using a vector', () => {
      const point = new Point(10, 10)
      const vector = new Vector(250, 155)
      Point.translate(point, vector)
      expect(point.x).toEqual(260)
      expect(point.y).toEqual(165)
    })
  })

  describe('translate method', () => {
    it('should move using x,y', () => {
      const point = new Point(100, 100)
      point.translate(300, 200)
      expect(point.x).toEqual(400)
      expect(point.y).toEqual(300)
    })
    it('should move using a vector', () => {
      const point = new Point(100, 100)
      const vector = new Vector(25, 155)
      point.translate(vector)
      expect(point.x).toEqual(125)
      expect(point.y).toEqual(255)
    })
  })
})
