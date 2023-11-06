import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { VitalSignsMeasurement } from 'types/Api/DTOs/VitalSignsMeasurement'
import { API_URL } from "util/requests"
import { getApiAuthHeaders } from "./Util/ApiAuthHeaders"
import { LaravelPage } from "types/vendor/LaravelPage/LaravelPage"
import { ResourceAPI } from "./Base/ResourceAPI"

export class VitalSignsMeasurementAPI extends ResourceAPI<VitalSignsMeasurement> {
    public constructor() {
        super('VitalSignsMeasurements');
    }

    public useAllByPatient = (patientId: number | undefined) => useQuery<VitalSignsMeasurement[]>(
        ['VitalSignsMeasurement.AllByPatient', patientId],
        async () => {
            const response = await axios.get(
                `${API_URL}/Patients/${patientId}/VitalSignsMeasurements`
            );
            return response.data;
        },
        {
            enabled: !!patientId
        }
    );
}