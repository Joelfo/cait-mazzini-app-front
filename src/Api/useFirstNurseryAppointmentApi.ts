import { FirstNurseryAppointment } from "types/Api/FirstNurseryAppointment";
import { ResourceAPI } from "./Base/ResourceAPI";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "util/requests";
import axios from "axios";
import { useResourceAPI } from "./Base/useResourceAPI";

export class FirstNurseryAppointmentAPI extends ResourceAPI<FirstNurseryAppointment> {
    constructor() {
        super('FirstNurseryAppointments');
    }

    public useGetByPatient = (patientId: number | undefined) => useQuery(
        ['firstNurseryAppointment.getByPatient', [patientId]],
        async () => {
            const response = await axios.get<FirstNurseryAppointment>(API_URL + `/Patients/${patientId}/FirstNurseryAppointment`);
            return response.data;
        },
        {
            enabled: !!patientId
        }
    )
} 

export const useFirstNurseryAppointmentApi = () => {
    const {headers, ...resourceApi} = useResourceAPI<FirstNurseryAppointment>('FirstNurseryAppointments');

    const useGetByPatient = (patientId: number | undefined) => useQuery(
        ['firstNurseryAppointment.getByPatient', [patientId]],
        async () => {
            const response = await axios.get<FirstNurseryAppointment>(API_URL + `/Patients/${patientId}/FirstNurseryAppointment`, {headers});
            return response.data;
        },
        {
            enabled: !!patientId,
        }
    )

    return { ...resourceApi, useGetByPatient }
};