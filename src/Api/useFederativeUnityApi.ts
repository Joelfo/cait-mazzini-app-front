import { FederativeUnity } from "types/Api/FederativeUnity";
import { ResourceAPI } from "./Base/ResourceAPI";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "util/requests";
import axios from "axios";
import { useResourceAPI } from "./Base/useResourceAPI";

export class FederativeUnityAPI extends ResourceAPI<FederativeUnity> {
    public constructor() {
        super('FederativeUnities');
    }

    public useAllByCountry = (countryId: number | undefined) => useQuery<FederativeUnity[]>(
        ['FederativeUnity.AllByCountry', countryId],
        async () => {
            const response = await axios.get(
                `${API_URL}/Countries/${countryId}/${this.resourceName}`
            );
            return response.data;
        },
        {
            enabled: !!countryId
        }
    )
}

export const useFederativeUnityApi = () => {
    const { headers, ...resourceApi } = useResourceAPI<FederativeUnity>('FederativeUnities');

    const useAllByCountry = (countryId: number | undefined) => useQuery<FederativeUnity[]>(
        ['FederativeUnity.AllByCountry', countryId],
        async () => {
            const response = await axios.get(
                `${API_URL}/Countries/${countryId}/${resourceApi.resourceName}`,
                {headers}
            );
            return response.data;
        },
        {
            enabled: !!countryId
        }
    );

    return { ...resourceApi, useAllByCountry }
}