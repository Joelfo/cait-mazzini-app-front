import { VitalSignsMeasurement } from "./VitalSignsMeasurement";
import { TrackingAppointmentChartType } from "./enums/TrackingAppointmentChartType";
import { IdModelDTO } from "./vendor/IdModelDTO";
import { LaravelLink } from "./vendor/LaravelLink";

export type TrackingAppointmentChart = {
    id : number;
    date: string;
    schema: string;
    evolution: string;
    conduct: string;
    type: TrackingAppointmentChartType;
    patient: IdModelDTO;
    _links: LaravelLink[];

}