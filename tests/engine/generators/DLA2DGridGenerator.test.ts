import { describe, it, expect } from 'vitest'
import { DLA2DGridGenerator } from '../../../src/engine/generators/DLA/DLA2DGridGenerator'
import { DLAConfigPresets, DLAConfigValues } from '../../../src/helpers/configs/DLAConfig'

describe('DLA2DGridGenerator', () => {
  it('generates a cluster around the center when a particle spawns and sticks', () => {
    const generator = new DLA2DGridGenerator()
    const config : DLAConfigValues = {
      ...DLAConfigPresets.default,
      gridSize: 5,
      particles: 1,
      steps: 1,
      stickRadius: 0,
      stickProximity: 1,
      particleSpawnBehaviour: 'edge',
    }

    const rngValues = [0.3, 0.4, 0.3]
    let index = 0
    const grid = generator.generate(config, () => rngValues[index++])

    expect(grid[2][2]).toBe(true)
    expect(grid[2][3]).toBe(true)
  })

  it('throws NotImplementedError for generateAsync', async () => {
    const generator = new DLA2DGridGenerator()

    await expect(generator.generateAsync()).rejects.toThrow()
  })
})
