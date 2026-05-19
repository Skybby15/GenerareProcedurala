import type { DLAConfigValues } from "../../../helpers/configs/DLAConfig";
import type { IGridGenerator } from "../IGridGenerator";


export class DLA2DGridGenerator implements IGridGenerator<boolean[][], DLAConfigValues> {
    generate(config: DLAConfigValues, rng: () => number): boolean[][] {
        const {
            gridSize,

            particles,
            steps,
            
        } = config

        const grid: boolean[][] = []

        for (let y = 0; y < gridSize; y++) {

            grid[y] = []

            for (let x = 0; x < gridSize; x++) {
                grid[y][x] = false
            }
        }

        const center =
            Math.floor(gridSize / 2)

        grid[center][center] = true

        this.runDLA(
            particles,
            steps,
            gridSize,
            grid,
            rng
        )

        return grid
    }

    private runDLA(particles: number, steps: number ,gridSize: number, grid: boolean[][], rng: () => number) { 
        for (let p = 0; p < particles; p++) { 
            let { x, y } = this.spawnOnEdge(gridSize,rng) 
            x = Math.floor(x) 
            y = Math.floor(y) 
            for (let s = 0; s < steps; s++) { // random walk 
                const dir = Math.floor(rng() * 4) 
                if (dir === 0) x++ 
                if (dir === 1) x-- 
                if (dir === 2) y++ 
                if (dir === 3) y-- // clamp 

                x = (x + gridSize) % gridSize
                y = (y + gridSize) % gridSize

                if (
                    grid[y][(x + 1) % gridSize] ||
                    grid[y][(x - 1 + gridSize) % gridSize] ||
                    grid[(y + 1) % gridSize][x] ||
                    grid[(y - 1 + gridSize) % gridSize][x]
                ) {
                    grid[y][x] = true
                    break
                }
            } 
        }
    }

    private spawnOnEdge(gridSize: number, rng: () => number) { 

        const side = Math.floor(rng() * 4) 
        if (side === 0) return { x: 0, y: rng() * gridSize } 
        if (side === 1) return { x: gridSize - 1, y: rng() * gridSize } 
        if (side === 2) return { x: rng() * gridSize, y: 0 } 
        return { x: rng() * gridSize, y: gridSize - 1 } 
    }
}