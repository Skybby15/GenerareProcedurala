import * as THREE from 'three'
import { Pipeline } from '../pipeline/Pipeline'
import type { ISceneMode } from '../scenemodes/ISceneMode'
import type { BasicConfigValues } from '../../helpers/types/BasicConfig'
import type { GeneratorType } from '../../helpers/types/GeneratorTypes'
import { CancelledGenerationError } from '../../helpers/exceptions/CancelledGenerationError'
import type { SceneSettingsValues } from '../../helpers/types/SceneSettings'

export class SceneManager<TGridData> {
    private scene: THREE.Scene
    private camera: THREE.Camera
    private currentWorker?: Worker
    private currentWorkerReject?: (reason?: any) => void

    constructor(
        scene: THREE.Scene,
        camera: THREE.Camera,
    ) {
        this.scene = scene
        this.camera = camera
    }

    async loadAsync(
        mode: ISceneMode<BasicConfigValues>,
        pipeline: Pipeline<TGridData>,
        config: BasicConfigValues,
        settings: SceneSettingsValues,
        type: GeneratorType,
    ) {
        try{
            
            let time = Date.now()

            const grid = await this.generateGridAsync(type,config)

            console.log("Grid:" + ( Date.now() - time ))
            time = Date.now()

            const worldObject = pipeline.run(grid,config)
            
            this.dispose()

            mode.setup(
                config,
                this.scene,
                this.camera,
                settings
            )
            
            this.scene.add(worldObject)
            console.log("Mesh:" + ( Date.now() - time ))
        } catch (err){
            if(err instanceof CancelledGenerationError)
                return
            else
                throw err
        }

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
        return new Promise((resolve, reject) => {
            // If there's an existing worker running, cancel it before starting a new one
            if (this.currentWorker) {
                try {
                    this.currentWorker.terminate()
                } catch (e) {
                    console.error(e)
                }
                if (this.currentWorkerReject) {
                    const err: any = new CancelledGenerationError()
                    err.cancelled = true
                    this.currentWorkerReject(err)
                }
                this.currentWorker = undefined
                this.currentWorkerReject = undefined
            }

            const worker = new Worker(
                new URL("../../helpers/workers/generatorWorker.ts", import.meta.url),
                { type: "module" }
            );

            this.currentWorker = worker
            this.currentWorkerReject = reject

            worker.onmessage = (ev) => {
                // only resolve if this worker is still the active one
                if (this.currentWorker === worker) {
                    resolve(ev.data.grid)
                    try { worker.terminate() } catch (e) { 
                        console.error(e)
                    }
                    this.currentWorker = undefined
                    this.currentWorkerReject = undefined
                } else {
                    try { worker.terminate() } catch (e) { 
                        console.error(e)
                    }
                }
            }

            worker.onerror = (ev) => {
                if (this.currentWorker === worker) {
                    reject(ev.error ?? new Error('Worker error'))
                    this.currentWorker = undefined
                    this.currentWorkerReject = undefined
                }
                try { worker.terminate() } catch (e) { 
                    console.error(e)
                }
            }

            worker.postMessage({ type, config })
        });
    }
}