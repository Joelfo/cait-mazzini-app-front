import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { API_URL } from "util/requests"
import { ResourceAPI } from "./ResourceAPI"
import { District } from "types/District"

export class DistrictAPI extends ResourceAPI<District> {
    public constructor() {
        super('District');
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