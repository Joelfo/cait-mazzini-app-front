import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { VitalSignsMeasurement } from "types/VitalSignsMeasurement"
import { API_URL } from "util/requests"
import { getApiAuthHeaders } from "./Util/ApiAuthHeaders"
import { LaravelPage } from "types/vendor/LaravelPage/LaravelPage"

export const usePost = () => {
    return useMutation(async (data : VitalSignsMeasurement) => {
        const response = await axios.post(
            API_URL + '/vitalSignsMeasurements',
            data,
           {
                headers: getApiAuthHeaders()
           }
        )
    })
}

export const useAll = () => {
    return useQuery(
        ['VitalSignsMeasurement.useAll'],
        async () => {
            const response = await axios.get<VitalSignsMeasurement[]>(
                '/vitalSignsMeasurements',
                {
                    headers: getApiAuthHeaders()
                }
            )
            return response.data;
        }
    );
}