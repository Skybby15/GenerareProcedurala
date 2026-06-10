import { describe, it, expect } from 'vitest'
import { PN2DGridGenerator } from '../../../src/engine/generators/PN/PN2DGridGenerator'
import { PNConfigPresets, PNConfigValues } from '../../../src/helpers/configs/PNConfig'

describe('PN2DGridGenerator', () => {
  it('generates height values in the expected shape and range', () => {
    const generator = new PN2DGridGenerator()
    const config : PNConfigValues = {
      ...PNConfigPresets.default,
      gridSize: 3,
      scale: 10,
      amplitude: 10,
      octaves: 1,
      persistance: 0.5,
      lacunarity: 2,
    }

    const result = generator.generate(config, () => 0.5)

    expect(result.heights).toHaveLength(3)
    expect(result.heights.every(row => row.length === 3)).toBe(true)
    expect(result.heights.flat().every(v => typeof v === 'number')).toBe(true)
  })

  it('throws NotImplementedError for generateAsync', async () => {
    const generator = new PN2DGridGenerator()
    await expect(generator.generateAsync()).rejects.toThrow()
  })
})
