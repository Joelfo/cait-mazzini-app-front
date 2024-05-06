import { HealthUnity } from "Api/Types/HealthUnity";
import { ResourceAPI } from "./Base/ResourceAPI";
import { useResourceAPI } from "./Base/useResourceAPI";

export class HealthUnityAPI extends ResourceAPI<HealthUnity> {
    public constructor() {
        super('HealthUnities');
    }
}

export const useHealthUnityApi = () => useResourceAPI<HealthUnity>('HealthUnities');