import type { DLAConfigValues } from "../../../helpers/configs/DLAConfig";
import { NotImplementedError } from "../../../helpers/exceptions/NotImplementedError";
import type { IGridGenerator } from "../IGridGenerator";

export class DLA2DGridGenerator
implements IGridGenerator<boolean[][], DLAConfigValues>
{
    generate(
        config: DLAConfigValues,
        rng: () => number
    ): boolean[][] {
        const {
            gridSize,
            particles,
            steps,
            stickRadius,
            stickProximity,
        } = config;

        const grid: boolean[][] = [];

        for (let y = 0; y < gridSize; y++) {
            grid[y] = [];

            for (let x = 0; x < gridSize; x++) {
                grid[y][x] = false;
            }
        }

        const center = Math.floor(gridSize / 2);

        grid[center][center] = true;

        this.runDLA(
            particles,
            steps,
            gridSize,
            grid,
            stickRadius,
            stickProximity,
            rng
        );

        return grid;
    }

    async generateAsync(): Promise<boolean[][]> {
        throw new NotImplementedError();
    }

    private runDLA(
        particles: number,
        steps: number,
        gridSize: number,
        grid: boolean[][],
        stickRadius: number,
        stickProximity: number,
        rng: () => number
    ) {
        for (let p = 0; p < particles; p++) {
            let { x, y } = this.spawnOnEdge(gridSize, rng);

            x = Math.floor(x);
            y = Math.floor(y);

            for (let s = 0; s < steps; s++) {
                const dir = Math.floor(rng() * 4);

                if (dir === 0) x++;
                if (dir === 1) x--;
                if (dir === 2) y++;
                if (dir === 3) y--;

                x = (x + gridSize) % gridSize;
                y = (y + gridSize) % gridSize;

                if (
                    this.touchesCluster(
                        grid,
                        gridSize,
                        x,
                        y,
                        stickProximity
                    )
                ) {
                    this.fillCircle(
                        grid,
                        gridSize,
                        x,
                        y,
                        stickRadius
                    );

                    break;
                }
            }
        }
    }

    private spawnOnEdge(
        gridSize: number,
        rng: () => number
    ) {
        const side = Math.floor(rng() * 4);

        if (side === 0)
            return { x: 0, y: rng() * gridSize };

        if (side === 1)
            return { x: gridSize - 1, y: rng() * gridSize };

        if (side === 2)
            return { x: rng() * gridSize, y: 0 };

        return { x: rng() * gridSize, y: gridSize - 1 };
    }

    private touchesCluster(
        grid: boolean[][],
        gridSize: number,
        cx: number,
        cy: number,
        proximity: number
    ) {
        const r2 = proximity * proximity;

        for (let y = -proximity; y <= proximity; y++) {
            for (let x = -proximity; x <= proximity; x++) {
                if (x === 0 && y === 0)
                    continue;

                const dist2 = x * x + y * y;

                if (dist2 > r2)
                    continue;

                const nx = (cx + x + gridSize) % gridSize;
                const ny = (cy + y + gridSize) % gridSize;

                if (grid[ny][nx]) {
                    return true;
                }
            }
        }

        return false;
    }

    private fillCircle(
        grid: boolean[][],
        gridSize: number,
        cx: number,
        cy: number,
        radius: number
    ) {
        const r2 = radius * radius;

        for (let y = -radius; y <= radius; y++) {
            for (let x = -radius; x <= radius; x++) {
                const dist2 = x * x + y * y;

                if (dist2 > r2)
                    continue;

                const nx = (cx + x + gridSize) % gridSize;
                const ny = (cy + y + gridSize) % gridSize;

                grid[ny][nx] = true;
            }
        }
    }
}