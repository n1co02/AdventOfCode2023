import { readFile } from 'fs/promises'
import chunk from 'lodash/chunk'
import Piscina from 'piscina'
import { SingleBar, Presets } from 'cli-progress'

export type RangeMap = Range[]
export type Range = [number, number, number]
/**not my code */
const piscina = new Piscina({
  filename: new URL('./day5.worker.js', import.meta.url).href,
})

export const getLineRange = (line: string): Range => {
  const [destinationStart, sourceStart, length] = line.split(' ')
  return [parseInt(destinationStart), parseInt(sourceStart), parseInt(length)]
}

export const getSeedsFromInput = (input: string): number[] => {
  return input
    .split('\n')[0]
    .replace('seeds: ', '')
    .split(' ')
    .map((seed) => parseInt(seed, 10))
}

export const getSeedRangesFromInput = (input: string): [number, number][] => {
  const ranges = input
    .split('\n')[0]
    .replace('seeds: ', '')
    .split(' ')
    .map((seed) => parseInt(seed, 10))

  return chunk(ranges, 2)
}

export const getRangeMap = (input: string, searchTerm: string): RangeMap => {
  const lines = input.split(searchTerm)[1].split('\n')
  const ranges = lines
    .slice(
      0,
      lines.findIndex((line) => line === ''),
    )
    .map(getLineRange)

  return ranges
}
export const getNextValueFromRangeMap = (value, rangeMap) => {
  let low = 0,
    high = rangeMap.length - 1
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const [destStart, sourceStart, length] = rangeMap[mid]
    if (sourceStart > value) {
      high = mid - 1
    } else if (sourceStart + length < value) {
      low = mid + 1
    } else {
      return destStart + (value - sourceStart)
    }
  }
  return value
}
export const getRangeMaps = (input: string) => {
  const seedToSoilMap = getRangeMap(input, 'seed-to-soil map:\n')
  const soilToFertilizerMap = getRangeMap(input, 'soil-to-fertilizer map:\n')
  const fertilizerToWaterMap = getRangeMap(input, 'fertilizer-to-water map:\n')
  const waterToLightMap = getRangeMap(input, 'water-to-light map:\n')
  const lightToTemperatureMap = getRangeMap(
    input,
    'light-to-temperature map:\n',
  )
  const temperatureToHumidityMap = getRangeMap(
    input,
    'temperature-to-humidity map:\n',
  )
  const humidityToLocationMap = getRangeMap(
    input,
    'humidity-to-location map:\n',
  )
  return {
    seedToSoilMap,
    soilToFertilizerMap,
    fertilizerToWaterMap,
    waterToLightMap,
    lightToTemperatureMap,
    temperatureToHumidityMap,
    humidityToLocationMap,
  }
}

export const getSmallestLocationForSeed = (input: string): number => {
  const {
    seedToSoilMap,
    soilToFertilizerMap,
    fertilizerToWaterMap,
    waterToLightMap,
    lightToTemperatureMap,
    temperatureToHumidityMap,
    humidityToLocationMap,
  } = getRangeMaps(input)
  let smallestLocation = Infinity
  const seeds = getSeedsFromInput(input)
  seeds.forEach((seed) => {
    const soil = getNextValueFromRangeMap(seed, seedToSoilMap)
    const fertilizer = getNextValueFromRangeMap(soil, soilToFertilizerMap)
    const water = getNextValueFromRangeMap(fertilizer, fertilizerToWaterMap)
    const light = getNextValueFromRangeMap(water, waterToLightMap)
    const temperature = getNextValueFromRangeMap(light, lightToTemperatureMap)
    const humidity = getNextValueFromRangeMap(
      temperature,
      temperatureToHumidityMap,
    )
    const location = getNextValueFromRangeMap(humidity, humidityToLocationMap)
    if (location < smallestLocation) smallestLocation = location
  })
  return smallestLocation
}

export const getSmallestLocationForSeedRange = async (
  input: string,
): Promise<number> => {
  const {
    seedToSoilMap,
    soilToFertilizerMap,
    fertilizerToWaterMap,
    waterToLightMap,
    lightToTemperatureMap,
    temperatureToHumidityMap,
    humidityToLocationMap,
  } = getRangeMaps(input)

  /* This is quite inefficient, 
  it would probably be quicker to reverse the tree up 
  and finding the lowest location that has a seed 
  but i can't be asked to rewrite all of this,
  so pure CPU power it is */

  const _seedRanges = getSeedRangesFromInput(input)
  // Split seedranges into more smaller seedranges to distribute the work better across the CPU cores
  const seedRanges = _seedRanges
    .map<[number, number][]>(([start, length]) => {
      const seedRanges: [number, number][] = []
      const chunkSize = 20000000
      for (let i = 0; i < length; i += chunkSize) {
        seedRanges.push([start + i, Math.min(chunkSize, length - i)])
      }
      return seedRanges
    })
    .flat()

  const allPossibleSeeds = seedRanges.reduce(
    (acc, [, length]) => acc + length,
    0,
  )
  const progressBar = new SingleBar(
    {
      format:
        'Progress | {bar} | {percentage}% | ~{eta}s left | {value}/{total} Seeds',
      stopOnComplete: true,
      etaBuffer: 1000,
      etaAsynchronousUpdate: true,
    },
    Presets.shades_classic,
  )
  progressBar.start(allPossibleSeeds, 0)
  const smallestLocations = await Promise.all(
    seedRanges.map(([seedStart, length]) => {
      return new Promise<number>((resolve) => {
        const mc = new MessageChannel()
        mc.port2.onmessage = (e) => {
          progressBar.increment(e.data)
        }
        piscina
          .run(
            {
              seedStart,
              length,
              seedToSoilMap,
              soilToFertilizerMap,
              fertilizerToWaterMap,
              waterToLightMap,
              lightToTemperatureMap,
              temperatureToHumidityMap,
              humidityToLocationMap,
              port: mc.port1,
            },
            {
              // @ts-expect-error transferList is not in the typings
              transferList: [mc.port1],
            },
          )
          .then((result) => resolve(result))
      })
    }),
  )
  progressBar.stop()
  piscina.destroy()
  return Math.min(...smallestLocations)
}

export const partOne = async (): Promise<number> => {
  const input = await readFile('src/day5/data.txt', 'utf8')
  return getSmallestLocationForSeed(input)
}

export const partTwo = async (): Promise<number> => {
  const input = await readFile('src/day5/data.txt', 'utf8')
  return getSmallestLocationForSeedRange(input)
}
