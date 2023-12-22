import { readFile } from 'fs/promises'

export function splitIntoCards(inputText: string): number[][][] {
  const lines = inputText.split('\n')
  const cards: number[][][] = []

  lines.forEach((line) => {
    if (line.trim().startsWith('Card')) {
      const cardParts = line.split('|')
      const leftNumbers =
        cardParts[0]
          .replace(/Card\s+\d+: /, '')
          .match(/\d+/g)
          ?.map(Number) ?? []
      const rightNumbers = cardParts[1].match(/\d+/g)?.map(Number) ?? []
      cards.push([leftNumbers, rightNumbers])
    }
  })

  return cards
}
export function countPoints(input: string): number {
  const cards: number[][][] = splitIntoCards(input)
  let totalPoints = 0
  cards.forEach((card) => {
    const [leftNumbers, rightNumbers] = card
    let cardPoints = 0
    let matchCount = 0

    rightNumbers.forEach((number) => {
      if (leftNumbers.includes(number)) {
        matchCount++
        cardPoints = matchCount === 1 ? 1 : cardPoints * 2
      }
    })
    totalPoints += cardPoints
  })

  return totalPoints
}

export function cardAmount(inputText: string): number {
  const cards = splitIntoCards(inputText)
  let totalCards = cards.length
  const matchesCount = new Array(cards.length).fill(0)
  const wonCards = new Array(cards.length).fill(0)

  cards.forEach((card, i) => {
    const [left, right] = card
    matchesCount[i] = left.filter((number) => right.includes(number)).length
  })

  cards.forEach((_, i) => {
    const matches = matchesCount[i]
    for (let j = i + 1; j < Math.min(i + 1 + matches, cards.length); j++) {
      wonCards[j]++
    }
  })

  for (let i = 0; i < wonCards.length; i++) {
    while (wonCards[i] > 0) {
      const matches = matchesCount[i]
      wonCards[i]--
      totalCards++
      for (let j = i + 1; j < Math.min(i + 1 + matches, cards.length); j++) {
        wonCards[j]++
      }
    }
  }

  return totalCards
}

export const partOne = async (): Promise<number> => {
  const input = await readFile('src/day4/data.txt', 'utf8')
  return countPoints(input)
}
export const partTwo = async (): Promise<number> => {
  const input = await readFile('src/day4/data.txt', 'utf8')
  return cardAmount(input)
}
