import { DatedImmunization } from "types/Api/DatedImmunization";
import { ResourceAPI } from "./Base/ResourceAPI";

export class DatedImmunizationAPI extends ResourceAPI<DatedImmunization> {
    public constructor(){
        super('DatedImmunizations')
    }
}