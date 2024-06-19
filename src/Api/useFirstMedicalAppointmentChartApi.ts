import axios from "axios";
import { useResourceAPI } from "./Base/useResourceAPI"
import { FirstMedicalAppointmentChart } from "./Types/FirstMedicalAppointmentChart";
import { useQuery } from "@tanstack/react-query";
import { FirstNurseryAppointmentChart } from "./Types/FirstNurseryAppointmentChart";
import { API_URL } from "util/requests";

export const useFirstMedicalAppointmentChartApi = () => {

    const { headers, ...resourceApi } = useResourceAPI<FirstMedicalAppointmentChart>('FirstMedicalAppointmentCharts');

    const useGetByPatient = (patientId: number | undefined) => useQuery(
        ['firstMedicalAppointment.getByPatient', [patientId]],
        async () => {
            const response = await axios.get<FirstMedicalAppointmentChart>(API_URL + `/Patients/${patientId}/FirstMedicalAppointmentChart`, {headers});
            return response.data;
        },
        {
            enabled: !!patientId,
        }
    )
    
    return { useGetByPatient, ...resourceApi }
}