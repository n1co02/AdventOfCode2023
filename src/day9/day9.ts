import { readFile } from 'fs/promises'

export const getNextChainValue = (history: number[]): number => {
  const sequences: number[][] = [history]

  while (sequences[sequences.length - 1].some((v) => v !== 0)) {
    const lastSequence = sequences[sequences.length - 1]
    const differences = lastSequence.slice(1).map((v, i) => v - lastSequence[i])
    sequences.push(differences)
  }

  for (let i = sequences.length - 2; i >= 0; i--) {
    const nextValue =
      sequences[i][sequences[i].length - 1] +
      sequences[i + 1][sequences[i + 1].length - 1]
    sequences[i].push(nextValue)
  }

  return sequences[0][sequences[0].length - 1]
}

export const partOne = async (): Promise<number> => {
  const input = await readFile('src/day9/data.txt', 'utf8')
  return input
    .split('\n')
    .map((l) => l.split(' ').map(Number))
    .map(getNextChainValue)
    .reduce((acc, curr) => acc + curr, 0)
}

export const partTwo = async (): Promise<number> => {
  const input = await readFile('src/day9/data.txt', 'utf8')
  return input
    .split('\n')
    .map((l) => l.split(' ').map(Number).reverse())
    .map(getNextChainValue)
    .reduce((acc, curr) => acc + curr, 0)
}
