import type { CAConfigValues } from "../../../helpers/configs/CAConfig";
import type { IGridGenerator } from "../IGridGenerator";

export class CA2DGridGenerator implements IGridGenerator<number[][], CAConfigValues> {

    generate(config: CAConfigValues, rng: () => number): number[][] {
        const {
            steps,
            allowIsolatedStructures,
            minimumStructureSize
        } = config

        let grid = this.createInitialGrid(config, rng);

        for (let i = 0; i < steps; i++) {
            grid = this.step(grid, config);
        }

        if (!allowIsolatedStructures) {
            this.removeSmallClusters(grid, minimumStructureSize);
        }

        return grid;
    }

    private createInitialGrid(config: CAConfigValues, rng: () => number): number[][] {
        const { 
            gridSize,
            initialGridDensity
        } = config;
        const grid: number[][] = [];

        for (let y = 0; y < gridSize; y++) {
            const row: number[] = [];
            for (let x = 0; x < gridSize; x++) {
                row.push(rng()*100 < initialGridDensity ? 1 : 0);
            }
            grid.push(row);
        }

        return grid;
    }

    private step(grid: number[][], config: CAConfigValues): number[][] {
        const {
            minimumBirthNeighbors,
            maximumBirthNeighbors,
            minimumSurvivalNeighbors,
            maximumSurvivalNeighbors
        } = config;

        const size = grid.length;
        const next = Array.from({ length: size }, () => Array(size).fill(0));

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const neighbors = this.countNeighbors(grid, x, y, config);

                if (grid[y][x] === 1) {
                    next[y][x] =
                        neighbors >= minimumSurvivalNeighbors &&
                        neighbors <= maximumSurvivalNeighbors
                            ? 1
                            : 0;
                } else {
                    next[y][x] =
                        neighbors >= minimumBirthNeighbors &&
                        neighbors <= maximumBirthNeighbors
                            ? 1
                            : 0;
                }
            }
        }

        return next;
    }

    private countNeighbors(
        grid: number[][],
        x: number,
        y: number,
        config: CAConfigValues
    ): number {
        const {
            edgeBehavior
        } = config;

        const dirs = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],          [0, 1],
            [1, -1],  [1, 0], [1, 1],
        ];

        const size = grid.length;
        let count = 0;

        for (const [dx, dy] of dirs) {
            let nx = x + dx;
            let ny = y + dy;

            if (edgeBehavior === "alive") {
                nx = (nx + size) % size;
                ny = (ny + size) % size;
                count += grid[ny][nx];
            } else {
                if (nx >= 0 && ny >= 0 && nx < size && ny < size) {
                    count += grid[ny][nx];
                }
            }
        }

        return count;
    }

    private removeSmallClusters(grid: number[][], minSize: number) {
        const size = grid.length;
        const visited = Array.from({ length: size }, () => Array(size).fill(false));

        const dirs = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];

        const floodFill = (x: number, y: number, cells: [number, number][]) => {
            const stack: [number, number][] = [[x, y]];

            while (stack.length) {
                const [cx, cy] = stack.pop()!;
                if (
                    cx < 0 || cy < 0 || cx >= size || cy >= size ||
                    visited[cy][cx] || grid[cy][cx] === 0
                ) continue;

                visited[cy][cx] = true;
                cells.push([cx, cy]);

                for (const [dx, dy] of dirs) {
                    stack.push([cx + dx, cy + dy]);
                }
            }
        };

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (!visited[y][x] && grid[y][x] === 1) {
                    const cells: [number, number][] = [];
                    floodFill(x, y, cells);

                    if (cells.length < minSize) {
                        for (const [cx, cy] of cells) {
                            grid[cy][cx] = 0;
                        }
                    }
                }
            }
        }
    }
}