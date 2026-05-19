import type { BasicConfigValues } from "../../helpers/types/BasicConfig";

export interface IGridGenerator<TGridData, TConfig extends BasicConfigValues> {
    generate(config: TConfig, rng: () => number): TGridData;
}