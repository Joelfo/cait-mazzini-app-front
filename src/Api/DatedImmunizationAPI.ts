import { DatedImmunization } from "types/Api/DTOs/DatedImmunization";
import { ResourceAPI } from "./Base/ResourceAPI";

export class DatedImmunizationAPI extends ResourceAPI<DatedImmunization> {
    public constructor(){
        super('DatedImmunizations')
    }
}