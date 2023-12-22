import { readFile } from 'fs/promises'

type CubeColors = 'red' | 'blue' | 'green'
type CubeNumbers = { [key in CubeColors]: number }

export const gameIds = (input: string, maxCubes: CubeNumbers): number => {
  const lines = input.trim().split('\n')
  let sum = 0

  for (const line of lines) {
    const [gameIdPart, data] = line.split(': ')
    const gameId = parseInt(gameIdPart.split(' ')[1])

    const draws = data.split('; ').map((draw) => {
      const cubes: CubeNumbers = { red: 0, blue: 0, green: 0 }
      draw.split(', ').forEach((cubeInfo) => {
        const [countStr, color] = cubeInfo.split(' ')
        cubes[color as CubeColors] += parseInt(countStr)
      })
      return cubes
    })

    if (
      draws.every(
        (draw) =>
          draw.red <= maxCubes.red &&
          draw.green <= maxCubes.green &&
          draw.blue <= maxCubes.blue,
      )
    ) {
      sum += gameId
    }
  }
  return sum
}
export const powerSetsSum = (input: string): number => {
  const lines = input.trim().split('\n')
  let sum = 0

  for (const line of lines) {
    const draws = line
      .split(': ')[1]
      .split('; ')
      .map((draw) => {
        const cubes: CubeNumbers = { red: 0, blue: 0, green: 0 }
        draw.split(', ').forEach((cubeInfo) => {
          const [countStr, color] = cubeInfo.split(' ')
          cubes[color as CubeColors] = Math.max(
            cubes[color as CubeColors],
            parseInt(countStr),
          )
        })
        return cubes
      })

    const minSet: CubeNumbers = draws.reduce(
      (acc, curr) => {
        return {
          red: Math.max(acc.red, curr.red),
          blue: Math.max(acc.blue, curr.blue),
          green: Math.max(acc.green, curr.green),
        }
      },
      { red: 0, blue: 0, green: 0 },
    )

    const power = minSet.red * minSet.blue * minSet.green
    sum += power
  }
  return sum
}

export const partOne = async (): Promise<number> => {
  const input = await readFile('src/day2/data.txt', 'utf8')
  return gameIds(input, { red: 12, green: 13, blue: 14 })
}
export const partTwo = async (): Promise<number> => {
  const input = await readFile('src/day2/data.txt', 'utf8')
  return powerSetsSum(input)
}
