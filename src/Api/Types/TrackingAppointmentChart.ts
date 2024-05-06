import { VitalSignsMeasurement } from "./VitalSignsMeasurement";
import { ETrackingAppointmentChartType } from "./enums/ETrackingAppointmentChartType";

export type TrackingAppointmentChart = {
    id: number;
    date: string;
    schema: string;
    evolution: string;
    conduct: string;
    type: ETrackingAppointmentChartType;
    patientId: number;
    creatorId: number;
}