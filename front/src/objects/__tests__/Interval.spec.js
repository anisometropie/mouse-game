import Interval from '../Interval'

describe('Interval class', () => {
  describe('constructor', () => {
    it('should create [0,1] correctly', () => {
      const interval = new Interval('[0,1]')
      expect(interval.leftBound).toEqual(0)
      expect(interval.rightBound).toEqual(1)
      expect(interval.leftOpen).toEqual(false)
      expect(interval.rightOpen).toEqual(false)
    })
    it('should create ]0,1[ correctly', () => {
      const interval = new Interval(']0,1[')
      expect(interval.leftBound).toEqual(0)
      expect(interval.rightBound).toEqual(1)
      expect(interval.leftOpen).toEqual(true)
      expect(interval.rightOpen).toEqual(true)
    })
    it('should create ]-100,1000[ correctly', () => {
      const interval = new Interval(']-100,1000[')
      expect(interval.leftBound).toEqual(-100)
      expect(interval.rightBound).toEqual(1000)
      expect(interval.leftOpen).toEqual(true)
      expect(interval.rightOpen).toEqual(true)
    })
  })

  describe('contains', () => {
    describe('with [0,1]', () => {
      const interval = new Interval('[0,1]')
      expect(interval.contains(-1)).toEqual(false)
      expect(interval.contains(0)).toEqual(true)
      expect(interval.contains(0.5)).toEqual(true)
      expect(interval.contains(1)).toEqual(true)
      expect(interval.contains(2)).toEqual(false)
    })
    describe('with ]0,1]', () => {
      const interval = new Interval(']0,1]')
      expect(interval.contains(-1)).toEqual(false)
      expect(interval.contains(0)).toEqual(false)
      expect(interval.contains(0.5)).toEqual(true)
      expect(interval.contains(1)).toEqual(true)
      expect(interval.contains(2)).toEqual(false)
    })
    describe('with [0,1[', () => {
      const interval = new Interval('[0,1[')
      expect(interval.contains(-1)).toEqual(false)
      expect(interval.contains(0)).toEqual(true)
      expect(interval.contains(0.5)).toEqual(true)
      expect(interval.contains(1)).toEqual(false)
      expect(interval.contains(2)).toEqual(false)
    })
    describe('with ]0,1[', () => {
      const interval = new Interval(']0,1[')
      expect(interval.contains(-1)).toEqual(false)
      expect(interval.contains(0)).toEqual(false)
      expect(interval.contains(0.5)).toEqual(true)
      expect(interval.contains(1)).toEqual(false)
      expect(interval.contains(2)).toEqual(false)
    })
  })
})
