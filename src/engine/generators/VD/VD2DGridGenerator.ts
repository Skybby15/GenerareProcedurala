import type { IGridGenerator } from "../IGridGenerator"
import type { VDConfigValues } from "../../../helpers/configs/VDConfig"
import { getDistanceFunction } from "../../../helpers/others/distances"
import seedrandom from "seedrandom"

export type Site = {
    x: number,
    y: number,
    weight: number
}

export type VDGridData = {
    grid: number[][]
    sites: Site[]
}

export class VD2DGridGenerator implements IGridGenerator<VDGridData, VDConfigValues> {
    private distanceFn: (x1: number, y1: number, x2: number, y2: number) => number = getDistanceFunction("euclidean")

    generate(config: VDConfigValues): VDGridData {

        const {
            seed,
            gridSize,
            sitesNumber,
            distanceFunction,
            minkowskiP,
            relaxationSteps,
            weightedSites,
            maxWeight,
        } = config

        this.distanceFn = getDistanceFunction(distanceFunction, minkowskiP)

        const sites = this.generateSites(seed, gridSize, sitesNumber, weightedSites, maxWeight)

        let relaxedSites = sites;

        for (let i = 0; i < relaxationSteps; i++) {
            relaxedSites = this.relax(
                relaxedSites,
                gridSize,
                gridSize
            );
        }

        const grid: number[][] = []

        for (let y = 0; y < gridSize; y++) {

            grid[y] = []

            for (let x = 0; x < gridSize; x++) {

                let closest = 0
                let minDist = Infinity

                for (let i = 0; i < relaxedSites.length; i++) {

                    const d = this.distanceFn(
                        x,
                        y,
                        relaxedSites[i].x,
                        relaxedSites[i].y
                    ) - relaxedSites[i].weight

                    if (d < minDist) {
                        minDist = d
                        closest = i
                    }
                }

                grid[y][x] = closest
            }
        }

        return {
            grid,
            sites: relaxedSites,
        }
    }

    private generateSites(
        seed: string,
        gridSize: number,
        sitesNumber: number,
        weightedSites: boolean,
        maxWeight: number
    ): Site[] {

        const rand = seedrandom(seed)
        const sites: Site[] = []

        for (let i = 0; i < sitesNumber; i++) {
            sites.push({
                x: Math.floor(rand() * gridSize),
                y: Math.floor(rand() * gridSize),
                weight: weightedSites ? rand() * maxWeight : 1
            })
        }

        return sites
    }

    private relax(
        sites: Site[],
        width: number,
        height: number
    ): Site[] {

        const accumulators = sites.map(() => ({
            sumX: 0,
            sumY: 0,
            count: 0
        }));

        // Assign each pixel to nearest site
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {

                let closestIndex = 0;
                let closestDist = Infinity;

                for (let i = 0; i < sites.length; i++) {
                    const site = sites[i];

                    const dist = this.distanceFn(x, y, site.x, site.y);

                    if (dist < closestDist) {
                        closestDist = dist;
                        closestIndex = i;
                    }
                }

                const closestSite = sites[closestIndex];

                accumulators[closestIndex].sumX += x * closestSite.weight;
                accumulators[closestIndex].sumY += y * closestSite.weight;
                accumulators[closestIndex].count += closestSite.weight;
            }
        }

        // Move sites to centroids
        return sites.map((site, i) => {

            const acc = accumulators[i];

            if (acc.count === 0)
                return site;

            return {
                x: Math.min(width - 1, Math.max(0, acc.sumX / acc.count)),
                y: Math.min(height - 1, Math.max(0, acc.sumY / acc.count)),
                weight: site.weight
            };
        });
    }
}