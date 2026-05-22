import * as THREE from "three";
import type { Object3D } from "three";
import type { IMeshBuilder } from "../IMeshBuilder";
import type { CAConfigValues } from "../../../helpers/configs/CAConfig";

export class DLACaveMeshBuilder
implements IMeshBuilder<boolean[][][], CAConfigValues>
{
    private readonly chunkSize = 16;

    build(grid: boolean[][][], config: CAConfigValues): Object3D {
        const group = new THREE.Group();

        const gridSize = config.gridSize;
        const half = gridSize / 2;

        const geometry = new THREE.PlaneGeometry(1, 1);

        const material = new THREE.MeshStandardMaterial({
            color: "#777777",
            side: THREE.FrontSide,
        });

        const directions = [
            { dir: [1, 0, 0], rot: new THREE.Euler(0, Math.PI / 2, 0) },
            { dir: [-1, 0, 0], rot: new THREE.Euler(0, -Math.PI / 2, 0) },
            { dir: [0, 1, 0], rot: new THREE.Euler(-Math.PI / 2, 0, 0) },
            { dir: [0, -1, 0], rot: new THREE.Euler(Math.PI / 2, 0, 0) },
            { dir: [0, 0, 1], rot: new THREE.Euler(0, 0, 0) },
            { dir: [0, 0, -1], rot: new THREE.Euler(0, Math.PI, 0) },
        ] as const;

        const isVisibleFace = (
            x: number,
            y: number,
            z: number,
            dx: number,
            dy: number,
            dz: number
        ) => {
            const nx = x + dx;
            const ny = y + dy;
            const nz = z + dz;

            return (
                nx < 0 || ny < 0 || nz < 0 ||
                nx >= gridSize ||
                ny >= gridSize ||
                nz >= gridSize ||
                grid[nz][ny][nx] === false
            );
        };

        for (let cz = 0; cz < gridSize; cz += this.chunkSize) {
            for (let cy = 0; cy < gridSize; cy += this.chunkSize) {
                for (let cx = 0; cx < gridSize; cx += this.chunkSize) {

                    const xEnd = Math.min(cx + this.chunkSize, gridSize);
                    const yEnd = Math.min(cy + this.chunkSize, gridSize);
                    const zEnd = Math.min(cz + this.chunkSize, gridSize);

                    let faceCount = 0;

                    // Count faces in chunk
                    for (let z = cz; z < zEnd; z++) {
                        for (let y = cy; y < yEnd; y++) {
                            for (let x = cx; x < xEnd; x++) {
                                if (grid[z][y][x] === false) continue;

                                for (const { dir } of directions) {
                                    const [dx, dy, dz] = dir;

                                    if (isVisibleFace(x, y, z, dx, dy, dz)) {
                                        faceCount++;
                                    }
                                }
                            }
                        }
                    }

                    if (faceCount === 0) continue;

                    const mesh = new THREE.InstancedMesh(
                        geometry,
                        material,
                        faceCount
                    );

                    const matrix = new THREE.Matrix4();
                    const quaternion = new THREE.Quaternion();
                    const position = new THREE.Vector3();
                    const scale = new THREE.Vector3(1, 1, 1);

                    let index = 0;

                    // Fill matrices
                    for (let z = cz; z < zEnd; z++) {
                        for (let y = cy; y < yEnd; y++) {
                            for (let x = cx; x < xEnd; x++) {
                                if (grid[z][y][x] === false) continue;

                                for (const { dir, rot } of directions) {
                                    const [dx, dy, dz] = dir;

                                    if (!isVisibleFace(x, y, z, dx, dy, dz)) {
                                        continue;
                                    }

                                    position.set(
                                        x + dx * 0.5 - half,
                                        y + dy * 0.5 - half,
                                        z + dz * 0.5 - half
                                    );

                                    quaternion.setFromEuler(rot);

                                    matrix.compose(position, quaternion, scale);

                                    mesh.setMatrixAt(index, matrix);
                                    index++;
                                }
                            }
                        }
                    }

                    mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
                    mesh.instanceMatrix.needsUpdate = true;

                    const center = new THREE.Vector3(
                        cx + (xEnd - cx) / 2 - half,
                        cy + (yEnd - cy) / 2 - half,
                        cz + (zEnd - cz) / 2 - half
                    );

                    mesh.position.set(0, 0, 0);

                    mesh.userData.isChunk = true;
                    mesh.userData.chunkCenter = center;
                    mesh.userData.chunkRadius =
                        Math.sqrt(3) * this.chunkSize * 0.5;

                    mesh.computeBoundingBox();
                    mesh.computeBoundingSphere();

                    group.add(mesh);
                }
            }
        }

        return group;
    }
}