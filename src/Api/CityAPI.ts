import { useQuery } from "@tanstack/react-query";
import { ResourceAPI } from "./Base/ResourceAPI";
import { City } from "types/Api/DTOs/City";

export class CityAPI extends ResourceAPI<City> {
    public constructor() {
        super('Cities');
    }
}