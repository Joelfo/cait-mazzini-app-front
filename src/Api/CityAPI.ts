import { useQuery } from "@tanstack/react-query";
import { ResourceAPI } from "./ResourceAPI";
import { City } from "types/City";

export class CityAPI extends ResourceAPI<City> {
    public constructor() {
        super('City');
    }
}