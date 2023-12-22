import { readFile } from 'fs/promises'
import { lcm } from '@alexaegis/advent-of-code-lib'
import { parse, stepUntil } from './parse'
type Node = string
type Direction = 'L' | 'R'
type Network = Record<Node, [Node, Node]>

export async function navigateNetwork(input: string): Promise<number> {
  // Splitting the input into lines
  const lines = input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)

  // The first line contains the instructions
  const instructions = lines[0]

  // Remaining lines describe the network
  const network: Network = {}
  for (let i = 1; i < lines.length; i++) {
    const [node, connections] = lines[i].split('=')
    const [left, right] = connections
      .trim()
      .slice(1, -1)
      .split(',')
      .map((s) => s.trim())
    network[node.trim()] = [left, right]
  }

  let steps = 0
  let currentNode: Node = 'AAA'
  let instructionIndex = 0

  while (currentNode !== 'ZZZ') {
    const direction = instructions[
      instructionIndex % instructions.length
    ] as Direction
    currentNode = network[currentNode][direction === 'R' ? 1 : 0]
    instructionIndex++
    steps++
  }

  return steps
}
/*** 
 * Code works fine but unless you have a full hour time, you shouldn't use it 
 * 
 * 

export async function navigateGhostNetwork(
  input: string,
): Promise<number> {
  
  const lines = input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)
  const instructions = lines[0]
  const network: Network = {}

  for (let i = 1; i < lines.length; i++) {
    const [node, connections] = lines[i].split('=')
    const [left, right] = connections
      .trim()
      .slice(1, -1)
      .split(',')
      .map((s) => s.trim())
    network[node.trim()] = [left, right]
  }

  // Find all starting nodes (ending with 'A')
  const currentNodes = new Set(
    Object.keys(network).filter((node) => node.endsWith('A')),
  )

  let steps = 0
  while (!Array.from(currentNodes).every((node) => node.endsWith('Z'))) {
    const nextNodes = new Set<Node>()
    currentNodes.forEach((node) => {
      const direction = instructions[steps % instructions.length] as Direction
      nextNodes.add(network[node][direction === 'R' ? 1 : 0])
    })

    currentNodes.clear()
    nextNodes.forEach((node) => currentNodes.add(node))
    steps++
   
  }

  return steps
}

following approach is way more efficient and from https://github.com/AlexAegis/advent-of-code/blob/master/solutions/typescript/2023/08/src/p2.ts
*/

const p2 = (input) => {
  // Parse the input to get the graph and instructions
  const [graph, instructions] = parse(input)

  // Find all starting nodes (nodes ending with 'A')
  const startingNodes = graph.nodeValues.filter((node) =>
    node.key.endsWith('A'),
  )

  // Calculate the steps for each starting node to reach a node ending with 'Z'
  const steps = startingNodes.map((startingNode) =>
    stepUntil(startingNode, instructions, (node) => node.key.endsWith('Z')),
  )

  // Return the least common multiple of all these steps
  return lcm(steps)
}

export async function partOne(): Promise<number> {
  const input = await readFile('src/day8/data.txt', 'utf8')
  return navigateNetwork(input)
}
export async function partTwo(): Promise<number> {
  const input = await readFile('src/day8/data.txt', 'utf8')

  return p2(input)
}
