import * as THREE from "three";
import type { ISceneMode } from "./ISceneMode";

export class PlaneSceneMode implements ISceneMode<any> {
    setup(config: any, scene: THREE.Scene, camera: THREE.Camera): void {
        const {gridSize} = config;
        // ── Camera setup ────────────────────────────────────────────────────────
        camera.position.set(0, gridSize * 0.7, 0);
        camera.lookAt(0,0,0)

        // ── Lighting ─────────────────────────────────────────────────────────────
            const ambient = new THREE.AmbientLight(0x88aacc, 0.5);
            scene.add(ambient);
        
            const sun = new THREE.DirectionalLight(0xfff5e0, 1.4);
            sun.position.set(gridSize * 0.4, gridSize * 0.6, gridSize * 0.3);

            scene.add(sun);

            this.addWaterPlaneToScene(scene, gridSize)
    }   

    private addWaterPlaneToScene(
        scene: THREE.Scene,
        gridSize: number,
        options?: {
            height?: number;
            color?: string;
            opacity?: number;
        }
        ): THREE.Mesh {
        const {
            height = -0.1,          // y position of water plane
            color = "#2a7fff",
            opacity = 0.6,
        } = options || {};

        const geometry = new THREE.PlaneGeometry(gridSize, gridSize);

        geometry.rotateX(-Math.PI / 2);

        const material = new THREE.MeshStandardMaterial({
            color,
            transparent: true,
            opacity,
            roughness: 0.2,
            metalness: 0.0,
            side:THREE.DoubleSide,
        });

        const water = new THREE.Mesh(geometry, material);

        water.position.y = height;

        // optional: render on top of terrain slightly
        water.renderOrder = 1;

        scene.add(water);

        return water;
    }
}
