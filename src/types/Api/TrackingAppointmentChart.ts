import { VitalSignsMeasurement } from "./VitalSignsMeasurement";
import { TrackingAppointmentChartType } from "../enums/ETrackingAppointmentChartType";

export type TrackingAppointmentChart = {
    id: number;
    date: string;
    schema: string;
    evolution: string;
    conduct: string;
    type: TrackingAppointmentChartType;
    patientId: number;
}