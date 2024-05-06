import { Immunization } from "Api/Types/Immunization";
import { ResourceAPI } from "./Base/ResourceAPI";
import { useResourceAPI } from "./Base/useResourceAPI";


export class ImmunizationAPI extends ResourceAPI<Immunization> {
    constructor(){
        super('Immunizations');
    }
}

export const useImmunizationApi = () => {
    return useResourceAPI<Immunization>('Immunizations');
}