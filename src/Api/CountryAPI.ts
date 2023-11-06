import { Country } from "types/Api/DTOs/Country";
import { ResourceAPI } from "./Base/ResourceAPI";

export class CountryAPI extends ResourceAPI<Country> {
    public constructor() {
        super('Countries');
    }
}