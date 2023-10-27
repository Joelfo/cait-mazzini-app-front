import { ClinicalHistory } from "types/Api/ClinicalHistory";
import { ResourceAPI } from "./Base/ResourceAPI";

export class ClinicalHistoryAPi extends ResourceAPI<ClinicalHistory>{
    constructor(){
        super('ClinicalHistories');
    }
}