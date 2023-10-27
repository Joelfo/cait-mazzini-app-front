import { ClinicalHistoryHasDatedImmunization } from "./ClinicalHistoryHasDatedImmunization"

export type ClinicalHistory = {
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
    datedImmunizationIds: ClinicalHistoryHasDatedImmunization[],
    otherImmunizations?: string,
    patientId: number
}