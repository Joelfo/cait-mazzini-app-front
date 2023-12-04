import { HealthUnity } from "types/Api/HealthUnity";
import { ResourceAPI } from "./Base/ResourceAPI";

export class HealthUnityAPI extends ResourceAPI<HealthUnity> {
    public constructor() {
        super('HealthUnities');
    }
}