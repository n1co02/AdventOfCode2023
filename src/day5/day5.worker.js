/**not my code */

export const getNextValueFromRangeMap = (value, rangeMap) => {
  let low = 0,
    high = rangeMap.length - 1
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const [destStart, sourceStart, length] = rangeMap[mid]
    if (sourceStart > value) {
      high = mid - 1
    } else if (sourceStart + length <= value) {
      low = mid + 1
    } else {
      return destStart + (value - sourceStart)
    }
  }
  return value
}
export default ({
  seedStart,
  length,
  seedToSoilMap,
  soilToFertilizerMap,
  fertilizerToWaterMap,
  waterToLightMap,
  lightToTemperatureMap,
  temperatureToHumidityMap,
  humidityToLocationMap,
  port,
}) => {
  let smallestLocation = Infinity
  for (let i = seedStart; i < seedStart + length; i++) {
    const soil = getNextValueFromRangeMap(i, seedToSoilMap)
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
    if (i % 500000 === 0) port.postMessage(500000)
  }
  return smallestLocation
}
