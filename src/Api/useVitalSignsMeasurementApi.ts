import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { VitalSignsMeasurement } from 'types/Api/VitalSignsMeasurement'
import { API_URL } from "util/requests"
import { getApiAuthHeaders } from "./Util/ApiAuthHeaders"
import { LaravelPage } from "types/vendor/LaravelPage/LaravelPage"
import { ResourceAPI } from "./Base/ResourceAPI"
import { useResourceAPI } from "./Base/useResourceAPI"

export const useVitalSignsMeasurementApi = () => {
    const { headers, ...resourceAPI } = useResourceAPI('VitalSignsMeasurements');

    const useAllByPatient = (patientId: number | undefined) => useQuery<VitalSignsMeasurement[]>(
        ['VitalSignsMeasurement.AllByPatient', patientId],
        async () => {
            const response = await axios.get(
                `${API_URL}/Patients/${patientId}/VitalSignsMeasurements`,
                {headers}
            );
            return response.data;
        },
        {
            enabled: !!patientId
        }
    );

    return { ...resourceAPI, useAllByPatient }


}