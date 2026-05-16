export type CAConfigValues = {
    seed: string
    gridSize: number

    initialGridDensity: number
    steps: number

    minimumBirthNeighbors: number
    maximumBirthNeighbors: number

    minimumSurvivalNeighbors: number
    maximumSurvivalNeighbors: number

    edgeBehavior: "dead" | "alive"

    allowIsolatedStructures: boolean
    minimumStructureSize: number
}

export class CAConfigPresets {
    static default: CAConfigValues = {
        seed: '0',
        gridSize: 100,

        initialGridDensity: 50,
        steps: 100,

        minimumBirthNeighbors: 3,
        maximumBirthNeighbors: 3,

        minimumSurvivalNeighbors: 2,
        maximumSurvivalNeighbors: 3,

        edgeBehavior: "alive",

        allowIsolatedStructures: true,
        minimumStructureSize: -1,
    }
}