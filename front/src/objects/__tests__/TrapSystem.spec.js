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
})
