import type { IGridGenerator } from "../IGridGenerator";
import type { WorldConfigValues } from "../../../helpers/configs/WorldConfig";
import { NotImplementedError } from "../../../helpers/exceptions/NotImplementedError";

export type BiomeType = "Plains" | "Mountains" | "Highlands" | "Desert";

export type Site = {
    x: number;
    y: number;
};

export type WorldGridData = {
    heights: number[][];
    biomeGrid: number[][];
    riverMask: boolean[][];
    blendMask: number[][];
    neighborRegion: number[][];
    sites: Site[];
    biomeForSite: BiomeType[];
};

const BIOME_TYPES: BiomeType[] = [
    "Plains",
    "Mountains",
    "Highlands",
    "Desert",
];

const BIOME_PARAMETERS: Record<BiomeType, {
    baseHeight: number;
    amplitude: number;
    scale: number;
    octaves: number;
    persistence: number;
    lacunarity: number;
}> = {
    Plains: {
        baseHeight: 0.6,
        amplitude: 1.8,
        scale: 30,
        octaves: 4,
        persistence: 0.45,
        lacunarity: 2.0,
    },
    Mountains: {
        baseHeight: 3,
        amplitude: 75,
        scale: 5,
        octaves: 10,
        persistence: 0.6,
        lacunarity: 1.5,
    },
    Highlands: {
        baseHeight: 0,
        amplitude: 25,
        scale: 5,
        octaves: 8,
        persistence: 0.6,
        lacunarity: 1.5,
    },
    Desert: {
        baseHeight: 0.35,
        amplitude: 10,
        scale: 10,
        octaves: 3,
        persistence: 0.5,
        lacunarity: 2.2,
    },
};

const GRADIENTS: [number, number][] = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
];

export class CombinedGridGenerator implements IGridGenerator<WorldGridData, WorldConfigValues> {
    generate(config: WorldConfigValues, rng: () => number): WorldGridData {
        const { gridSize, borderSoftness, siteRelaxation } = config;
        const sites = this.generateSites(gridSize, BIOME_TYPES.length, rng);
        const biomeForSite = this.shuffleBiomes(rng);

        const voronoi = this.buildVoronoi(gridSize, sites, siteRelaxation);
        const heights = this.buildHeightMap(gridSize, voronoi, biomeForSite, borderSoftness, rng);
        const riverMask = this.buildRiverMask(gridSize, heights, voronoi.regionMap, biomeForSite, rng, config);

        this.carveRiver(heights, riverMask);

        return {
            heights,
            biomeGrid: voronoi.regionMap,
            riverMask,
            blendMask: voronoi.blendMask,
            neighborRegion: voronoi.neighborRegion,
            sites,
            biomeForSite,
        };
    }

    async generateAsync(): Promise<WorldGridData> {
        throw new NotImplementedError();
    }

    private generateSites(gridSize: number, count: number, rng: () => number): Site[] {
        const sites: Site[] = [];

        for (let i = 0; i < count; i++) {
            sites.push({
                x: Math.floor(rng() * gridSize),
                y: Math.floor(rng() * gridSize),
            });
        }

        return sites;
    }

    private shuffleBiomes(rng: () => number): BiomeType[] {
        const biomes = [...BIOME_TYPES];

        for (let i = biomes.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [biomes[i], biomes[j]] = [biomes[j], biomes[i]];
        }

        return biomes;
    }

    private buildVoronoi(gridSize: number, sites: Site[], relaxationSteps: number) {
        let relaxedSites = [...sites];

        for (let i = 0; i < relaxationSteps; i++) {
            relaxedSites = this.relaxSites(relaxedSites, gridSize);
        }

        const regionMap: number[][] = [];
        const blendMask: number[][] = [];
        const neighborRegion: number[][] = [];
        const borderWidth = Math.max(2, Math.floor(gridSize * 0.05));

        for (let y = 0; y < gridSize; y++) {
            regionMap[y] = [];
            blendMask[y] = [];
            neighborRegion[y] = [];

            for (let x = 0; x < gridSize; x++) {
                let best = -1;
                let second = -1;
                let bestDist = Infinity;
                let secondDist = Infinity;

                for (let i = 0; i < relaxedSites.length; i++) {
                    const dist = this.distance(x, y, relaxedSites[i].x, relaxedSites[i].y);

                    if (dist < bestDist) {
                        secondDist = bestDist;
                        second = best;
                        bestDist = dist;
                        best = i;
                    } else if (dist < secondDist) {
                        secondDist = dist;
                        second = i;
                    }
                }

                regionMap[y][x] = best;
                neighborRegion[y][x] = second;
                const borderFactor = Math.max(0, Math.min(1, (borderWidth - (secondDist - bestDist)) / borderWidth));
                blendMask[y][x] = borderFactor;
            }
        }

        return { regionMap, blendMask, neighborRegion };
    }

