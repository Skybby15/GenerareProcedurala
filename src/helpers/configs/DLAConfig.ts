import type { BasicConfigValues } from "../types/BasicConfig"

export type DLAViewMode = "2DBlock" |"3DCave" | "3DInvCave"

export type DLAConfigValues = BasicConfigValues & {
    mode: DLAViewMode,

    particles: number
    steps: number

    stickRadius: number
    stickProximity: number

    particleSpawnBehaviour: "edge" | "empty"

}

export class DLAConfigPresets {
    static default: DLAConfigValues = {
        seed: '0',
        gridSize: 100,

        mode: "2DBlock",
        
        particles: 3000,
        steps: 3000,

        stickRadius: 1,
        stickProximity: 1,

        particleSpawnBehaviour: "empty"
    }
}