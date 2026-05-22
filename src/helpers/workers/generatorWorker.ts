import seedrandom from "seedrandom";
import { CA2DGridGenerator } from "../../engine/generators/CA/CN2DGridGenerator";
import { DLA2DGridGenerator } from "../../engine/generators/DLA/DLA2DGridGenerator";
import { PN2DGridGenerator } from "../../engine/generators/PN/PN2DGridGenerator";
import { VD2DGridGenerator } from "../../engine/generators/VD/VD2DGridGenerator";
import type { GeneratorWorkerData } from "../types/GeneratorWorkerData";
import type { DLAConfigValues } from "../configs/DLAConfig";
import type { CAConfigValues } from "../configs/CAConfig";
import type { PNConfigValues } from "../configs/PNConfig";
import type { VDConfigValues } from "../configs/VDConfig";
import type { IGridGenerator } from "../../engine/generators/IGridGenerator";
import { CA3DGridGenerator } from "../../engine/generators/CA/CN3DGridGenerator";
import { DLA3DGridGenerator } from "../../engine/generators/DLA/DLA3DGridGenerator";

self.onmessage = (e : MessageEvent<GeneratorWorkerData>) => {
  const { type, config } = e.data;

  let generator : IGridGenerator<any,any>;
  let trueConfig;

  switch (type) {
    case "DLA2D":
        generator = new DLA2DGridGenerator();
        trueConfig = config as DLAConfigValues;
        break;
    case "CA2D":
        generator = new CA2DGridGenerator();
        trueConfig = config as CAConfigValues;
        break;
    case "PN2D":
        generator = new PN2DGridGenerator();
        trueConfig = config as PNConfigValues;
        break;
    case "VD2D":
        generator = new VD2DGridGenerator();
        trueConfig = config as VDConfigValues;
        break
    case "CA3D":
        generator = new CA3DGridGenerator();
        trueConfig = config as CAConfigValues;
        break
    case "DLA3D":
        generator = new DLA3DGridGenerator();
        trueConfig = config as DLAConfigValues;
  }

  if(generator && trueConfig){
        const rng = seedrandom(config.seed)
        const grid = generator.generate(trueConfig,rng);
        self.postMessage({ grid });
  }else
    self.postMessage({})

};