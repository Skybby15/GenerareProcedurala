import * as THREE from 'three'
import { describe, it, expect, vi } from 'vitest'
import { Pipeline } from '../../src/engine/pipeline/Pipeline'

describe('Pipeline', () => {
  it('calls meshBuilder.build and returns the object', () => {
    const meshObject = new THREE.Object3D()
    const meshBuilder = {
      build: vi.fn(() => meshObject),
    }

    const pipeline = new Pipeline(meshBuilder as any)
    const config = { gridSize: 2 }
    const grid = [[1, 0], [0, 1]]

    const result = pipeline.run(grid, config as any)

    expect(meshBuilder.build).toHaveBeenCalledWith(grid, config)
    expect(result).toBe(meshObject)
  })
})
