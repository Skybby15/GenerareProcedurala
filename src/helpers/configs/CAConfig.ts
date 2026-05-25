import type { BasicConfigValues } from "../types/BasicConfig"

export type CAViewMode = "Smooth2D" | "Blocky2D" | "Cave3D"


export type CAConfigValues = BasicConfigValues & {
    mode: CAViewMode

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
        gridSize: 160,

        mode:"Smooth2D",

        initialGridDensity: 55,
        steps: 6,

        minimumBirthNeighbors: 3,
        maximumBirthNeighbors: 8,

        minimumSurvivalNeighbors: 0,
        maximumSurvivalNeighbors: 7,

        edgeBehavior: "dead",

        allowIsolatedStructures: true,
        minimumStructureSize: -1,
    }

    static chaotic: CAConfigValues = {
        seed: '42030',
        gridSize: 80,

        mode: "Smooth2D",

        initialGridDensity: 46,
        steps:10,

        minimumBirthNeighbors:2,
        maximumBirthNeighbors:5,

        minimumSurvivalNeighbors:2,
        maximumSurvivalNeighbors:4,

        edgeBehavior: "alive",

        allowIsolatedStructures: true,
        minimumStructureSize: -1
    }

}