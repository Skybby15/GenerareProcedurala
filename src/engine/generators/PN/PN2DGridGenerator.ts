import Alea from "alea"
import { createNoise2D } from "simplex-noise"
import type { IGridGenerator } from "../IGridGenerator"
import type { PNConfigValues } from "../../../helpers/configs/PNConfig"

export type PNGridData = {
    heights: number[][]
}

export class PN2DGridGenerator implements IGridGenerator<PNGridData, PNConfigValues> {

    generate(config: PNConfigValues): PNGridData {

        const {
            seed,
            gridSize,
            scale,
            amplitude,
            octaves,
            persistance,
            lacunarity
        } = config

        const noise2D = createNoise2D(
            Alea(seed)
        )

        const heights: number[][] = []

        for (let z = 0; z < gridSize; z++) {

            heights[z] = []

            for (let x = 0; x < gridSize; x++) {

                let value = 0

                let frequency = scale
                let strength = amplitude

                for (let o = 0; o < octaves; o++) {

                    value += noise2D(
                        x * frequency,
                        z * frequency
                    ) * strength

                    frequency *= lacunarity
                    strength *= persistance
                }

                heights[z][x] = value
            }
        }

        return { heights }
    }
}