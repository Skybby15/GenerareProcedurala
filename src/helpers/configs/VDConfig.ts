import type { DistanceMetric } from "../types/DistanceMetric"

export type VDConfigValues = {
    seed: string
    gridSize: number

    sitesNumber:number,
    relaxationSteps: number
    distanceFunction: DistanceMetric
    minkowskiP: number

    weightedSites: boolean
    maxWeight: number
}

export class VDConfigPresets {
    static default: VDConfigValues = {
        seed: '0',
        gridSize: 100,

        sitesNumber: 100,
        relaxationSteps: 2,
        distanceFunction: "euclidean",
        minkowskiP: 2,

        weightedSites: false,
        maxWeight: 1
    }
}