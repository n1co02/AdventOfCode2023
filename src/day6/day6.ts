import { readFile } from 'fs/promises'

type Time = number
type Distance = number
type Record = [Time, Distance]

export const parseInput = (input: string): Record[] => {
  const lines = input.split('\n')

  const timesLine = lines[0].split(':')[1].trim()
  const distancesLine = lines[1].split(':')[1].trim()

  const times = timesLine.split(/\s+/).map(Number)
  const distances = distancesLine.split(/\s+/).map(Number)

  const records: Record[] = times.map((time, index) => [time, distances[index]])
  return records
}

export const calculateTotalWinningWays = (records: Record[]): number => {
  return records.reduce((acc, [time, distance]) => {
    let waysToWin = 0

    for (let holdTime = 0; holdTime < time; holdTime++) {
      const travelTime = time - holdTime
      const speed = holdTime
      const distanceCovered = speed * travelTime

      if (distanceCovered > distance) {
        waysToWin++
      }
    }

    return acc * (waysToWin === 0 ? 1 : waysToWin)
  }, 1)
}
export const parseInputPartTwo = (input: string): Record[] => {
  const lines = input.split('\n')

  const time = parseInt(lines[0].split(':')[1].trim().replace(/\s+/g, ''), 10)
  const distance = parseInt(
    lines[1].split(':')[1].trim().replace(/\s+/g, ''),
    10,
  )

  return [[time, distance]]
}

export const partOne = async (): Promise<number> => {
  const input = await readFile('src/day6/data.txt', 'utf8')
  return calculateTotalWinningWays(parseInput(input))
}
export const partTwo = async (): Promise<number> => {
  const input = await readFile('src/day6/data.txt', 'utf8')
  return calculateTotalWinningWays(parseInputPartTwo(input))
}
