import * as THREE from 'three'

import { type IMeshBuilder } from '../renderers/IMeshBuilder'
import type { BasicConfigValues } from '../../helpers/types/BasicConfig'

export class Pipeline<TGridData> {
    private meshBuilder: IMeshBuilder<TGridData, BasicConfigValues>

    constructor(
        meshBuilder: IMeshBuilder<TGridData, BasicConfigValues>
    ) {
        this.meshBuilder = meshBuilder;
    }

    run(grid: TGridData, config: BasicConfigValues): THREE.Object3D {
        return this.meshBuilder.build(grid, config)
    }
}