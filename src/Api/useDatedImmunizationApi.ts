import { DatedImmunization } from "types/Api/DatedImmunization";
import { ResourceAPI } from "./Base/ResourceAPI";
import { useResourceAPI } from "./Base/useResourceAPI";

export class DatedImmunizationAPI extends ResourceAPI<DatedImmunization> {
    public constructor(){
        super('DatedImmunizations')
    }
}

export const useDatedImmunizationApi = () => useResourceAPI<DatedImmunization>('DatedImmunizations');