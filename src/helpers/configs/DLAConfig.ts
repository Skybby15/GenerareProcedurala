import type { BasicConfigValues } from "../types/BasicConfig"

export type DLAViewMode = "2DSmooth" | "3DCave"

export type DLAConfigValues = BasicConfigValues & {
    mode: DLAViewMode,

    particles: number
    steps: number
}

export class DLAConfigPresets {
    static default: DLAConfigValues = {
        seed: '0',
        gridSize: 100,

        mode: "2DSmooth",
        
        particles: 1000,
        steps: 100,
    }
}