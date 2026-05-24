import * as THREE from "three";
import type { ISceneMode } from "./ISceneMode";

export class CaveSceneMode implements ISceneMode<any> {
    setup(config: any, scene: THREE.Scene, camera: THREE.Camera): void {
        console.log("Cave scene mode")
        camera.position.set(0, 0, 0);

        const ambientLight = new THREE.AmbientLight("#FFFFFF",0.3)
        const cameraTorchLight = new THREE.PointLight(
            "#FFFFFF",
            1,
            90,
            0.3
        )

        camera.add(cameraTorchLight)
        scene.add(camera)
        scene.add(ambientLight)
    }   
}
