import * as THREE from 'three'
import type { Object3D } from "three";
import type { IMeshBuilder } from "../IMeshBuilder";
import type { PNGridData } from '../../generators/PN/PN2DGridGenerator';
import type { PNConfigValues } from '../../../helpers/configs/PNConfig';


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
        
        for (let i = 0; i < pos.count; i++) {
            const x = i % gridSize
            const y = Math.floor(i / gridSize)
    
            const height = heights[y][x]    
    
            pos.setY(i, height)
        }

        terrainGeo.computeVertexNormals()
        const terrainMat = new THREE.MeshStandardMaterial({
            color: '#4d8f4f',
            wireframe: false,
            flatShading: true,
        })
        const terrain = new THREE.Mesh(terrainGeo, terrainMat)
        group.add(terrain)
        
        return group
    }
}
