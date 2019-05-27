import Rectangle from '../Rectangle'

describe('Rectangle class', () => {
  it('should return its correct vertices', () => {
    const rect = new Rectangle(100, 100, 100, 100)
    expect(rect.vertices).toEqual({
      A: { x: 100, y: 100 },
      B: { x: 200, y: 100 },
      C: { x: 200, y: 200 },
      D: { x: 100, y: 200 }
    })
  })
})
