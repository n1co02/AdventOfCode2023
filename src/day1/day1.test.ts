import { task1, task2 } from './day1'

describe('Day 1 Tasks', () => {
  describe('Task 1', () => {
    it('should correctly calculate the sum for task 1', () => {
      const input = `1abc2
      pqr3stu8vwx
      a1b2c3d4e5f
      treb7uchet`
      const expectedOutput = 142
      expect(task1(input)).toEqual(expectedOutput)
    })
  })

  describe('Task 2', () => {
    it('should correctly calculate the sum for task 2', () => {
      const input = `two1nine
      eightwothree
      abcone2threexyz
      xtwone3four
      4nineeightseven2
      zoneight234
      7pqrstsixteen`
      const expectedOutput = 281
      expect(task2(input)).toEqual(expectedOutput)
    })
  })
})
