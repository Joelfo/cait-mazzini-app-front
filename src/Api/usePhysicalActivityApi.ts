import { PhysicalActivity } from "Api/Types/PhysicalActivity";
import { ResourceAPI } from "./Base/ResourceAPI";
import { useResourceAPI } from "./Base/useResourceAPI";

export class PhysicalActivityAPI extends ResourceAPI<PhysicalActivity> {
    public constructor() {
        super('PhysicalActivities');
    }
}

export const usePhysicalActivityApi = () => useResourceAPI<PhysicalActivity>('PhysicalActivities');