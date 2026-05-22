import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { Pipeline } from '../pipeline/Pipeline'
import type { ISceneMode } from '../scenemodes/ISceneMode'
import type { BasicConfigValues } from '../../helpers/types/BasicConfig'
import type { GeneratorType } from '../../helpers/types/GeneratorTypes'

export class SceneManager<TGridData> {
    private scene: THREE.Scene
    private camera: THREE.Camera
    private controls: OrbitControls

    constructor(
        scene: THREE.Scene,
        camera: THREE.Camera,
        controls: OrbitControls
    ) {
        this.scene = scene
        this.camera = camera
        this.controls = controls
    }

    async loadAsync(
        mode: ISceneMode<BasicConfigValues>,
        pipeline: Pipeline<TGridData>,
        config: BasicConfigValues,
        type: GeneratorType,
    ) {

        this.dispose()

        const grid = await this.generateGridAsync(type,config)

        const worldObject = pipeline.run(grid,config)

        mode.setup(
            config,
            this.scene,
            this.camera,
            this.controls
        )

        this.scene.add(worldObject)
    }

    private dispose() {

        this.scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
                obj.geometry.dispose()
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(m => m.dispose())
                } else {
                    obj.material.dispose()
                }
            }
        })
        this.camera.clear()
        this.scene.clear()
    }

    
    generateGridAsync(
        type: GeneratorType,
        config: BasicConfigValues
    ): Promise<TGridData> {
        return new Promise((resolve) => {
            const worker = new Worker(
                new URL("../../helpers/workers/generatorWorker.ts", import.meta.url),
                { type: "module" }
            );

            worker.onmessage = (ev) => {
                resolve(ev.data.grid);
                worker.terminate();
            };

            worker.postMessage({ type, config });
        });
    }
}