import * as THREE from 'three'
import { describe, it, expect } from 'vitest'
import { CaveSceneMode } from '../../src/engine/scenemodes/CaveSceneMode'
import { PlaneSceneMode } from '../../src/engine/scenemodes/PlaneSceneMode'
import { PNPlaneSceneMode } from '../../src/engine/scenemodes/PNPlaneSceneMode'

describe('Scene modes', () => {
  it('sets up CaveSceneMode with camera and ambient light', () => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
    const mode = new CaveSceneMode()

    mode.setup({} as any, scene, camera, { resetCameraPosition: true } as any)

    expect(camera.position.x).toBe(0)
    expect(camera.position.y).toBe(0)
    expect(camera.position.z).toBe(0)
    expect(scene.children.some(child => child.type === 'AmbientLight')).toBe(true)
    expect(scene.children.some(child => child === camera)).toBe(true)
  })

  it('sets up PlaneSceneMode with water and lights', () => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
    const mode = new PlaneSceneMode()
    const config = { gridSize: 4 }

    mode.setup(config as any, scene, camera, { resetCameraPosition: true } as any)

    expect(camera.position.y).toBe(4 * 0.7)
    expect(scene.children.some(child => child.type === 'AmbientLight')).toBe(true)
    expect(scene.children.some(child => child.type === 'DirectionalLight')).toBe(true)
    expect(scene.children.some(child => child.type === 'Mesh')).toBe(true)
  })

  it('sets up PNPlaneSceneMode with water at the amplitude-based height', () => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
    const mode = new PNPlaneSceneMode()
    const config = { gridSize: 4, amplitude: 10 }

    mode.setup(config as any, scene, camera, { resetCameraPosition: true } as any)

    expect(camera.position.y).toBe(4 * 0.7)
    expect(scene.children.some(child => child.type === 'AmbientLight')).toBe(true)
    expect(scene.children.some(child => child.type === 'DirectionalLight')).toBe(true)
    const mesh = scene.children.find(child => child.type === 'Mesh') as THREE.Mesh | undefined
    expect(mesh).toBeDefined()
    expect(mesh?.position.y).toBe(-config.amplitude * 0.4)
  })
})
