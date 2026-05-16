export interface IGridGenerator<TGridData, TConfig> {
    generate(config: TConfig): TGridData;
}