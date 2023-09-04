import { Country } from "types/Country";
import { ResourceAPI } from "./ResourceAPI";

export class CountryAPI extends ResourceAPI<Country> {
    public constructor() {
        super('Country');
    }
}