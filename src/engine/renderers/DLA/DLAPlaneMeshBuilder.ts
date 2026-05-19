import * as THREE from "three";
import type { IMeshBuilder } from "../IMeshBuilder";
import type { DLAConfigValues } from "../../../helpers/configs/DLAConfig";

export class DLAPlaneMeshBuilder
  implements IMeshBuilder<boolean[][], DLAConfigValues>
{
  build(grid: boolean[][], config: DLAConfigValues): THREE.Object3D {

    const group = new THREE.Group();
    const { gridSize } = config;

    const geometry = new THREE.PlaneGeometry(
      gridSize,
      gridSize,
      gridSize - 1,
      gridSize - 1
    );

    geometry.rotateX(-Math.PI / 2);

    const position = geometry.attributes.position as THREE.BufferAttribute;

    const riverDepth = 0.4; // how deep the river cuts

    // Plane vertices are in row-major order
    let i = 0;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {

        const isRiver = grid[y][x];

        const idx = i * 3 + 1; // y component of vertex position

        if (isRiver) {
          position.array[idx] -= riverDepth;
        }

        i++;
      }
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: '#4d8f4f',
      roughness: 1,
      side: THREE.DoubleSide,
    });

    const plane = new THREE.Mesh(geometry, material);

    group.add(plane);

    return group;
  }
}