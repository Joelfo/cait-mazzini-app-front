import { Country } from "types/Api/Country";
import { ResourceAPI } from "./Base/ResourceAPI";

export class CountryAPI extends ResourceAPI<Country> {
    public constructor() {
        super('Countries');
    }
}