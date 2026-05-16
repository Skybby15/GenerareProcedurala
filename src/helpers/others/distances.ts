// =========================
// EUCLIDEAN
// =========================

import type { DistanceMetric } from "../types/DistanceMetric";

export function euclideanDist2D(
    x1: number,
    y1: number,
    x2: number,
    y2: number
): number {
    const dx = x2 - x1;
    const dy = y2 - y1;

    return Math.sqrt(dx * dx + dy * dy);
}

export function euclideanDist3D(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// =========================
// MANHATTAN
// =========================

export function manhattanDist2D(
    x1: number,
    y1: number,
    x2: number,
    y2: number
): number {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

export function manhattanDist3D(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
): number {
    return (
        Math.abs(x2 - x1) +
        Math.abs(y2 - y1) +
        Math.abs(z2 - z1)
    );
}

// =========================
// CHEBYSHEV
// =========================

export function chebyshevDist2D(
    x1: number,
    y1: number,
    x2: number,
    y2: number
): number {
    return Math.max(
        Math.abs(x2 - x1),
        Math.abs(y2 - y1)
    );
}

export function chebyshevDist3D(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
): number {
    return Math.max(
        Math.abs(x2 - x1),
        Math.abs(y2 - y1),
        Math.abs(z2 - z1)
    );
}

// =========================
// MINKOWSKI
// =========================

export function minkowskiDist2D(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    p: number
): number {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);

    return Math.pow(
        Math.pow(dx, p) + Math.pow(dy, p),
        1 / p
    );
}

export function minkowskiDist3D(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
    p: number
): number {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const dz = Math.abs(z2 - z1);

    return Math.pow(
        Math.pow(dx, p) +
        Math.pow(dy, p) +
        Math.pow(dz, p),
        1 / p
    );
}

export function getDistanceFunction(
    metric: DistanceMetric,
    p: number = 2
): (x1: number, y1: number, x2: number, y2: number) => number {
    const map: Record<DistanceMetric, (x1:number,y1:number,x2:number,y2:number) => number> = {
        euclidean: euclideanDist2D,
        manhattan: manhattanDist2D,
        chebyshev: chebyshevDist2D,
        minkowski: (x1, y1, x2, y2) =>
            minkowskiDist2D(x1, y1, x2, y2, p),
    };

    return map[metric];
}