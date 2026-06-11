import * as THREE from 'three'
import type { IMeshBuilder } from "../IMeshBuilder";
import type { WorldGridData } from '../../generators/Custom/CombinedGridGenerator';
import type { WorldConfigValues } from '../../../helpers/configs/WorldConfig';

const biomeBaseColors: Record<string, THREE.Color> = {
    Plains: new THREE.Color("#6bb96f"),
    Highlands: new THREE.Color("#2d5c39"),
    Mountains: new THREE.Color("#8c8c96"),
    Desert: new THREE.Color("#e4c16a"),
};

const riverColor = new THREE.Color("#3f7eed");
const snowColor = new THREE.Color("#f4f4ff");

export class WorldPlaneMeshBuilder implements IMeshBuilder<WorldGridData, WorldConfigValues> {
    build(gridData: WorldGridData, config: WorldConfigValues): THREE.Object3D {
        const group = new THREE.Group();
        const { gridSize } = config;
        const { heights, biomeGrid, riverMask, blendMask, neighborRegion, biomeForSite } = gridData;

        const terrainGeo = new THREE.PlaneGeometry(gridSize, gridSize, gridSize - 1, gridSize - 1);
        terrainGeo.rotateX(-Math.PI / 2);

        const pos = terrainGeo.attributes.position;
        const colors: number[] = [];

        const maxHeight = Math.max(...heights.flat()) || 1;
        const minHeight = Math.min(...heights.flat()) || 0;
        const heightRange = Math.max(maxHeight - minHeight, 0.0001);

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const idx = y * gridSize + x;
                const height = heights[y][x];
                pos.setY(idx, height);

                let vertexColor: THREE.Color;

                if (riverMask[y][x]) {
                    vertexColor = riverColor;
                } else {
                    const biomeIndex = biomeGrid[y][x];
                    const biomeName = biomeForSite[biomeIndex];
                    const primaryColor = biomeBaseColors[biomeName].clone();
                    const neighborIndex = neighborRegion[y][x];
                    const neighborName = biomeForSite[neighborIndex];
                    const secondaryColor = biomeBaseColors[neighborName];

                    vertexColor = primaryColor.lerp(secondaryColor, Math.min(blendMask[y][x] * 0.7, 1));

                    const normalizedHeight = (height - minHeight) / heightRange;

                    if (biomeName === "Mountains") {
                        vertexColor.lerp(snowColor, normalizedHeight * 0.6);
                    } else if (biomeName === "Plains") {
                        vertexColor.offsetHSL(0, 0, normalizedHeight * 0.08);
                    } else if (biomeName === "Highlands") {
                        vertexColor.offsetHSL(0, 0, normalizedHeight * 0.05);
                    } else if (biomeName === "Desert") {
                        vertexColor.offsetHSL(0, 0, -normalizedHeight * 0.05);
                    }
                }

                colors.push(vertexColor.r, vertexColor.g, vertexColor.b);
            }
        }

        terrainGeo.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(colors, 3)
        );

        terrainGeo.computeVertexNormals();

        const terrainMat = new THREE.MeshStandardMaterial({
            vertexColors: true,
            flatShading: true,
        });

        const terrain = new THREE.Mesh(terrainGeo, terrainMat);
        group.add(terrain);

        return group;
    }
}
