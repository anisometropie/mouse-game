import Point from '../Point'

describe('Point class', () => {
  describe('distanceBetween', () => {})
  describe('distanceToSegment', () => {
    describe('horizontal segment (-1,0) (1,0)', () => {
      const A = new Point(-1, 0)
      const B = new Point(1, 0)
      describe('point with y=1', () => {
        it('should return sqrt(2) with C=(-2,1)', () => {
          const C = new Point(-2, 1)
          expect(Point.distanceToSegment(C, [A, B])).toBeCloseTo(Math.sqrt(2))
        })
        it('should return 1 with C=(-1,1)', () => {
          const C = new Point(-1, 1)
          expect(Point.distanceToSegment(C, [A, B])).toEqual(1)
        })
        it('should return 1 with C=(0,1)', () => {
          const C = new Point(0, 1)
          expect(Point.distanceToSegment(C, [A, B])).toEqual(1)
        })
        it('should return 1 with C=(1,1)', () => {
          const C = new Point(1, 1)
          expect(Point.distanceToSegment(C, [A, B])).toEqual(1)
        })
        it('should return sqrt(2) with C=(2,1)', () => {
          const C = new Point(2, 1)
          expect(Point.distanceToSegment(C, [A, B])).toBeCloseTo(Math.sqrt(2))
        })
      })

      describe('points with y=0', () => {
        it('should return 1 with C=(-2,0)', () => {
          const C = new Point(-2, 0)
          expect(Point.distanceToSegment(C, [A, B])).toEqual(1)
        })
        it('should return 0 with C=(-1,0)', () => {
          const C = new Point(-1, 0)
          expect(Point.distanceToSegment(C, [A, B])).toEqual(0)
        })
        it('should return 0 with C=(0,0)', () => {
          const C = new Point(0, 0)
          expect(Point.distanceToSegment(C, [A, B])).toEqual(0)
        })
        it('should return 0 with C=(1,0)', () => {
          const C = new Point(1, 0)
          expect(Point.distanceToSegment(C, [A, B])).toEqual(0)
        })
        it('should return 1 with C=(2,0)', () => {
          const C = new Point(2, 0)
          expect(Point.distanceToSegment(C, [A, B])).toEqual(1)
        })
      })

      describe('point with y=-1', () => {
        it('should return sqrt(2) with C=(-2,-1)', () => {
          const C = new Point(-2, -1)
          expect(Point.distanceToSegment(C, [A, B])).toBeCloseTo(Math.sqrt(2))
        })
        it('should return 1 with C=(-1,-1)', () => {
          const C = new Point(-1, -1)
          expect(Point.distanceToSegment(C, [A, B])).toEqual(1)
        })
        it('should return 1 with C=(0,-1)', () => {
          const C = new Point(0, -1)
          expect(Point.distanceToSegment(C, [A, B])).toEqual(1)
        })
        it('should return 1 with C=(1,-1)', () => {
          const C = new Point(1, -1)
          expect(Point.distanceToSegment(C, [A, B])).toEqual(1)
        })
        it('should return sqrt(2) with C=(2,-1)', () => {
          const C = new Point(2, -1)
          expect(Point.distanceToSegment(C, [A, B])).toBeCloseTo(Math.sqrt(2))
        })
      })
    })
  })
})
