import { VitalSignsMeasurement } from "./VitalSignsMeasurement";
import { TrackingAppointmentChartType } from "./enums/TrackingAppointmentChartType";
import { LaravelLink } from "./vendor/LaravelLink";

export type TrackingAppointmentChart = {
    id : number;
    date: string;
    schema: string;
    evolution: string;
    econduct: string;
    type: TrackingAppointmentChartType;
    vitalSignsMeasurement: VitalSignsMeasurement;
    _links: LaravelLink[];

}