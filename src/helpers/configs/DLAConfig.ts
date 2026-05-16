export type DLAConfigValues = {
    seed: string
    gridSize: number
    
    particles: number
    steps: number
}

export class DLAConfigPresets {
    static default: DLAConfigValues = {
        seed: '0',
        gridSize: 100,
        
        particles: 1000,
        steps: 100,
    }
}