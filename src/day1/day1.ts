import { readFile } from 'fs/promises'

export const task1 = (text: string): number => {
  const lines = text.split('\n')
  let totalSumTask1 = 0

  lines.forEach((line) => {
    const firstNumberMatch = /\d/.exec(line)
    const reversedLine = line.split('').reverse().join('')
    const lastNumberMatch = /\d/.exec(reversedLine)

    if (firstNumberMatch && lastNumberMatch) {
      const firstNumber = firstNumberMatch[0]
      const lastNumber = lastNumberMatch[0]
      const combinedNumber = parseInt(firstNumber + lastNumber)
      totalSumTask1 += combinedNumber
    }
  })

  return totalSumTask1
}

export const task2 = (text: string): number => {
  const lines = text.split('\n')
  let totalSumTask2 = 0

  const digitDict: { [key: string]: string } = {
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
  }

  const digitRegex = /\d/g
  const stringRegex = /one|two|three|four|five|six|seven|eight|nine/g

  lines.forEach((element) => {
    const matches: Array<{ digit: string; index: number }> = []
    let calibrationValue = ''

    let m: RegExpExecArray | null
    while ((m = stringRegex.exec(element)) !== null) {
      if (Object.prototype.hasOwnProperty.call(digitDict, m[0])) {
        matches.push({ digit: digitDict[m[0]], index: m.index })
      }
      stringRegex.lastIndex = m.index + 1
    }

    const digitMatches = Array.from(element.matchAll(digitRegex))
    digitMatches.forEach((match) => {
      matches.push({ digit: match[0], index: match.index! })
    })

    matches.sort((a, b) => a.index - b.index)

    if (matches.length === 1)
      calibrationValue = matches[0].digit + matches[0].digit
    else if (matches.length > 1)
      calibrationValue = matches[0].digit + matches[matches.length - 1].digit

    totalSumTask2 += Number(calibrationValue)
  })

  return totalSumTask2
}

export const partOne = async (): Promise<number> => {
  const input = await readFile('src/day1/data.txt', 'utf8')
  return task1(input)
}

export const partTwo = async (): Promise<number> => {
  const input = await readFile('src/day1/data.txt', 'utf8')
  return task2(input)
}
