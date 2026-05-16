import * as THREE from 'three'
import type { OrbitControls } from 'three/examples/jsm/Addons.js';

export interface ISceneMode<TConfig> {
    setup(config: TConfig, scene: THREE.Scene, camera: THREE.Camera, controls: OrbitControls): void;
}