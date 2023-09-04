import { IdModelDTO } from "./vendor/IdModelDTO";
import { LaravelLink } from "./vendor/LaravelLink"

export type VitalSignsMeasurement = {
    id: number,
    paMmhg: string,
    fcBpm: string,
    frIrpm: string,
    taxCelsius: string,
    oxygenSaturationPercentage: string,
    weightKg: string,
    heightM: string,
    measurementDateTime: string,
    patient: IdModelDTO
    _links: LaravelLink[];
}