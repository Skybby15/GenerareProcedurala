import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { Pipeline } from '../pipeline/Pipeline'
import type { ISceneMode } from '../scenemodes/ISceneMode'

export class SceneManager<TConfig> {
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

    load(
        mode: ISceneMode<TConfig>,
        pipeline: Pipeline<TConfig, any>,
        config: TConfig
    ) {

        this.dispose()

        mode.setup(
            config,
            this.scene,
            this.camera,
            this.controls
        )

        const worldObject = pipeline.run(config)

        this.scene.add(worldObject)
    }

    private dispose() {

        this.scene.traverse((obj: any) => {

            obj.geometry?.dispose?.()

            if (obj.material) {

                if (Array.isArray(obj.material)) {
                    obj.material.forEach((m: any) =>
                        m.dispose?.()
                    )
                }
                else {
                    obj.material.dispose?.()
                }
            }
        })

        this.scene.clear()
    }
}