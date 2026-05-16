import * as THREE from "three";
import type { ISceneMode } from "./ISceneMode";
import type { OrbitControls } from "three/examples/jsm/Addons.js";

export class PlaneSceneMode implements ISceneMode<any> {
    setup(config: any, scene: THREE.Scene, camera: THREE.Camera, controls: OrbitControls): void {
        const {gridSize} = config;
        // ── Camera setup ────────────────────────────────────────────────────────
        camera.position.set(0, gridSize * 0.7, 0);
        controls.target.set(0, gridSize * 0.7 - 0.0001, 0);
        controls.update();

        // ── Lighting ─────────────────────────────────────────────────────────────
            const ambient = new THREE.AmbientLight(0x88aacc, 0.5);
            scene.add(ambient);
        
            const sun = new THREE.DirectionalLight(0xfff5e0, 1.4);
            sun.position.set(gridSize * 0.4, gridSize * 0.6, gridSize * 0.3);
            sun.castShadow = true;
            sun.shadow.mapSize.set(2048, 2048);
            sun.shadow.camera.near = 0.5;
            sun.shadow.camera.far = gridSize * 3;

            const sc = gridSize * 0.7;
            sun.shadow.camera.left = -sc;
            sun.shadow.camera.right = sc;
            sun.shadow.camera.top = sc;
            sun.shadow.camera.bottom = -sc;
            scene.add(sun);
    }   
}
