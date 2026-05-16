import * as THREE from "three";
import type { CAConfigValues } from "../../../helpers/configs/CAConfig";
import type { IMeshBuilder } from "../IMeshBuilder";

export class CA2DMeshBuilder implements IMeshBuilder<number[][], CAConfigValues> {

    build(gridData: number[][], config: CAConfigValues): THREE.Object3D {
        const {gridSize} = config

        const group = new THREE.Group();

        // Shared geometries and materials for instancing
        const landGeo = new THREE.BoxGeometry(1, 0.4, 1);
        const waterGeo = new THREE.BoxGeometry(1, 0.1, 1);

        const landMat = new THREE.MeshStandardMaterial({ color: 0x4a7c59 });
        const waterMat = new THREE.MeshStandardMaterial({
            color: 0x1a6b8a,
            transparent: true,
            opacity: 0.85,
        });

        // Count land and water cells for instanced meshes
        let landCount = 0;
        let waterCount = 0;
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (gridData[y][x] === 1) landCount++;
                else waterCount++;
            }
        }

        const landMesh = new THREE.InstancedMesh(landGeo, landMat, landCount);
        const waterMesh = new THREE.InstancedMesh(waterGeo, waterMat, waterCount);
        landMesh.castShadow = true;
        landMesh.receiveShadow = true;
        waterMesh.receiveShadow = true;

        const dummy = new THREE.Object3D();
        // Center the grid around origin
        const offset = gridSize / 2 - 0.5;

        let li = 0;
        let wi = 0;

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const isLand = gridData[y][x] === 1;

                dummy.position.set(
                    x - offset,
                    isLand ? 0.2 : 0.05,   // land sits higher than water surface
                    y - offset
                );
                dummy.updateMatrix();

                if (isLand) {
                    landMesh.setMatrixAt(li++, dummy.matrix);
                } else {
                    waterMesh.setMatrixAt(wi++, dummy.matrix);
                }
            }
        }

        landMesh.instanceMatrix.needsUpdate = true;
        waterMesh.instanceMatrix.needsUpdate = true;

        group.add(landMesh, waterMesh);
        return group;
    }
}