import { readFile } from 'fs/promises'

const CARD_VALUES = '23456789TJQKA'
type Card = (typeof CARD_VALUES)[number]
type Hand = [Card, Card, Card, Card, Card]
type HandStrength = number
type GroupedHand = Record<Card, number>

export function groupHand(hand: Hand): GroupedHand {
  const groupedHand: GroupedHand = {} as GroupedHand
  hand.forEach((card) => {
    groupedHand[card] = (groupedHand[card] || 0) + 1
  })
  return groupedHand
}

export function calculateHandStrength(
  groupedHand: GroupedHand,
  useJokers: boolean = false,
): HandStrength {
  const jokers = useJokers ? groupedHand['J'] || 0 : 0
  const handLength = Object.keys(groupedHand).length - (jokers ? 1 : 0)
  if (jokers && jokers < 5) {
    delete groupedHand['J']
    Object.keys(groupedHand).forEach((card) => {
      groupedHand[card] += jokers
    })
  }
  if (handLength === 1 || jokers === 5) return 7
  if (handLength === 2)
    return Object.values(groupedHand).some((v) => v === 4) ? 6 : 5
  if (handLength === 3)
    return Object.values(groupedHand).some((v) => v === 3) ? 4 : 3
  if (handLength === 4) return 2
  return 1
}

export function compareHands(
  handA: Hand,
  handB: Hand,
  useJokers: boolean = false,
): number {
  const handStrengthA = calculateHandStrength(groupHand(handA), useJokers)
  const handStrengthB = calculateHandStrength(groupHand(handB), useJokers)
  if (handStrengthA !== handStrengthB) return handStrengthA - handStrengthB

  /**************************
   * worked perfect for part one but poor joker handling :(
  const handStrengthA = calculateHandStrength(groupHand(handA), useJokers)
  const handStrengthB = calculateHandStrength(groupHand(handB), useJokers)

  if (handStrengthA !== handStrengthB) return handStrengthA - handStrengthB

  for (let i = 0; i < 5; i++) {
    const cardA = handA[i]
    const cardB = handB[i]
    if (cardA !== cardB)
      return CARD_VALUES.indexOf(cardA) - CARD_VALUES.indexOf(cardB)
  }

  return 0
} 
  *****************************/
  const mappedA = handA.map((card) =>
    useJokers && card === 'J' ? -1 : CARD_VALUES.indexOf(card),
  )
  const mappedB = handB.map((card) =>
    useJokers && card === 'J' ? -1 : CARD_VALUES.indexOf(card),
  )
  for (let i = 0; i < 5; i++) {
    if (mappedA[i] !== mappedB[i]) {
      return mappedA[i] - mappedB[i]
    }
  }
  return 0
}

export async function calculateTotalWinnings(
  input: string,
  useJokers: boolean = false,
): Promise<number> {
  const bets = input
    .trim()
    .split('\n')
    .map((line) => {
      const [handString, bid] = line.trim().split(' ')
      return [Array.from(handString) as Hand, parseInt(bid, 10)]
    })

  return bets
    .sort((a, b) => {
      const handA = a[0] as Hand
      const handB = b[0] as Hand
      return compareHands(handA, handB, useJokers)
    })
    .reduce((acc, [, bid], index) => {
      return acc + (typeof bid === 'number' ? bid * (index + 1) : 0)
    }, 0)
}
export async function partOne(): Promise<number> {
  const input = await readFile('src/day7/data.txt', 'utf8')
  return calculateTotalWinnings(input)
}
export async function partTwo(): Promise<number> {
  const input = await readFile('src/day7/data.txt', 'utf8')
  return calculateTotalWinnings(input, true)
}
