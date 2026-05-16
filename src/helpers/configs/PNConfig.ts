export type PNConfigValues = {
    seed: string
    gridSize: number
    
    scale: number
    amplitude: number
    octaves: number
    
    persistance: number
    lacunarity: number

}


export class PNConfigPresets {
    static default: PNConfigValues = {
        seed: '0',

        // terrain resolution
        gridSize: 100,

        // lower = larger terrain features
        scale: 40,

        // terrain height
        amplitude: 12,

        // detail layers
        octaves: 5,

        // amplitude multiplier per octave
        persistance: 0.5,

        // frequency multiplier per octave
        lacunarity: 2,
    }
}