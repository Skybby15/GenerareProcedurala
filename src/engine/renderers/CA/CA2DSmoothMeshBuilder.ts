import * as THREE from "three";
import type { Object3D } from "three";
import type { IMeshBuilder } from "../IMeshBuilder";
import type { CAConfigValues } from "../../../helpers/configs/CAConfig";

export class CA2DSmoothMeshBuilder
implements IMeshBuilder<number[][], CAConfigValues>
{
    build(
        grid: number[][],
        config: CAConfigValues
    ): Object3D {

        const group = new THREE.Group();

        const {
            gridSize,
        } = config;

        // -------------------------------------------------
        // Terrain geometry
        // -------------------------------------------------

        const terrainGeo = new THREE.PlaneGeometry(
            gridSize,
            gridSize,
            gridSize - 1,
            gridSize - 1
        );

        terrainGeo.rotateX(-Math.PI / 2);

        const positions = terrainGeo.attributes.position;

        // how deep water cells are carved
        const riverDepth = -1.5;

        for (let i = 0; i < positions.count; i++) {

            const x = i % gridSize;
            const y = Math.floor(i / gridSize);

            const value = grid[y][x];

            // 1 = land
            // 0 = river / carved terrain

            const height =
                value === 0
                    ? riverDepth
                    : 0;

            positions.setY(i, height);
        }

        terrainGeo.computeVertexNormals();

        // -------------------------------------------------
        // Material
        // -------------------------------------------------

        const terrainMat =
            new THREE.MeshStandardMaterial({
                color: "#567d46",
                flatShading: false,
            });

        const terrain =
            new THREE.Mesh(
                terrainGeo,
                terrainMat
            );

        terrain.receiveShadow = true;

        group.add(terrain);

        return group;
    }
}