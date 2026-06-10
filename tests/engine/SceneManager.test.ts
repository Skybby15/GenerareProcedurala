import * as THREE from 'three'
import { describe, it, expect, vi } from 'vitest'
import { SceneManager } from '../../src/engine/manager/SceneManager'

describe('SceneManager', () => {
  it('loads a scene with mode setup and pipeline output', async () => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)

    const manager = new SceneManager(scene, camera)
    const mode = { setup: vi.fn() }
    const worldObject = new THREE.Object3D()
    const pipeline = { run: vi.fn(() => worldObject) }
    const config = { gridSize: 2 }
    const settings = { resetCameraPosition: true }
    const type = 'CA'
    const grid = [[1]]

    const generateGridSpy = vi.spyOn(manager, 'generateGridAsync' as any).mockResolvedValue(grid as any)

    const result = await manager.loadAsync(
      mode as any,
      pipeline as any,
      config as any,
      settings as any,
      type as any,
    )

    expect(generateGridSpy).toHaveBeenCalledWith(type, config)
    expect(pipeline.run).toHaveBeenCalledWith(grid, config)
    expect(mode.setup).toHaveBeenCalledWith(config, scene, camera, settings)
    expect(result).toEqual(expect.objectContaining({ gridTime: expect.any(Number), meshTime: expect.any(Number), setupTime: expect.any(Number) }))
    expect(scene.children).toContain(worldObject)
    expect(camera.position.x).toBe(0)
    expect(camera.position.y).toBe(0)
    expect(camera.position.z).toBe(0)
  })
})
