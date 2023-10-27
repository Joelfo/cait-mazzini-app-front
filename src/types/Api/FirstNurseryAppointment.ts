import { FirstAppointment } from "./FirstAppointment";

export type FirstNurseryAppointment = FirstAppointment & {
    nurseryDiagnosis: string,
    nurseryConduct?: string
}