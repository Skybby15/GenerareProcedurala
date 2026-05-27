import type { BasicConfigValues } from "../../helpers/types/BasicConfig";

export interface IGridGenerator<TGridData, TConfig extends BasicConfigValues> {
    generate(config: TConfig, rng: () => number): TGridData;
    generateAsync(config: TConfig, rng: () => number): Promise<TGridData>
}