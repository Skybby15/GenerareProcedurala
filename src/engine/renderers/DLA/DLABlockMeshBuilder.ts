import * as THREE from "three";
import type { IMeshBuilder } from "../IMeshBuilder";
import type { DLAConfigValues } from "../../../helpers/configs/DLAConfig";

export class DLA2DBlockMeshBuilder implements IMeshBuilder<boolean[][], DLAConfigValues> {
    build(gridData: boolean[][], config: DLAConfigValues): THREE.Object3D {
        const {gridSize} = config

        const group = new THREE.Group();
        const landGeo = new THREE.BoxGeometry(1, 0.4, 1);
        const landMat = new THREE.MeshStandardMaterial({ color: "#567d46" });

        let landCount = 0;
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (gridData[y][x] === false) landCount++;
            }
        }

        const landMesh = new THREE.InstancedMesh(landGeo, landMat, landCount);
        landMesh.castShadow = true;
        landMesh.receiveShadow = true;

        const dummy = new THREE.Object3D();
        const offset = gridSize / 2 - 0.5;

        let li = 0;

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const isLand = gridData[y][x] === false;

                dummy.position.set(
                    x - offset,
                    isLand ? 0.2 : 0.05, 
                    y - offset
                );
                dummy.updateMatrix();

                if (isLand) {
                    landMesh.setMatrixAt(li++, dummy.matrix);
                }
            }
        }

        landMesh.instanceMatrix.needsUpdate = true;

        group.add(landMesh);
        return group;
    }
}