import type { BasicConfigValues } from "./BasicConfig"
import type { GeneratorType } from "./GeneratorTypes"

export type GeneratorWorkerData = {
    type: GeneratorType,
    config: BasicConfigValues
}