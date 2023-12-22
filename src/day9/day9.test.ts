import { getNextChainValue } from './day9' // Ensure this path is correct

const testInput = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`

const lines = testInput.split('\n').map((l) => l.split(' ').map(Number))

describe('day9Part01', () => {
  it('should get the next value in chain', () => {
    expect(getNextChainValue(lines[0])).toEqual(18)
    expect(getNextChainValue(lines[1])).toEqual(28)
    expect(getNextChainValue(lines[2])).toEqual(68)
  })
})

describe('day9Part02', () => {
  it('should get the previous value in chain', () => {
    expect(getNextChainValue(lines[0].reverse())).toEqual(-3)
    expect(getNextChainValue(lines[1].reverse())).toEqual(0)
    expect(getNextChainValue(lines[2].reverse())).toEqual(5)
  })
})
