import type { BasicConfigValues } from "../types/BasicConfig";

export type WorldConfigValues = BasicConfigValues & {
    borderSoftness: number
    riverWalkers: number
    riverStepLimit: number
    siteRelaxation: number
}

export class WorldConfigPresets {
    static default: WorldConfigValues = {
        seed: '0',
        gridSize: 200,
        borderSoftness: 0.06,
        riverWalkers: 20,
        riverStepLimit: 10000,
        siteRelaxation: 2,
    }
}
