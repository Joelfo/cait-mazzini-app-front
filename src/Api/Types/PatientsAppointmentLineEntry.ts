import { PatientBasicInfo } from "./BasicInfo/PatientBasicInfo"

export type PatientsAppointmentLineEntry = {
    patient: PatientBasicInfo;
    order: number;
}