import type { BasicConfigValues } from "../types/BasicConfig"

export type DLAViewMode = "2DSmooth" | "3DCave"

export type DLAConfigValues = BasicConfigValues & {
    mode: DLAViewMode,

    particles: number
    steps: number

    stickRadius: number
    stickProximity: number

    spawnBehaviour: "edge" | "emptySpot" | "anywhere" //not implemented

}

export class DLAConfigPresets {
    static default: DLAConfigValues = {
        seed: '0',
        gridSize: 100,

        mode: "2DSmooth",
        
        particles: 1000,
        steps: 100,

        stickRadius: 1,
        stickProximity: 1,

        spawnBehaviour: "edge" //not implemented

    }
}