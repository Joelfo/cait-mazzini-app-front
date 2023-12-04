import { Immunization } from "types/Api/Immunization";
import { ResourceAPI } from "./Base/ResourceAPI";


export class ImmunizationAPI extends ResourceAPI<Immunization> {
    constructor(){
        super('Immunizations');
    }
}