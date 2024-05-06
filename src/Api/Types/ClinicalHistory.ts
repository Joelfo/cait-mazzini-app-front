import { ClinicalHistoryHasDatedImmunizationDTO } from "./DTOs/ClinicalHistoryHasDatedImmunizationDTO"

export type ClinicalHistory = {
    id: number,
    previousDeseaseIds: number[],
    otherPreviousDeseases?: string,
    isAlergic: boolean,
    alergyObs?: string,
    hasPreviousSurgery: boolean,
    previousSurgeryObs?: string,
    hasPreviousHospitalizations: boolean,
    previousHospitalizationsObs?: string,
    timeFromLastHospitalization?: string,
    immunizationIds: number[],
    datedImmunizationIds: ClinicalHistoryHasDatedImmunizationDTO[],
    otherImmunizations?: string,
    patientId: number
    previousPulmonarTuberculosis: boolean;
    previousPulmonarTuberculosisDateObs: string;
    previousExtrapulmonarTuberculosis: boolean;
    previousExtrapulmonarTuberculosisDateObs: string;
}