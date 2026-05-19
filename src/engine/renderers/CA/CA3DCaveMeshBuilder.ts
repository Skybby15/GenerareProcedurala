import * as THREE from "three";
import type { Object3D } from "three";
import type { IMeshBuilder } from "../IMeshBuilder";
import type { CAConfigValues } from "../../../helpers/configs/CAConfig";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";

export class CA3DGreedyMeshBuilder
implements IMeshBuilder<number[][][], CAConfigValues>
{
    build(
        grid: number[][][],
        config: CAConfigValues
    ): Object3D {
        const group = new THREE.Group();

        const gridSize = config.gridSize;

        const geometries: THREE.BufferGeometry[] = [];

        // -------------------------------------------------
        // Generate visible faces only
        // -------------------------------------------------

        const dirs = [
            { dir: [ 1, 0, 0 ], normal: [ 1, 0, 0 ] },
            { dir: [-1, 0, 0 ], normal: [-1, 0, 0 ] },
            { dir: [ 0, 1, 0 ], normal: [ 0, 1, 0 ] },
            { dir: [ 0,-1, 0 ], normal: [ 0,-1, 0 ] },
            { dir: [ 0, 0, 1 ], normal: [ 0, 0, 1 ] },
            { dir: [ 0, 0,-1 ], normal: [ 0, 0,-1 ] },
        ];

        const half = gridSize / 2;

        for (const { dir, normal } of dirs) {

            const [dx, dy, dz] = dir;

            for (let z = 0; z < gridSize; z++) {
                for (let y = 0; y < gridSize; y++) {
                    for (let x = 0; x < gridSize; x++) {

                        if (grid[z][y][x] === 0)
                            continue;

                        const nx = x + dx;
                        const ny = y + dy;
                        const nz = z + dz;

                        let visible = false;

                        if (
                            nx < 0 || ny < 0 || nz < 0 ||
                            nx >= gridSize ||
                            ny >= gridSize ||
                            nz >= gridSize
                        ) {
                            visible = true;
                        }
                        else if (grid[nz][ny][nx] === 0) {
                            visible = true;
                        }

                        if (!visible)
                            continue;

                        const quad = this.createFaceGeometry(
                            x - half,
                            y - half,
                            z - half,
                            normal
                        );

                        geometries.push(quad);
                    }
                }
            }
        }

        // -------------------------------------------------
        // Merge all faces
        // -------------------------------------------------

        if (geometries.length === 0) {
            return group;
        }

        const merged = BufferGeometryUtils.mergeGeometries(geometries, false);
        const finalGeometry = merged ?? geometries[0];

        finalGeometry.computeVertexNormals();

        const material =
            new THREE.MeshStandardMaterial({
                color: "#777777",
                side: THREE.DoubleSide
            });

        const mesh = new THREE.Mesh(finalGeometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        group.add(mesh);

        return group;
    }

    // -------------------------------------------------
    // Create quad face
    // -------------------------------------------------

    private createFaceGeometry(
        x: number,
        y: number,
        z: number,
        normal: number[]
    ) {

        const [nx, ny, nz] = normal;

        const geo = new THREE.PlaneGeometry(1, 1);

        const mesh = new THREE.Mesh(geo);

        mesh.position.set(x, y, z);

        if (nx === 1) {
            mesh.rotation.y = -Math.PI / 2;
            mesh.position.x += 0.5;
        }

        if (nx === -1) {
            mesh.rotation.y = Math.PI / 2;
            mesh.position.x -= 0.5;
        }

        if (ny === 1) {
            mesh.rotation.x = -Math.PI / 2;
            mesh.position.y += 0.5;
        }

        if (ny === -1) {
            mesh.rotation.x = Math.PI / 2;
            mesh.position.y -= 0.5;
        }

        if (nz === 1) {
            mesh.position.z += 0.5;
        }

        if (nz === -1) {
            mesh.rotation.y = Math.PI;
            mesh.position.z -= 0.5;
        }

        mesh.updateMatrix();

        geo.applyMatrix4(mesh.matrix);

        return geo;
    }
}