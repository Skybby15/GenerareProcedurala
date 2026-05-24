import * as THREE from 'three'

export interface ISceneMode<TConfig> {
    setup(config: TConfig, scene: THREE.Scene, camera: THREE.Camera): void;
}