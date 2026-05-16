import * as THREE from "three";

export interface IMeshBuilder<TGridData, TConfig> {
    build(gridData: TGridData, config: TConfig): THREE.Object3D;
}