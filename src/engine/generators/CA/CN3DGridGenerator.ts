import type { CAConfigValues } from "../../../helpers/configs/CAConfig";
import type { IGridGenerator } from "../IGridGenerator";

export class CA3DGridGenerator
implements IGridGenerator<number[][][], CAConfigValues>
{
    generate(
        config: CAConfigValues,
        rng: () => number
    ): number[][][] {

        const {
            steps,
            allowIsolatedStructures,
            minimumStructureSize
        } = config;

        let grid = this.createInitialGrid(config, rng);

        for (let i = 0; i < steps; i++) {
            grid = this.step(grid, config);
        }

        if (!allowIsolatedStructures) {
            this.removeSmallClusters(
                grid,
                minimumStructureSize
            );
        }

        return grid;
    }

    // -------------------------------------------------
    // Initial grid
    // -------------------------------------------------

    private createInitialGrid(
        config: CAConfigValues,
        rng: () => number
    ): number[][][] {

        const {
            gridSize,
            initialGridDensity
        } = config;

        const grid: number[][][] = [];

        for (let z = 0; z < gridSize; z++) {

            grid[z] = [];

            for (let y = 0; y < gridSize; y++) {

                grid[z][y] = [];

                for (let x = 0; x < gridSize; x++) {

                    grid[z][y][x] =
                        rng() * 100 < initialGridDensity
                            ? 1
                            : 0;
                }
            }
        }

        return grid;
    }

    // -------------------------------------------------
    // Simulation step
    // -------------------------------------------------

    private step(
        grid: number[][][],
        config: CAConfigValues
    ): number[][][] {

        const {
            minimumBirthNeighbors,
            maximumBirthNeighbors,
            minimumSurvivalNeighbors,
            maximumSurvivalNeighbors
        } = config;

        const size = grid.length;

        const next =
            Array.from(
                { length: size },
                () =>
                    Array.from(
                        { length: size },
                        () => Array(size).fill(0)
                    )
            );

        for (let z = 0; z < size; z++) {
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {

                    const neighbors =
                        this.countNeighbors(
                            grid,
                            x,
                            y,
                            z,
                            config
                        );

                    if (grid[z][y][x] === 1) {

                        next[z][y][x] =
                            neighbors >= minimumSurvivalNeighbors &&
                            neighbors <= maximumSurvivalNeighbors
                                ? 1
                                : 0;

                    } else {

                        next[z][y][x] =
                            neighbors >= minimumBirthNeighbors &&
                            neighbors <= maximumBirthNeighbors
                                ? 1
                                : 0;
                    }
                }
            }
        }

        return next;
    }

    // -------------------------------------------------
    // Neighbor counting
    // -------------------------------------------------

    private countNeighbors(
        grid: number[][][],
        x: number,
        y: number,
        z: number,
        config: CAConfigValues
    ): number {

        const {
            edgeBehavior
        } = config;

        const size = grid.length;

        let count = 0;

        for (let dz = -1; dz <= 1; dz++) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {

                    // skip self
                    if (
                        dx === 0 &&
                        dy === 0 &&
                        dz === 0
                    ) continue;

                    let nx = x + dx;
                    let ny = y + dy;
                    let nz = z + dz;

                    if (edgeBehavior === "alive") {

                        nx = (nx + size) % size;
                        ny = (ny + size) % size;
                        nz = (nz + size) % size;

                        count += grid[nz][ny][nx];

                    } else {

                        if (
                            nx >= 0 &&
                            ny >= 0 &&
                            nz >= 0 &&
                            nx < size &&
                            ny < size &&
                            nz < size
                        ) {
                            count += grid[nz][ny][nx];
                        }
                    }
                }
            }
        }

        return count;
    }

    // -------------------------------------------------
    // Remove small 3D clusters
    // -------------------------------------------------

    private removeSmallClusters(
        grid: number[][][],
        minSize: number
    ) {

        const size = grid.length;

        const visited =
            Array.from(
                { length: size },
                () =>
                    Array.from(
                        { length: size },
                        () => Array(size).fill(false)
                    )
            );

        const dirs = [
            [1, 0, 0],
            [-1, 0, 0],
            [0, 1, 0],
            [0, -1, 0],
            [0, 0, 1],
            [0, 0, -1],
        ];

        const floodFill = (
            x: number,
            y: number,
            z: number,
            cells: [number, number, number][]
        ) => {

            const stack:
                [number, number, number][] =
                [[x, y, z]];

            while (stack.length) {

                const [cx, cy, cz] =
                    stack.pop()!;

                if (
                    cx < 0 || cy < 0 || cz < 0 ||
                    cx >= size ||
                    cy >= size ||
                    cz >= size ||
                    visited[cz][cy][cx] ||
                    grid[cz][cy][cx] === 0
                ) continue;

                visited[cz][cy][cx] = true;

                cells.push([cx, cy, cz]);

                for (const [dx, dy, dz] of dirs) {

                    stack.push([
                        cx + dx,
                        cy + dy,
                        cz + dz
                    ]);
                }
            }
        };

        for (let z = 0; z < size; z++) {
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {

                    if (
                        !visited[z][y][x] &&
                        grid[z][y][x] === 1
                    ) {

                        const cells:
                            [number, number, number][] = [];

                        floodFill(
                            x,
                            y,
                            z,
                            cells
                        );

                        if (cells.length < minSize) {

                            for (const [cx, cy, cz] of cells) {

                                grid[cz][cy][cx] = 0;
                            }
                        }
                    }
                }
            }
        }
    }
}