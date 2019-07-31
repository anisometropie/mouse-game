import TrapSystem from '../TrapSystem'
import RectangleBuilder from 'objects/Rectangle'
import Interval from 'objects/Interval'

describe('Trap System', () => {
  describe('editing timing', () => {
    it('should edit timing correctly', () => {
      const trapSystem = new TrapSystem(
        0,
        0,
        [
          {
            traps: [new RectangleBuilder(200, 120, 120, 160).build()],
            timing: new Interval('[0, 500[')
          },
          {
            traps: [new RectangleBuilder(320, 120, 40, 40).build()],
            timing: new Interval('[1000, 1500]')
          }
        ],
        2000
      )
      trapSystem.editTiming(1, 2000, 3000)
      expect(trapSystem.groups[1].timing.leftBound).toEqual(2000)
      expect(trapSystem.groups[1].timing.rightBound).toEqual(3000)
    })
    it('should edit timing correctly (with immutability)', () => {
      const trapSystem = new TrapSystem(
        0,
        0,
        [
          {
            traps: [new RectangleBuilder(200, 120, 120, 160).build()],
            timing: new Interval('[0, 500[')
          },
          {
            traps: [new RectangleBuilder(320, 120, 40, 40).build()],
            timing: new Interval('[1000, 1500]')
          }
        ],
        2000
      )
      const editedTrapSystem = trapSystem.editedTiming(1, 2000, 3000)
      expect(editedTrapSystem.groups[1].timing.leftBound).toEqual(2000)
      expect(editedTrapSystem.groups[1].timing.rightBound).toEqual(3000)
      expect(editedTrapSystem).not.toBe(trapSystem)
    })
  })

  describe('adding rectangle', () => {
    it('should add rectangle correctly', () => {
      const trapSystem = new TrapSystem(
        0,
        0,
        [
          {
            traps: [new RectangleBuilder(200, 120, 120, 160).build()],
            timing: new Interval('[0, 500[')
          },
          {
            traps: [
              new RectangleBuilder(320, 120, 40, 40).build(),
              new RectangleBuilder(320, 120, 400, 40).build()
            ],
            timing: new Interval('[1000, 1500]')
          },
          {
            traps: [
              new RectangleBuilder(320, 120, 40, 40).build(),
              new RectangleBuilder(3200, 1200, 4000, 40).build()
            ],
            timing: new Interval('[1000, 1500]')
          }
        ],
        2000
      )
      const newRectangle = new RectangleBuilder(666, 666, 999, 40).build()
      trapSystem.addRectangle(2, newRectangle)
      expect(trapSystem.groups[2]).toEqual({
        traps: [
          new RectangleBuilder(320, 120, 40, 40).build(),
          new RectangleBuilder(3200, 1200, 4000, 40).build(),
          newRectangle
        ],
        timing: new Interval('[1000, 1500]')
      })
    })
    it('should add rectangle correctly (with immutability)', () => {
      const trapSystem = new TrapSystem(
        0,
        0,
        [
          {
            traps: [new RectangleBuilder(200, 120, 120, 160).build()],
            timing: new Interval('[0, 500[')
          },
          {
            traps: [
              new RectangleBuilder(320, 120, 40, 40).build(),
              new RectangleBuilder(320, 120, 400, 40).build()
            ],
            timing: new Interval('[1000, 1500]')
          },
          {
            traps: [
              new RectangleBuilder(320, 120, 40, 40).build(),
              new RectangleBuilder(3200, 1200, 4000, 40).build()
            ],
            timing: new Interval('[1000, 1500]')
          }
        ],
        2000
      )
      const newRectangle = new RectangleBuilder(666, 666, 999, 40).build()
      const editedTrapSystem = trapSystem.addedRectangle(2, newRectangle)
      expect(editedTrapSystem.groups[2]).toEqual({
        traps: [
          new RectangleBuilder(320, 120, 40, 40).build(),
          new RectangleBuilder(3200, 1200, 4000, 40).build(),
          newRectangle
        ],
        timing: new Interval('[1000, 1500]')
      })
      expect(editedTrapSystem).not.toBe(trapSystem)
    })
  })

  describe('deleting rectangle', () => {
    it('should delete rectangle correctly', () => {
      const trapSystem = new TrapSystem(
        0,
        0,
        [
          {
            traps: [
              new RectangleBuilder(0, 0, 120, 160).build(),
              new RectangleBuilder(1, 0, 120, 160).build(),
              new RectangleBuilder(2, 0, 120, 160).build()
            ],
            timing: new Interval('[0, 500[')
          }
        ],
        4444
      )
      trapSystem.deleteRectangle(0, 1)
      expect(trapSystem.groups[0]).toEqual({
        traps: [
          new RectangleBuilder(0, 0, 120, 160).build(),
          new RectangleBuilder(2, 0, 120, 160).build()
        ],
        timing: new Interval('[0, 500[')
      })
    })
    it('should delete rectangle correctly', () => {
      const trapSystem = new TrapSystem(
        0,
        0,
        [
          {
            traps: [
              new RectangleBuilder(0, 0, 120, 160).build(),
              new RectangleBuilder(1, 0, 120, 160).build(),
              new RectangleBuilder(2, 0, 120, 160).build()
            ],
            timing: new Interval('[0, 500[')
          }
        ],
        4444
      )
      const editedTrapSystem = trapSystem.deletedRectangle(0, 1)
      expect(editedTrapSystem.groups[0]).toEqual({
        traps: [
          new RectangleBuilder(0, 0, 120, 160).build(),
          new RectangleBuilder(2, 0, 120, 160).build()
        ],
        timing: new Interval('[0, 500[')
      })
      expect(editedTrapSystem).not.toBe(trapSystem)
    })
  })
})
