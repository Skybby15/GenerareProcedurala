import * as THREE from "three";
import type { ISceneMode } from "./ISceneMode";
import type { SceneSettingsValues } from "../../helpers/types/SceneSettings";

export class CaveSceneMode implements ISceneMode<any> {
    setup(_config: any, scene: THREE.Scene, camera: THREE.Camera, settings: SceneSettingsValues): void {
        const {
            resetCameraPosition
        } = settings

        if(resetCameraPosition)
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
