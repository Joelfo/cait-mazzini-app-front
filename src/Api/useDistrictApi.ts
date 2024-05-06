import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { API_URL } from "util/requests"
import { ResourceAPI } from "./Base/ResourceAPI"
import { District } from "Api/Types/District"
import { useResourceAPI } from "./Base/useResourceAPI"

export class DistrictAPI extends ResourceAPI<District> {
    public constructor() {
        super('Districts');
    }

    public useAllByCity = (cityId: number | undefined) => useQuery<District[]>(
        ['districts.allByCity', cityId],
        async () => {
            const response = await axios.get(
                `${API_URL}/Cities/${cityId}/Districts`,
            )
            return response.data;
        },
        {
            enabled: !!cityId
        }
    );
}

export const useDistrictApi = () => {
    const { headers, ...resourceApi } = useResourceAPI<District>('Districts');
    
    const useAllByCity = (cityId: number | undefined) => useQuery<District[]>(
        ['districts.allByCity', cityId],
        async () => {
            const response = await axios.get(
                `${API_URL}/Cities/${cityId}/Districts`,
                {headers}
            )
            return response.data;
        },
        {
            enabled: !!cityId
        }
    );

    return { ...resourceApi, useAllByCity }
}