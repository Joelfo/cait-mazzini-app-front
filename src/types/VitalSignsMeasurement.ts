import { LaravelLink } from "./vendor/LaravelLink"

export type VitalSignsMeasurement = {
    id: number,
    paMmhg: string,
    fcBpm: string,
    frIrpm: string,
    oxygenSaturationPercentage: string,
    weightKg: string,
    weightM: string,
    measurementDateTime: string,
    _links: LaravelLink[];
}