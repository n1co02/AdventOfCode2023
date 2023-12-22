import {
  groupHand,
  calculateHandStrength,
  calculateTotalWinnings,
} from './day7' // Replace 'yourModule' with the actual module name

describe('Poker Hand Evaluation Tests', () => {
  test('Group Hand', () => {
    expect(groupHand(['2', '2', '3', '4', '5'])).toEqual({
      '2': 2,
      '3': 1,
      '4': 1,
      '5': 1,
    })
  })
})
describe('Poker Hand Evaluation Tests', () => {
  test('Calculate Hand Strength', () => {
    const groupedHand = { '2': 2, '3': 1, '4': 1, '5': 1 }
    expect(calculateHandStrength(groupedHand)).toEqual(2) // Pair
  })
})
describe('Poker Hand Evaluation Tests', () => {
  test('Calculate Total Winnings', async () => {
    const input = '23456 10\n34567 20'
    const winnings = await calculateTotalWinnings(input)
    expect(winnings).toEqual(50) // Assuming the first hand wins
  })
})