    private relaxSites(sites: Site[], gridSize: number): Site[] {
        const accumulators = sites.map(() => ({ sumX: 0, sumY: 0, count: 0 }));

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                let bestIndex = 0;
                let bestDist = Infinity;

                for (let i = 0; i < sites.length; i++) {
                    const dist = this.distance(x, y, sites[i].x, sites[i].y);
                    if (dist < bestDist) {
                        bestDist = dist;
                        bestIndex = i;
                    }
                }

                accumulators[bestIndex].sumX += x;
                accumulators[bestIndex].sumY += y;
                accumulators[bestIndex].count += 1;
            }
        }

        return sites.map((site, index) => {
            const area = accumulators[index];
            if (area.count === 0) {
                return site;
            }
            return {
                x: Math.min(gridSize - 1, Math.max(0, Math.round(area.sumX / area.count))),
                y: Math.min(gridSize - 1, Math.max(0, Math.round(area.sumY / area.count))),
            };
        });
    }

    private buildHeightMap(
        gridSize: number,
        voronoi: { regionMap: number[][]; blendMask: number[][]; neighborRegion: number[][] },
        biomeForSite: BiomeType[],
        borderSoftness: number,
        rng: () => number
    ): number[][] {
        const heights: number[][] = [];
        const perlin = this.createPerlinGenerator(rng);

        for (let y = 0; y < gridSize; y++) {
            heights[y] = [];

            for (let x = 0; x < gridSize; x++) {
                const region = voronoi.regionMap[y][x];
                const neighbor = voronoi.neighborRegion[y][x];
                const regionBiome = biomeForSite[region];
                const neighborBiome = biomeForSite[neighbor];
                const regionParams = BIOME_PARAMETERS[regionBiome];
                const neighborParams = BIOME_PARAMETERS[neighborBiome];

                const nx = x / gridSize;
                const ny = y / gridSize;

                let heightA = regionParams.baseHeight + perlin(nx * regionParams.scale, ny * regionParams.scale, regionParams.octaves, regionParams.persistence, regionParams.lacunarity) * regionParams.amplitude;
                let heightB = neighborParams.baseHeight + perlin(nx * neighborParams.scale, ny * neighborParams.scale, neighborParams.octaves, neighborParams.persistence, neighborParams.lacunarity) * neighborParams.amplitude;
                const borderFactor = Math.min(1, Math.max(0, voronoi.blendMask[y][x] * borderSoftness * 16));

                if(heightA < regionParams.baseHeight) heightA *= 0.3;
                if(heightB < neighborParams.baseHeight) heightB *= 0.3;
                heights[y][x] = this.lerp(heightA, heightB, borderFactor * 0.5);
            }
        }

        return heights;
    }

    private buildRiverMask(
        gridSize: number,
        heights: number[][],
        regionMap: number[][],
        biomeForSite: BiomeType[],
        rng: () => number,
        config: WorldConfigValues
    ): boolean[][] {
        const riverMask: boolean[][] = [];
        const allowed = (x: number, y: number) => {
            const biome = biomeForSite[regionMap[y][x]];
            return biome === "Plains" || biome === "Highlands";
        };

        for (let y = 0; y < gridSize; y++) {
            riverMask[y] = [];
            for (let x = 0; x < gridSize; x++) {
                riverMask[y][x] = false;
            }
        }

        const sourceCandidates: Site[] = [];
        const highlandSources: Site[] = [];
        const edgeTargets: Site[] = [];

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (!allowed(x, y)) continue;

                const candidate = { x, y };
                sourceCandidates.push(candidate);

                if (biomeForSite[regionMap[y][x]] === "Highlands") {
                    highlandSources.push(candidate);
                }

                if (this.isEdgeCell(x, y, gridSize)) {
                    edgeTargets.push(candidate);
                }
            }
        }

        if (sourceCandidates.length === 0) {
            return riverMask;
        }

        const start = this.chooseHighlandSource(highlandSources.length > 0 ? highlandSources : sourceCandidates, heights, rng);
        riverMask[start.y][start.x] = true;

        const riverTarget = this.chooseRiverTarget(edgeTargets.length > 0 ? edgeTargets : this.getEdgeCells(gridSize, allowed), heights, rng);
        this.walkPathBetween(start, riverTarget, heights, regionMap, riverMask, rng, allowed, config.riverStepLimit);

        for (let walker = 1; walker < config.riverWalkers; walker++) {
            const branchSource = this.chooseBranchSource(sourceCandidates, heights, rng);
            const riverCells = this.getRiverCells(riverMask);
            const branchTarget = riverCells.length > 0 ? riverCells[Math.floor(rng() * riverCells.length)] : riverTarget;
            this.walkPathBetween(branchSource, branchTarget, heights, regionMap, riverMask, rng, allowed, Math.max(32, Math.floor(config.riverStepLimit / 2)));
        }

        return riverMask;
    }

    private chooseHighlandSource(candidates: Site[], heights: number[][], rng: () => number): Site {
        const sorted = [...candidates].sort((a, b) => heights[b.y][b.x] - heights[a.y][a.x]);
        const topCount = Math.max(1, Math.floor(sorted.length * 0.2));
        return sorted[Math.floor(rng() * topCount)];
    }

    private chooseBranchSource(candidates: Site[], heights: number[][], rng: () => number): Site {
        const sorted = [...candidates].sort((a, b) => heights[b.y][b.x] - heights[a.y][a.x]);
        const topCount = Math.max(1, Math.floor(sorted.length * 0.4));
        return sorted[Math.floor(rng() * topCount)];
    }

    private chooseRiverTarget(candidates: Site[], heights: number[][], rng: () => number): Site {
        const sorted = [...candidates].sort((a, b) => heights[a.y][a.x] - heights[b.y][b.x]);
        const lowCount = Math.max(1, Math.floor(sorted.length * 0.25));
        return sorted[Math.floor(rng() * lowCount)];
    }

    private getRiverCells(riverMask: boolean[][]): Site[] {
        const cells: Site[] = [];
        for (let y = 0; y < riverMask.length; y++) {
            for (let x = 0; x < riverMask[y].length; x++) {
                if (riverMask[y][x]) {
                    cells.push({ x, y });
                }
            }
        }
        return cells;
    }

    private isEdgeCell(x: number, y: number, gridSize: number) {
        return x === 0 || y === 0 || x === gridSize - 1 || y === gridSize - 1;
    }

    private walkPathBetween(
        start: Site,
        target: Site,
        heights: number[][],
        regionMap: number[][],
        riverMask: boolean[][],
        rng: () => number,
        allowed: (x: number, y: number) => boolean,
        stepLimit: number
    ) {
        let current = { ...start };
        const trail: Site[] = [current];

        for (let step = 0; step < stepLimit; step++) {
            if (current.x === target.x && current.y === target.y) {
                break;
            }

            const next = this.chooseRiverNeighbor(current, heights, regionMap, riverMask, rng, allowed, target);
            if (!next) break;

            trail.push(next);
            current = next;

            if (this.isAdjacentToRiver(current, riverMask)) {
                trail.forEach(cell => (riverMask[cell.y][cell.x] = true));
                break;
            }
        }

        trail.forEach(cell => (riverMask[cell.y][cell.x] = true));
    }

    private chooseRiverNeighbor(
        current: Site,
        heights: number[][],
        regionMap: number[][],
        riverMask: boolean[][],
        rng: () => number,
        allowed: (x: number, y: number) => boolean,
        target?: Site
    ): Site | null {
        const neighbors = this.getNeighbors(current.x, current.y, heights.length);
        const currentHeight = heights[current.y][current.x];
        const currentRegion = regionMap[current.y][current.x];
        const directionX = target ? target.x - current.x : 0;
        const directionY = target ? target.y - current.y : 0;
        const directionDist = Math.max(1, Math.hypot(directionX, directionY));

        const weighted: Array<{ weight: number; pos: Site }> = [];

        for (const candidate of neighbors) {
            if (!allowed(candidate.x, candidate.y)) continue;
            const height = heights[candidate.y][candidate.x];
            let weight = 1;

            if (riverMask[candidate.y][candidate.x]) {
                weight += 2;
            }

            if (height < currentHeight) {
                weight += 1.8;
            }

            if (regionMap[candidate.y][candidate.x] !== currentRegion) {
                weight += 1.5;
            }

            if (target) {
                const dx = candidate.x - current.x;
                const dy = candidate.y - current.y;
                const dot = (dx * directionX + dy * directionY) / directionDist;
                weight += Math.max(0, dot) * 2.2;
            }

            if (Math.abs(candidate.x - current.x) + Math.abs(candidate.y - current.y) === 2) {
                weight *= 0.95;
            }

            if (weight > 0) {
                weighted.push({ weight, pos: candidate });
            }
        }

        if (weighted.length === 0) {
            return null;
        }

        const total = weighted.reduce((sum, item) => sum + item.weight, 0);
        let choice = rng() * total;

        for (const item of weighted) {
            choice -= item.weight;
            if (choice <= 0) {
                return item.pos;
            }
        }

        return weighted[weighted.length - 1].pos;
    }

    private getEdgeCells(
        gridSize: number,
        allowed: (x: number, y: number) => boolean
    ): Site[] {
        const edgeCells: Site[] = [];

        for (let i = 0; i < gridSize; i++) {
            const candidates = [
                { x: i, y: 0 },
                { x: i, y: gridSize - 1 },
                { x: 0, y: i },
                { x: gridSize - 1, y: i },
            ];

            for (const cell of candidates) {
                if (allowed(cell.x, cell.y)) {
                    edgeCells.push(cell);
                }
            }
        }

        return edgeCells;
    }

    private isAdjacentToRiver(position: Site, riverMask: boolean[][]): boolean {
        const neighbors = this.getNeighbors(position.x, position.y, riverMask.length);
        return neighbors.some(cell => riverMask[cell.y][cell.x]);
    }

    private getNeighbors(x: number, y: number, gridSize: number): Site[] {
        const result: Site[] = [];

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && ny >= 0 && nx < gridSize && ny < gridSize) {
                    result.push({ x: nx, y: ny });
                }
            }
        }

        return result;
    }

    private carveRiver(heights: number[][], riverMask: boolean[][]) {
        const depth = 1.5;
        const size = heights.length;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (riverMask[y][x]) {
                    heights[y][x] -= depth;
                }
            }
        }

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (riverMask[y][x]) continue;
                const neighbors = this.getNeighbors(x, y, size);
                const adjacentRiver = neighbors.some(pos => riverMask[pos.y][pos.x]);
                if (adjacentRiver) {
                    heights[y][x] -= depth * 0.4;
                }
            }
        }
    }

    private createPerlinGenerator(rng: () => number) {
        const perm = this.buildPermutation(rng);

        const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
        const lerp = (a: number, b: number, t: number) => a + t * (b - a);

        return (x: number, y: number, octaves: number, persistence: number, lacunarity: number): number => {
            let amplitude = 1;
            let frequency = 1;
            let value = 0;
            let total = 0;

            for (let octave = 0; octave < octaves; octave++) {
                value += this.perlin(x * frequency, y * frequency, perm, fade, lerp) * amplitude;
                total += amplitude;
                amplitude *= persistence;
                frequency *= lacunarity;
            }

            return value / Math.max(total, 1);
        };
    }

    private buildPermutation(rng: () => number) {
        const base: number[] = Array.from({ length: 256 }, (_, i) => i);

        for (let i = base.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [base[i], base[j]] = [base[j], base[i]];
        }

        return [...base, ...base];
    }

    private perlin(
        x: number,
        y: number,
        perm: number[],
        fade: (t: number) => number,
        lerp: (a: number, b: number, t: number) => number
    ) {
        const xi = Math.floor(x) & 255;
        const yi = Math.floor(y) & 255;
        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);

        const u = fade(xf);
        const v = fade(yf);

        const aa = perm[perm[xi] + yi];
        const ab = perm[perm[xi] + yi + 1];
        const ba = perm[perm[xi + 1] + yi];
        const bb = perm[perm[xi + 1] + yi + 1];

        const x1 = lerp(this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf), u);
        const x2 = lerp(this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1), u);

        return lerp(x1, x2, v);
    }

    private grad(hash: number, x: number, y: number) {
        const gradient = GRADIENTS[hash % GRADIENTS.length];
        return gradient[0] * x + gradient[1] * y;
    }

    private distance(x1: number, y1: number, x2: number, y2: number) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    private lerp(a: number, b: number, t: number) {
        return a + (b - a) * t;
    }
}
