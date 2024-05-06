import { ETrackingAppointmentChartType } from 'Api/Types/enums/ETrackingAppointmentChartType'

export type TrackingAppointmentChartBasicInfo = {
    id: number,
    date: string,
    type: ETrackingAppointmentChartType
}