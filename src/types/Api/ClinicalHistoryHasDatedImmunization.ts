import { DatedImmunization } from "./DTOs/DatedImmunization"

export type ClinicalHistoryHasDatedImmunization = {
    datedImmunization: DatedImmunization,
    lastDoseDate: string
}