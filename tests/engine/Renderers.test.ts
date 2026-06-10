import * as THREE from 'three'
import { describe, it, expect } from 'vitest'
import { CA2DBlockMeshBuilder } from '../../src/engine/renderers/CA/CA2DBlockMeshBuilder'
import { DLA2DBlockMeshBuilder } from '../../src/engine/renderers/DLA/DLABlockMeshBuilder'
import { PNPlaneMeshBuilder } from '../../src/engine/renderers/PN/PNPlaneMeshBuilder'
import { VDTerritoriesMeshBuilder } from '../../src/engine/renderers/VD/VDTerritoriesMeshBuilder'

describe('Engine renderers', () => {
  it('builds a CA2DBlockMeshBuilder group with the expected instance count', () => {
    const builder = new CA2DBlockMeshBuilder()
    const gridData = [[1, 0], [0, 1]]
    const result = builder.build(gridData, { gridSize: 2 } as any)

    expect(result).toBeInstanceOf(THREE.Group)
    expect(result.children.length).toBe(1)
    expect((result.children[0] as THREE.InstancedMesh).count).toBe(2)
  })

  it('builds a DLA2DBlockMeshBuilder group with the expected instance count', () => {
    const builder = new DLA2DBlockMeshBuilder()
    const gridData = [[false, true], [true, false]]
    const result = builder.build(gridData, { gridSize: 2 } as any)

    expect(result).toBeInstanceOf(THREE.Group)
    expect(result.children.length).toBe(1)
    expect((result.children[0] as THREE.InstancedMesh).count).toBe(2)
  })

  it('builds a PNPlaneMeshBuilder group with a mesh', () => {
    const builder = new PNPlaneMeshBuilder()
    const gridData = { heights: [[0, 5], [5, 0]] }
    const result = builder.build(gridData, { gridSize: 2, amplitude: 10 } as any)

    expect(result).toBeInstanceOf(THREE.Group)
    expect(result.children.length).toBe(1)
    expect(result.children[0]).toBeInstanceOf(THREE.Mesh)
  })

  it('builds a VDTerritoriesMeshBuilder group with terrain and markers', () => {
    const builder = new VDTerritoriesMeshBuilder()
    const gridData = {
      grid: [[0, 1], [1, 0]],
      sites: [
        { x: 0, y: 0, weight: 1 },
        { x: 1, y: 1, weight: 1 },
      ],
    }
    const result = builder.build(gridData, { seed: '42', gridSize: 2 } as any)

    expect(result).toBeInstanceOf(THREE.Group)
    expect(result.children.length).toBe(3)
    expect(result.children[0]).toBeInstanceOf(THREE.Mesh)
  })
})
