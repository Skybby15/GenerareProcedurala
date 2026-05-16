import * as THREE from 'three'

import { type IMeshBuilder } from '../renderers/IMeshBuilder'
import { type IGridGenerator } from '../generators/IGridGenerator'

export class Pipeline<TGridData, TConfig> {
    private generator: IGridGenerator<TGridData, TConfig>
    private meshBuilder: IMeshBuilder<TGridData, TConfig>

    constructor(
        generator: IGridGenerator<TGridData, TConfig>,
        meshBuilder: IMeshBuilder<TGridData, TConfig>
    ) {
        this.generator = generator;
        this.meshBuilder = meshBuilder;
    }

    run(config: TConfig): THREE.Object3D {
        const grid = this.generator.generate(config)
        return this.meshBuilder.build(grid, config)
    }
}