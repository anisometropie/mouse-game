import { Rectangle } from '../Rectangle'

jest.mock('engine/physics')

describe('Rectangle class', () => {
  it('should return its correct vertices coordinates', () => {
    const rect = new Rectangle(100, 100, 100, 100)
    const { A, B, C, D } = rect.vertices
    expect(A.x).toEqual(100)
    expect(A.y).toEqual(100)
    expect(B.x).toEqual(200)
    expect(B.y).toEqual(100)
    expect(C.x).toEqual(200)
    expect(C.y).toEqual(200)
    expect(D.x).toEqual(100)
    expect(D.y).toEqual(200)
  })
})
