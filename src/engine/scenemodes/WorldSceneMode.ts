import * as THREE from "three";
import type { ISceneMode } from "./ISceneMode";
import type { SceneSettingsValues } from "../../helpers/types/SceneSettings";

export class WorldSceneMode implements ISceneMode<any> {
    setup(config: any, scene: THREE.Scene, camera: THREE.Camera, settings: SceneSettingsValues): void {
        const {gridSize} = config;
        if(settings.resetCameraPosition)
        {
            camera.position.set(70, 120, 70);
            camera.lookAt(0,0,0)
        }

            const ambient = new THREE.AmbientLight(0x88aacc, 0.5);
            scene.add(ambient);
        
            const sun = new THREE.DirectionalLight(0xfff5e0, 1.4);
            sun.position.set(gridSize * 0.4, gridSize * 0.6, gridSize * 0.3);

            scene.add(sun);
    }   
}
