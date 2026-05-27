import type { CAConfigValues } from "../configs/CAConfig";

type WorkerPayload = {
    grid: Uint8Array;
    config: CAConfigValues;
    zStart: number;
    zEnd: number;
};

self.onmessage = (e: MessageEvent<WorkerPayload>) => {
    const {
        grid,
        config,
        zStart,
        zEnd
    } = e.data;

    const {
        gridSize,
        minimumBirthNeighbors,
        maximumBirthNeighbors,
        minimumSurvivalNeighbors,
        maximumSurvivalNeighbors,
        edgeBehavior
    } = config;

    const size = gridSize;
    const layer = size * size;

    const out =
        new Uint8Array((zEnd - zStart) * layer);

    const idx = (
        x: number,
        y: number,
        z: number
    ) => x + y * size + z * layer;

    const localIdx = (
        x: number,
        y: number,
        localZ: number
    ) => x + y * size + localZ * layer;

    for (let z = zStart; z < zEnd; z++) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {

                let neighbors = 0;

                for (let dz = -1; dz <= 1; dz++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {

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

                                neighbors += grid[idx(nx, ny, nz)];
                            } else {
                                if (
                                    nx < 0 || ny < 0 || nz < 0 ||
                                    nx >= size ||
                                    ny >= size ||
                                    nz >= size
                                ) continue;

                                neighbors += grid[idx(nx, ny, nz)];
                            }
                        }
                    }
                }

                const current =
                    grid[idx(x, y, z)];

                let nextValue

                if (current === 1) {
                    nextValue =
                        neighbors >= minimumSurvivalNeighbors &&
                        neighbors <= maximumSurvivalNeighbors
                            ? 1
                            : 0;
                } else {
                    nextValue =
                        neighbors >= minimumBirthNeighbors &&
                        neighbors <= maximumBirthNeighbors
                            ? 1
                            : 0;
                }

                out[localIdx(x, y, z - zStart)] =
                    nextValue;
            }
        }
    }

    self.postMessage({
        zStart,
        data: out
    });
};