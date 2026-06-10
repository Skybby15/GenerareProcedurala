import { describe, it, expect } from 'vitest'
import { VD2DGridGenerator } from '../../../src/engine/generators/VD/VD2DGridGenerator'
import { VDConfigPresets, VDConfigValues } from '../../../src/helpers/configs/VDConfig'

describe('VD2DGridGenerator', () => {
  it('generates a Voronoi grid with site assignments', () => {
    const generator = new VD2DGridGenerator()
    const config : VDConfigValues = {
      ...VDConfigPresets.default,
      gridSize: 4,
      sitesNumber: 2,
      relaxationSteps: 0,
      weightedSites: false,
      maxWeight: 1,
    }

    const rngValues = [0.1, 0.3]
    let index = 0
    const result = generator.generate(config, () => rngValues[index++])

    expect(result.grid).toHaveLength(4)
    expect(result.sites).toHaveLength(2)
    expect(result.grid.flat().every(value => value === 0 || value === 1)).toBe(true)
  })

  it('throws NotImplementedError for generateAsync', async () => {
    const generator = new VD2DGridGenerator()
    await expect(generator.generateAsync()).rejects.toThrow()
  })
})
