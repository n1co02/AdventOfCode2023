import { getNumbersSum, getGearRatiosSum } from './day3'

const testInput = `467..114..
...*......
..35...633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`

describe('getNumbersSum', () => {
  it('should return the sum of all adjacent Numbers from our symbolsMap', async () => {
    const result = await getNumbersSum(testInput)
    expect(result).toEqual(4361)
  })
})
const testInput2 = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`

describe('getGearRatiosSum', () => {
  it('should return the sum of all gear ratios from our schematic', async () => {
    const result = await getGearRatiosSum(testInput2)
    expect(result).toEqual(467835)
  })
})
