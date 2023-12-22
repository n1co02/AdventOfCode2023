import { readdir } from 'fs/promises'
import { existsSync } from 'fs'
import { select } from '@inquirer/prompts'
import minimist from 'minimist'

console.clear()
const { d } = minimist(process.argv.slice(2))

const dayDirectories = (await readdir('./src')).filter((dir) =>
  dir.startsWith('day'),
)

const selectedDayDir =
  d ||
  (await select({
    message: 'Select a day',
    choices: dayDirectories.map((dir) => ({ title: dir, value: dir })),
  }))

const file = `./src/${selectedDayDir}/${selectedDayDir}.ts`

if (!existsSync(file)) {
  console.log('File not found:', file)
  process.exit(1)
}

const { partOne, partTwo } = await import(file)
if (partOne) {
  console.time('Part one took')
  console.log('Solution for part one:', await partOne())
  console.timeEnd('Part one took')
}
if (partTwo) {
  console.time('Part two took')
  console.log('Solution for part two:', await partTwo())
  console.timeEnd('Part two took')
}
