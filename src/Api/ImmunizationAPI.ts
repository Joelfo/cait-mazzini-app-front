import { Immunization } from "types/Api/DTOs/Immunization";
import { ResourceAPI } from "./Base/ResourceAPI";


export class ImmunizationAPI extends ResourceAPI<Immunization> {
    constructor(){
        super('Immunizations');
    }
}