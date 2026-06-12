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
            let gridTime: number
            let meshTime: number
            let setupTime: number
            
            gridTime = Date.now()

            const grid = await this.generateGridAsync(type,config)

            gridTime = Date.now() - gridTime

            meshTime = Date.now()

            const worldObject = pipeline.run(grid,config)

            meshTime = Date.now() - meshTime

            setupTime = Date.now()
            
            this.dispose()

            mode.setup(
                config,
                this.scene,
                this.camera,
                settings
            )
            
            this.scene.add(worldObject)

            setupTime = Date.now() - setupTime

            return {
                gridTime,
                meshTime,
                setupTime
            }
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