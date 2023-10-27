import { LifeHabitsInfo } from "types/Api/LifeHabitsInfo";
import { ResourceAPI } from "./Base/ResourceAPI";

export class LifeHabitsInfoAPI extends ResourceAPI<LifeHabitsInfo> {
    constructor(){
        super('LifeHabitsInfo');
    }
}