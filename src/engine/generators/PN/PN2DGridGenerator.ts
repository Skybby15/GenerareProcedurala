import { createNoise2D } from "simplex-noise"
import type { IGridGenerator } from "../IGridGenerator"
import type { PNConfigValues } from "../../../helpers/configs/PNConfig"

export type PNGridData = {
    heights: number[][]
}

export class PN2DGridGenerator implements IGridGenerator<PNGridData, PNConfigValues> {

    generate(config: PNConfigValues, rng: () => number): PNGridData {

        const {
            gridSize,
            scale,
            amplitude,
            octaves,
            persistance,
            lacunarity
        } = config

        const noise2D = createNoise2D(
            rng
        )

        const heights: number[][] = []

        for (let z = 0; z < gridSize; z++) {

            heights[z] = []

            for (let x = 0; x < gridSize; x++) {

                let value = 0;
                let frequency = 1;
                let strength = 1;
                let maxValue = 0;

                for (let o = 0; o < octaves; o++) {
                    value += noise2D(
                        (x / scale) * frequency,
                        (z / scale) * frequency
                    ) * strength;

                    maxValue += strength;

                    frequency *= lacunarity;
                    strength *= persistance;
                }

                value /= maxValue;

                heights[z][x] = value * amplitude;
            }
        }

        return { heights }
    }
}