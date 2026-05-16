import * as THREE from "three";
import type { IMeshBuilder } from "../IMeshBuilder";
import type { DLAConfigValues } from "../../../helpers/configs/DLAConfig";

export class DLAPlaneMeshBuilder
implements IMeshBuilder<boolean[][], DLAConfigValues>
{
    build(
        grid: boolean[][],
        config: DLAConfigValues
    ): THREE.Object3D {

        const group = new THREE.Group();

        const {
            gridSize,
        } = config;

        // -------------------------------------------------
        // Instanced cubes
        // -------------------------------------------------

        const cellSize = 1;

        const cubeGeo =
            new THREE.BoxGeometry(
                cellSize,
                cellSize,
                cellSize
            );

        const cubeMat =
            new THREE.MeshStandardMaterial({
                color: "#66ccff",
                emissive: "#113344",
            });

        let count = 0;

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {

                if (grid[y][x]) {
                    count++;
                }
            }
        }

        const mesh =
            new THREE.InstancedMesh(
                cubeGeo,
                cubeMat,
                count
            );

        const matrix = new THREE.Matrix4();

        let index = 0;

        const half = gridSize / 2;

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {

                if (!grid[y][x])
                    continue;

                matrix.makeTranslation(
                    x - half,
                    0,
                    y - half
                );

                mesh.setMatrixAt(index, matrix);

                index++;
            }
        }

        mesh.instanceMatrix.needsUpdate = true;

        group.add(mesh);

        // -------------------------------------------------
        // Ground plane
        // -------------------------------------------------

        const planeGeo =
            new THREE.PlaneGeometry(
                gridSize,
                gridSize
            );

        planeGeo.rotateX(-Math.PI / 2);

        const planeMat =
            new THREE.MeshStandardMaterial({
                color: "#111111",
                wireframe: true,
            });

        const plane =
            new THREE.Mesh(
                planeGeo,
                planeMat
            );

        group.add(plane);

        return group;
    }
}