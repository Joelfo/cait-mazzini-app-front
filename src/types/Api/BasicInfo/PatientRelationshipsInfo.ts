import { PatientBasicInfo } from "./PatientBasicInfo";

export type PatientRelationshipsInfo = PatientBasicInfo & {
    hasClinicalHistory: boolean,
    hasLifeHabitsInfo: boolean,
    hasScannedChart: boolean
}