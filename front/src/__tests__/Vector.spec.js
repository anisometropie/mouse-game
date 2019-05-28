import Vector from '../Vector'
import Point from '../Point'

describe('vector class', () => {
  describe('constructor', () => {
    const vector = new Vector(2, 3)
    it('should return vector object', () => {
      expect(vector.constructor).toEqual(Vector)
    })
    it('should return vector object', () => {
      expect(vector.x).toEqual(2)
    })
    it('should return vector object', () => {
      expect(vector.y).toEqual(3)
    })
  })

  describe('static fromPoints', () => {
    const start = new Point(2, 1)
    const end = new Point(3, 4)
    const vector = Vector.fromPoints(start, end)
    it('should create new vector', () => {
      expect(vector.constructor).toEqual(Vector)
    })
    it('should create vector with correct x', () => {
      expect(vector.x).toEqual(1)
    })
    it('should create vector with correct y', () => {
      expect(vector.y).toEqual(3)
    })

    describe('clone', () => {
      const vector = new Vector(2, 3)
      const clone = vector.clone()
      it('should return a vector object', () => {
        expect(clone.constructor).toEqual(Vector)
      })
      it('should return a different object', () => {
        expect(clone).not.toBe(vector)
      })
      it('should have same x', () => {
        expect(clone.x).toEqual(vector.x)
      })
      it('should have same y', () => {
        expect(clone.y).toEqual(vector.y)
      })
    })

    describe('static dotProduct', () => {})

    describe('dotProduct', () => {})

    describe('static rotate', () => {
      describe('rotating (1,0) by PI', () => {
        const vector = new Vector(1, 0)
        const initialLength = vector.length
        Vector.rotate(vector, Math.PI)
        it('should have correct x', () => {
          expect(vector.x).toBeCloseTo(-1, 9)
        })
        it('should have correct y', () => {
          expect(vector.y).toBeCloseTo(0, 9)
        })
        it('should have same length', () => {
          expect(vector.length).toEqual(initialLength)
        })
      })
      describe('rotating (1,3) by PI/2', () => {
        const vector = new Vector(1, 3)
        const initialLength = vector.length
        Vector.rotate(vector, Math.PI / 2)
        it('should have correct x', () => {
          expect(vector.x).toBeCloseTo(-3, 9)
        })
        it('should have correct y', () => {
          expect(vector.y).toBeCloseTo(1, 9)
        })
        it('should have same length', () => {
          expect(vector.length).toEqual(initialLength)
        })
      })
    })

    describe('rotate', () => {
      it('should work the same way as static function', () => {
        const u = new Vector(11, 2)
        const v = new Vector(11, 2)
        Vector.rotate(u, Math.PI)
        v.rotate(Math.PI)
        expect(u.x).toEqual(v.x)
        expect(u.y).toEqual(v.y)
      })
    })

    describe('static rotated', () => {
      it('should work the same way as static rotate', () => {
        const u = new Vector(3, 4)
        const v = new Vector(3, 4)
        Vector.rotate(u, Math.PI)
        const rotatedV = Vector.rotated(v, Math.PI)
        expect(u.x).toEqual(rotatedV.x)
        expect(u.y).toEqual(rotatedV.y)
      })
      it('should not mutate original vector', () => {
        const u = new Vector(3, 4)
        const rotated = Vector.rotated(u, 4)
        expect(u.x).toEqual(3)
        expect(u.y).toEqual(4)
      })
    })

    describe('rotated', () => {
      it('should work the same way as static rotated', () => {
        const u = new Vector(23, 44)
        const v = new Vector(23, 44)
        const rotatedU = Vector.rotated(u, Math.PI)
        const rotatedV = v.rotated(Math.PI)
        expect(rotatedU.x).toEqual(rotatedV.x)
        expect(rotatedU.y).toEqual(rotatedV.y)
      })
    })

    describe('get length', () => {})
  })
})
