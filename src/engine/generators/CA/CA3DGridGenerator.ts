import type { CAConfigValues } from "../../../helpers/configs/CAConfig";
import type { IGridGenerator } from "../IGridGenerator";

type StepWorkerResult = {
    zStart: number;
    data: Uint8Array;
};

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

        this.carveEmptySphere(grid,config.gridSize,8)

        return grid;
    }

    async generateAsync(
        config: CAConfigValues,
        rng: () => number
    ): Promise<number[][][]> {

        let grid = this.createInitialGridForAsync(config, rng);

        for (let i = 0; i < config.steps; i++) {
            grid = await this.asyncStep(grid, config);
        }

        this.carveEmptySphereForAsync(
            grid,
            config.gridSize,
            8
        );  

        const nestedGrid = this.toNestedGrid(grid, config.gridSize);
        return nestedGrid
    }

    //--


    private createInitialGridForAsync(
        config: CAConfigValues,
        rng: () => number
    ): Uint8Array {

        const {
            gridSize,
            initialGridDensity
        } = config;

        const total = gridSize * gridSize * gridSize;
        const grid = new Uint8Array(total);

        for (let i = 0; i < total; i++) {
            grid[i] =
                rng() * 100 < initialGridDensity
                    ? 1
                    : 0;
        }

        return grid;
    }

    private runStepWorker(
        grid: Uint8Array,
        config: CAConfigValues,
        zStart: number,
        zEnd: number
    ): Promise<StepWorkerResult> {

        return new Promise((resolve, reject) => {

            const worker = new Worker(
                new URL(
                    "../../../helpers/workers/ca3DStepWorker.ts",
                    import.meta.url
                ),
                { type: "module" }
            );

            worker.onmessage = (e: MessageEvent<StepWorkerResult>) => {
                resolve(e.data);
                worker.terminate();
            };

            worker.onerror = (e) => {
                reject(e);
                worker.terminate();
            };

            worker.postMessage({
                grid,
                config,
                zStart,
                zEnd
            });
        });
    }

    private toNestedGrid(
        flat: Uint8Array,
        size: number
    ): number[][][] {

        const grid: number[][][] = [];
        const layer = size * size;

        for (let z = 0; z < size; z++) {
            grid[z] = [];

            for (let y = 0; y < size; y++) {
                grid[z][y] = [];

                for (let x = 0; x < size; x++) {
                    grid[z][y][x] =
                        flat[x + y * size + z * layer];
                }
            }
        }

        return grid;
    }

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

    private async asyncStep(
        grid: Uint8Array,
        config: CAConfigValues
    ): Promise<Uint8Array> {

        const size = config.gridSize;
        const layer = size * size;

        const workerCount = Math.min(
            navigator.hardwareConcurrency ?? 4,
            size
        );

        const sliceSize =
            Math.ceil(size / workerCount);

        const jobs: Promise<StepWorkerResult>[] = [];

        for (let w = 0; w < workerCount; w++) {
            const zStart = w * sliceSize;
            const zEnd = Math.min(zStart + sliceSize, size);

            if (zStart >= zEnd)
                continue;

            jobs.push(
                this.runStepWorker(
                    grid,
                    config,
                    zStart,
                    zEnd
                )
            );
        }

        const chunks =
            await Promise.all(jobs);

        const next =
            new Uint8Array(grid.length);

        for (const chunk of chunks) {
            next.set(
                chunk.data,
                chunk.zStart * layer
            );
        }

        return next;
    }

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

    private carveEmptySphere(
        grid: number[][][],
        gridSize: number,
        radius: number
    ) {
        const center = Math.floor(gridSize / 2);
        const r2 = radius * radius;

        for (let z = 0; z < gridSize; z++) {
            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    const dx = x - center;
                    const dy = y - center;
                    const dz = z - center;

                    if (dx * dx + dy * dy + dz * dz <= r2) {
                        grid[z][y][x] = 0;
                    }
                }
            }
        }
    }

    private carveEmptySphereForAsync(
        grid: Uint8Array,
        gridSize: number,
        radius: number
    ) {
        const center =
            Math.floor(gridSize / 2);

        const r2 =
            radius * radius;

        const layer =
            gridSize * gridSize;

        for (let z = 0; z < gridSize; z++) {
            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {

                    const dx = x - center;
                    const dy = y - center;
                    const dz = z - center;

                    if (dx * dx + dy * dy + dz * dz <= r2) {
                        grid[x + y * gridSize + z * layer] = 0;
                    }
                }
            }
        }
    }
}