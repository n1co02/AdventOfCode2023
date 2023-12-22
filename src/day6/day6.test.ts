import {
  calculateTotalWinningWays,
  parseInput,
  parseInputPartTwo,
} from './day6'

const testInput = `Time:      7  15   30
Distance:  9  40  200`

describe('day06Part01', () => {
  it('should parse the Input correctly', () => {
    expect(parseInput(testInput)).toEqual([
      [7, 9],
      [15, 40],
      [30, 200],
    ])
  })
  it('should calculate total winning ways correctly', () => {
    const records = parseInput(testInput)
    expect(calculateTotalWinningWays(records)).toEqual(288)
  })
})
describe('day06Part02', () => {
  it('should parseInput ignoring the spaces', () => {
    expect(parseInputPartTwo(testInput)).toEqual([[71530, 940200]])
  })
  it('should get the winning hold times for our input ignoring spaces', () => {
    expect(calculateTotalWinningWays(parseInputPartTwo(testInput))).toEqual(
      71503,
    )
  })
})
