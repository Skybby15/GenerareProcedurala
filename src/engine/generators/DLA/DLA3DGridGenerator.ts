import type { DLAConfigValues } from "../../../helpers/configs/DLAConfig";
import type { IGridGenerator } from "../IGridGenerator";

export class DLA3DGridGenerator
implements IGridGenerator<boolean[][][], DLAConfigValues>
{
    generate(
        config: DLAConfigValues,
        rng: () => number
    ): boolean[][][] {

        const {
            gridSize,
            particles,
            steps,
            stickRadius,
            stickProximity,
        } = config;

        const grid: boolean[][][] = [];

        for (let z = 0; z < gridSize; z++) {
            grid[z] = [];

            for (let y = 0; y < gridSize; y++) {
                grid[z][y] = [];

                for (let x = 0; x < gridSize; x++) {
                    grid[z][y][x] = false;
                }
            }
        }

        const center = Math.floor(gridSize / 2);

        grid[center][center][center] = true;

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

    private runDLA(
        particles: number,
        steps: number,
        gridSize: number,
        grid: boolean[][][],
        stickRadius: number,
        stickProximity: number,
        rng: () => number
    ) {
        for (let p = 0; p < particles; p++) {
            let { x, y, z } = this.spawnOnSurface(gridSize, rng);

            x = Math.floor(x);
            y = Math.floor(y);
            z = Math.floor(z);

            for (let s = 0; s < steps; s++) {
                const dir = Math.floor(rng() * 6);

                if (dir === 0) x++;
                if (dir === 1) x--;
                if (dir === 2) y++;
                if (dir === 3) y--;
                if (dir === 4) z++;
                if (dir === 5) z--;

                x = (x + gridSize) % gridSize;
                y = (y + gridSize) % gridSize;
                z = (z + gridSize) % gridSize;

                if (this.touchesCluster(
                    grid,
                    gridSize,
                    x,
                    y,
                    z,
                    stickProximity
                )) {
                    this.fillSphere(
                        grid,
                        gridSize,
                        x,
                        y,
                        z,
                        stickRadius
                    );

                    break;
                }
            }
        }
    }

    private spawnOnSurface(
        gridSize: number,
        rng: () => number
    ) {
        const side = Math.floor(rng() * 6);

        if (side === 0)
            return { x: 0, y: rng() * gridSize, z: rng() * gridSize };

        if (side === 1)
            return { x: gridSize - 1, y: rng() * gridSize, z: rng() * gridSize };

        if (side === 2)
            return { x: rng() * gridSize, y: 0, z: rng() * gridSize };

        if (side === 3)
            return { x: rng() * gridSize, y: gridSize - 1, z: rng() * gridSize };

        if (side === 4)
            return { x: rng() * gridSize, y: rng() * gridSize, z: 0 };

        return { x: rng() * gridSize, y: rng() * gridSize, z: gridSize - 1 };
    }

    private touchesCluster(
        grid: boolean[][][],
        gridSize: number,
        cx: number,
        cy: number,
        cz: number,
        radius: number
    ) {
        const r2 = radius * radius;

        for (let z = -radius; z <= radius; z++) {
            for (let y = -radius; y <= radius; y++) {
                for (let x = -radius; x <= radius; x++) {

                    if (x === 0 && y === 0 && z === 0)
                        continue;

                    const dist2 =
                        x * x +
                        y * y +
                        z * z;

                    if (dist2 > r2)
                        continue;

                    const nx =
                        (cx + x + gridSize) % gridSize;

                    const ny =
                        (cy + y + gridSize) % gridSize;

                    const nz =
                        (cz + z + gridSize) % gridSize;

                    if (grid[nz][ny][nx]) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    private fillSphere(
        grid: boolean[][][],
        gridSize: number,
        cx: number,
        cy: number,
        cz: number,
        radius: number
    ) {
        const r2 = radius * radius;

        for (let z = -radius; z <= radius; z++) {
            for (let y = -radius; y <= radius; y++) {
                for (let x = -radius; x <= radius; x++) {

                    const dist2 =
                        x * x +
                        y * y +
                        z * z;

                    if (dist2 > r2)
                        continue;

                    const nx =
                        (cx + x + gridSize) % gridSize;

                    const ny =
                        (cy + y + gridSize) % gridSize;

                    const nz =
                        (cz + z + gridSize) % gridSize;

                    grid[nz][ny][nx] = true;
                }
            }
        }
    }
}