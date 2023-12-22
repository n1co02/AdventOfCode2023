import { readFile } from 'fs/promises'

interface Point {
  x: number
  y: number
}

interface Direction {
  dx: number
  dy: number
  opposite: string
}

const findFarthestPointInLoop = (input: string): number => {
  const lines = input.split('\n')
  const map: string[][] = lines.map((line) => line.trim().split(''))
  const pipeTypes: { [key: string]: string[] } = {
    '|': ['n', 's'],
    '-': ['w', 'e'],
    L: ['n', 'e'],
    J: ['n', 'w'],
    '7': ['s', 'w'],
    F: ['s', 'e'],
    S: ['n', 's', 'w', 'e'],
  }
  const directions: { [key: string]: Direction } = {
    n: { dx: -1, dy: 0, opposite: 's' },
    s: { dx: 1, dy: 0, opposite: 'n' },
    w: { dx: 0, dy: -1, opposite: 'e' },
    e: { dx: 0, dy: 1, opposite: 'w' },
  }

  // Find the start point
  let start: Point = { x: 0, y: 0 }
  map.forEach((row, x) => {
    row.forEach((cell, y) => {
      if (cell === 'S') start = { x, y }
    })
  })

  const encounteredPlaces: { [key: string]: number } = {}
  const searchQueue: [Point, number][] = [[start, 0]]

  while (searchQueue.length > 0) {
    const [current, distance] = searchQueue.shift()!
    const key = `${current.x},${current.y}`
    if (encounteredPlaces[key] !== undefined) continue
    encounteredPlaces[key] = distance

    const availableDirections = pipeTypes[map[current.x][current.y]]
    availableDirections.forEach((direction) => {
      const { dx, dy, opposite } = directions[direction]
      const newX = current.x + dx
      const newY = current.y + dy
      if (newX < 0 || newX >= map.length || newY < 0 || newY >= map[0].length)
        return
      const target = map[newX][newY]
      if (!pipeTypes[target]) return
      if (pipeTypes[target].includes(opposite)) {
        searchQueue.push([{ x: newX, y: newY }, distance + 1])
      }
    })
  }

  return Math.max(...Object.values(encounteredPlaces))
}

const getEnclosedAreaOfLoop = (input: string): number => {
  const lines = input.split('\n')
  const map: string[][] = lines.map((line) => line.trim().split(''))
  const pipeTypes: { [key: string]: string[] } = {
    '|': ['n', 's'],
    '-': ['w', 'e'],
    L: ['n', 'e'],
    J: ['n', 'w'],
    '7': ['s', 'w'],
    F: ['s', 'e'],
    S: ['n', 's', 'w', 'e'],
  }
  const directions: { [key: string]: Direction } = {
    n: { dx: -1, dy: 0, opposite: 's' },
    s: { dx: 1, dy: 0, opposite: 'n' },
    w: { dx: 0, dy: -1, opposite: 'e' },
    e: { dx: 0, dy: 1, opposite: 'w' },
  }

  // Find the start point
  let start: Point = { x: 0, y: 0 }
  map.forEach((row, x) => {
    row.forEach((cell, y) => {
      if (cell === 'S') start = { x, y }
    })
  })

  const encounteredPlaces: { [key: string]: number } = {}
  const searchQueue: [Point, number][] = [[start, 0]]

  while (searchQueue.length > 0) {
    const [current, distance] = searchQueue.shift()!
    const key = `${current.x},${current.y}`
    if (encounteredPlaces[key] !== undefined) continue
    encounteredPlaces[key] = distance

    const availableDirections = pipeTypes[map[current.x][current.y]]
    availableDirections.forEach((direction) => {
      const { dx, dy, opposite } = directions[direction]
      const newX = current.x + dx
      const newY = current.y + dy
      if (newX < 0 || newX >= map.length || newY < 0 || newY >= map[0].length)
        return
      const target = map[newX][newY]
      if (!pipeTypes[target]) return
      if (pipeTypes[target].includes(opposite)) {
        searchQueue.push([{ x: newX, y: newY }, distance + 1])
      }
    })
  }

  // Modify the map to count the 'I's
  for (let i = 0; i < map.length; i++) {
    let norths = 0
    for (let j = 0; j < map[i].length; j++) {
      const place = map[i][j]
      if (`${i},${j}` in encounteredPlaces) {
        const pipeDirections = pipeTypes[place]
        if (pipeDirections.includes('n')) {
          norths++
        }
        continue
      }
      if (norths % 2 === 0) {
        map[i][j] = 'O'
      } else {
        map[i][j] = 'I'
      }
    }
  }

  // Count the 'I's in the modified map
  const enclosedCount = map.flat().filter((cell) => cell === 'I').length
  return enclosedCount
}

export const partOne = async (): Promise<number> => {
  const input = await readFile('src/day10/data.txt', 'utf8')
  return findFarthestPointInLoop(input)
}

export const partTwo = async (): Promise<number> => {
  const input = await readFile('src/day10/data.txt', 'utf8')
  return getEnclosedAreaOfLoop(input)
}
