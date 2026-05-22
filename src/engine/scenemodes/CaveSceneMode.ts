import * as THREE from "three";
import type { ISceneMode } from "./ISceneMode";
import type { OrbitControls } from "three/examples/jsm/Addons.js";

export class CaveSceneMode implements ISceneMode<any> {
    setup(config: any, scene: THREE.Scene, camera: THREE.Camera, controls: OrbitControls): void {
        // ── Camera setup ───────────────────────────────────────────────────────
        camera.position.set(0, 0, 0);
        controls.target.set(0, 0, 0 - 0.000001);

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


        controls.update();
    }   
}
