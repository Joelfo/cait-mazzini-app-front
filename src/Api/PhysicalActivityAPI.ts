import { PhysicalActivity } from "types/Api/PhysicalActivity";
import { ResourceAPI } from "./Base/ResourceAPI";

export class PhysicalActivityAPI extends ResourceAPI<PhysicalActivity> {
    public constructor() {
        super('PhysicalActivities');
    }
}