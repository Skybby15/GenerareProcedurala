import type { BasicConfigValues } from "../types/BasicConfig"

export type PNConfigValues = BasicConfigValues & {    
    scale: number
    amplitude: number
    octaves: number
    
    persistance: number
    lacunarity: number

}


export class PNConfigPresets {
    static default: PNConfigValues = {
        seed: '0',
        gridSize: 100,

        scale: 40,
        amplitude: 12,

        octaves: 5,

        persistance: 0.5,
        lacunarity: 2,
    }
}