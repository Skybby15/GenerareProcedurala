import { describe, it, expect } from 'vitest'
import { CA2DGridGenerator } from '../../../src/engine/generators/CA/CA2DGridGenerator'
import { CAConfigPresets, CAConfigValues } from '../../../src/helpers/configs/CAConfig'

describe('CA2DGridGenerator', () => {
  it('generates a full grid when initial density is 100 and survival/birth rules always pass', () => {
    const generator = new CA2DGridGenerator()
    const config : CAConfigValues= {
      ...CAConfigPresets.default,
      gridSize: 3,
      initialGridDensity: 100,
      steps: 1,
      minimumBirthNeighbors: 0,
      maximumBirthNeighbors: 8,
      minimumSurvivalNeighbors: 0,
      maximumSurvivalNeighbors: 8,
      edgeBehavior: 'dead',
      allowIsolatedStructures: true,
      minimumStructureSize: -1,
    }

    const grid = generator.generate(config, () => 0)

    expect(grid).toHaveLength(3)
    expect(grid.every(row => row.every(cell => cell === 1))).toBe(true)
  })

  it('removes isolated structures when allowIsolatedStructures is false', () => {
    const generator = new CA2DGridGenerator()
    const config : CAConfigValues = {
      ...CAConfigPresets.default,
      gridSize: 3,
      initialGridDensity: 35,
      steps: 0,
      minimumBirthNeighbors: 0,
      maximumBirthNeighbors: 8,
      minimumSurvivalNeighbors: 0,
      maximumSurvivalNeighbors: 8,
      edgeBehavior: 'dead',
      allowIsolatedStructures: false,
      minimumStructureSize: 2,
    }

    const rngValues = [0.4, 0.4, 0.4, 0.4, 0.0, 0.4, 0.4, 0.4, 0.4]
    let index = 0
    const grid = generator.generate(config, () => rngValues[index++])

    expect(grid).toHaveLength(3)
    expect(grid.flat().every(cell => cell === 0)).toBe(true)
  })
})
