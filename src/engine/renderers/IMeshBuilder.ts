import * as THREE from "three";
import type { BasicConfigValues } from "../../helpers/types/BasicConfig";

export interface IMeshBuilder<TGridData, TConfig extends BasicConfigValues> {
    build(gridData: TGridData, config: TConfig): THREE.Object3D;
}