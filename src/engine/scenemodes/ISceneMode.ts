import * as THREE from 'three'
import type { SceneSettingsValues } from '../../helpers/types/SceneSettings';

export interface ISceneMode<TConfig> {
    setup(config: TConfig, scene: THREE.Scene, camera: THREE.Camera,settings: SceneSettingsValues): void;
}