import { ETrackingAppointmentChartType } from "Api/Types/enums/ETrackingAppointmentChartType"

export type PhysicalExam = {
    id: number,
    generalAspect: string,
    hygieneConditionsObs?: string,
    headObs?: string,
    neckObs?: string,
    chestObs?: string,
    abdomenObs?: string,
    mmssMmiiObs?: string,
    urinaryTrackObs?: string,
    skinAndMucousObs?: string,
    patientId: number,
    type: ETrackingAppointmentChartType,
    date: string,
    creatorId: number
}