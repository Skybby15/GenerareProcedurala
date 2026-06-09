import * as THREE from 'three'
import type { Object3D } from "three";
import type { IMeshBuilder } from "../IMeshBuilder";
import type { PNGridData } from '../../generators/PN/PN2DGridGenerator';
import type { PNConfigValues } from '../../../helpers/configs/PNConfig';

const snowColor = new THREE.Color("#ffffff");
const grassColor = new THREE.Color("#4d8f4f");
const hillColor = new THREE.Color("#625032");


export class PNPlaneMeshBuilder implements IMeshBuilder<PNGridData,PNConfigValues> {
    build(gridData: PNGridData, config: PNConfigValues): Object3D {
        const group = new THREE.Group()

        const {
            gridSize,
        } = config

        const { heights } = gridData

        const terrainGeo = new THREE.PlaneGeometry(gridSize, gridSize, gridSize - 1, gridSize - 1)
        terrainGeo.rotateX(-Math.PI / 2)
    
        const pos = terrainGeo.attributes.position
        const colors: number[] = []
        
        for (let i = 0; i < pos.count; i++) {
            const x = i % gridSize
            const y = Math.floor(i / gridSize)
    
            const height = heights[y][x]    
    
            pos.setY(i, height)

            if (height > config.amplitude * 0.4) {
                colors.push(
                    snowColor.r,
                    snowColor.g,
                    snowColor.b
                )
            } else if (height > - config.amplitude * 0.1 ) {
                colors.push(
                    hillColor.r,
                    hillColor.g,
                    hillColor.b
                )
            } else {
                colors.push(
                    grassColor.r,
                    grassColor.g,
                    grassColor.b
                )
            }
        }

        terrainGeo.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(colors, 3)
        )

        terrainGeo.computeVertexNormals()
        const terrainMat = new THREE.MeshStandardMaterial({
            vertexColors: true,
            flatShading: true,
        })
        const terrain = new THREE.Mesh(terrainGeo, terrainMat)
        group.add(terrain)
        
        return group
    }
}
