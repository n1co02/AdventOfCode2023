import { readFile } from 'fs/promises'

export const getNumbersSum = async (input: string): Promise<number> => {
  const rows = input.trim().split('\n')
  const symbols = ['*', '#', '+', '$', '/', '@', '%', '=', '&', '-'] // Expanded symbol list
  const symbolMap = createSymbolMap(rows, symbols)
  let sum = 0

  symbolMap.forEach(([x, y]) => {
    sum += getSumOfAdjacentNumbers(rows, x, y)
  })

  return sum
}

function createSymbolMap(rows: string[], symbols: string[]): number[][] {
  const map = []
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      if (symbols.includes(rows[y][x])) {
        map.push([x, y])
      }
    }
  }
  return map
}

function getSumOfAdjacentNumbers(rows: string[], x: number, y: number): number {
  const adjacent = [-1, 0, 1]
  let sum = 0
  const seen = new Set<string>()

  adjacent.forEach((dx) => {
    adjacent.forEach((dy) => {
      if (dx === 0 && dy === 0) return
      const nx = x + dx,
        ny = y + dy
      if (
        ny >= 0 &&
        ny < rows.length &&
        nx >= 0 &&
        nx < rows[ny].length &&
        /\d/.test(rows[ny][nx])
      ) {
        const num = extractNumberAt(rows, nx, ny)
        if (num.found && !seen.has(`${num.value}:${num.length}`)) {
          sum += num.value
          seen.add(`${num.value}:${num.length}`)
        }
      }
    })
  })

  return sum
}

function extractNumberAt(
  rows: string[],
  x: number,
  y: number,
): { found: boolean; value: number; length: number } {
  let start = x,
    end = x
  while (start > 0 && /\d/.test(rows[y][start - 1])) {
    start--
  }
  while (end < rows[y].length && /\d/.test(rows[y][end])) {
    end++
  }
  if (start !== end) {
    const value = parseInt(rows[y].substring(start, end))
    return { found: true, value: value, length: end - start }
  }
  return { found: false, value: 0, length: 0 }
}

/*********************
Part two
 */
const numberRegex = /[0-9]/

function getAdjacentNumbers(rows: string[], x: number, y: number): number[] {
  const adjacent = [-1, 0, 1]
  const numbers = new Set<number>() // Use a set to avoid duplicates

  adjacent.forEach((dx) => {
    adjacent.forEach((dy) => {
      if (dx === 0 && dy === 0) return
      const nx = x + dx,
        ny = y + dy
      if (
        ny >= 0 &&
        ny < rows.length &&
        nx >= 0 &&
        nx < rows[ny].length &&
        rows[ny][nx].match(numberRegex)
      ) {
        const number = extractNumberAt(rows, nx, ny)
        if (number.found) {
          numbers.add(number.value)
        }
      }
    })
  })

  return Array.from(numbers) // Convert set back to array
}

export const getGearRatiosSum = async (input: string): Promise<number> => {
  const rows = input.trim().split('\n')
  let totalGearRatio = 0

  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      if (rows[y][x] === '*') {
        const adjacentNumbers = getAdjacentNumbers(rows, x, y)
        if (adjacentNumbers.length === 2) {
          totalGearRatio += adjacentNumbers[0] * adjacentNumbers[1]
        }
      }
    }
  }

  return totalGearRatio
}

export const partOne = async (): Promise<number> => {
  const input = await readFile('src/day3/data.txt', 'utf8')
  return getNumbersSum(input)
}
export const partTwo = async (): Promise<number> => {
  const input = await readFile('src/day3/data.txt', 'utf8')
  return getGearRatiosSum(input)
}
