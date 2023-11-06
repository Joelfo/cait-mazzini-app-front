import { ContraceptiveMethod } from "types/Api/DTOs/ContraceptiveMethod";
import { ResourceAPI } from "./Base/ResourceAPI"

export class ContraceptiveMethodAPI extends ResourceAPI<ContraceptiveMethod> {
    constructor(){
        super('ContraceptiveMethods');
    }
}