import { useQuery } from "@tanstack/react-query";
import { ResourceAPI } from "./Base/ResourceAPI";
import { City } from "types/Api/City";
import { useResourceAPI } from "./Base/useResourceAPI";

export class CityAPI extends ResourceAPI<City> {
    public constructor() {
        super('Cities');
    }
}

export const useCityApi = () => {
    return { ...useResourceAPI<City>('Cities') }
}