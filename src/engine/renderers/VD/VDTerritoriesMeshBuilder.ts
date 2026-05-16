import * as THREE from 'three'
import type { IMeshBuilder } from "../IMeshBuilder";
import type { VDGridData } from '../../generators/VD/VD2DGridGenerator';
import type { VDConfigValues } from '../../../helpers/configs/VDConfig';
import seedrandom from 'seedrandom';


export class VDTerritoriesMeshBuilder implements IMeshBuilder<VDGridData, VDConfigValues> {
    build(gridData: VDGridData, config: VDConfigValues): THREE.Object3D {



        const group = new THREE.Group()

        const {
            seed,
            gridSize,
        } = config

        const {
            grid,
            sites,
        } = gridData

        const seededRandom = seedrandom(seed.toString())

        const heights =
            sites.map(() => seededRandom() * 3)

        // -----------------------------
        // TERRAIN
        // -----------------------------

        const terrainGeo =
            new THREE.PlaneGeometry(
                gridSize,
                gridSize,
                gridSize - 1,
                gridSize - 1
            )

        terrainGeo.rotateX(-Math.PI / 2)

        const pos = terrainGeo.attributes.position

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {

                const i = y * gridSize + x

                const region = grid[y][x]

                pos.setY(i, heights[region])
            }
        }

        terrainGeo.computeVertexNormals()

        const colors =
            sites.map(() =>
                new THREE.Color(
                    seededRandom(),
                    seededRandom(),
                    seededRandom()
                )
            )

        const colorAttr = []

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {

                const region = grid[y][x]
                const c = colors[region]

                colorAttr.push(c.r, c.g, c.b)
            }
        }

        terrainGeo.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(colorAttr, 3)
        )

        const terrainMat =
            new THREE.MeshStandardMaterial({
                vertexColors: true,
                flatShading: true,
            })

        const terrain =
            new THREE.Mesh(terrainGeo, terrainMat)

        group.add(terrain)

        // -----------------------------
        // MARKERS
        // -----------------------------

        const coneHeight = 4.5

        const markerGeo =
            new THREE.ConeGeometry(0.2, coneHeight, 5)

        const markerMat =
            new THREE.MeshStandardMaterial({
                color: '#ffcc00',
                emissive: '#ffaa00'
            })

        sites.forEach(site => {

            const marker = new THREE.Mesh(markerGeo, markerMat)
            marker.userData = { 
                site
            }

            const h = gridSize / 2

            marker.position.x = (site.x / (gridSize - 1)) * gridSize - h

            marker.position.z =
                (site.y / (gridSize - 1)) * gridSize - h

            marker.position.y =
                coneHeight / 2

            group.add(marker)
        })

        return group
    }
}