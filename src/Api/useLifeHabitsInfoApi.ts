import { LifeHabitsInfoDTO } from "Api/Types/LifeHabitsInfoDTO";
import { ResourceAPI } from "./Base/ResourceAPI";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LifeHabitsInfo } from "Api/Types/LifeHabitsInfo";
import { PhysicalActivity } from "Api/Types/PhysicalActivity";
import { useResourceAPI } from "./Base/useResourceAPI";
import { ContraceptiveMethod } from "Api/Types/ContraceptiveMethod";

export class LifeHabitsInfoAPI extends ResourceAPI<LifeHabitsInfo, LifeHabitsInfoDTO> {
    constructor(){
        super('LifeHabitsInfo');
    }

    public usePhysicalActivities = (lifeHabitsInfoId?: number) => useQuery(
        ['LifeHabitsInfo.PhysicalActivities'],
        async () => {
            const response = await axios.get<PhysicalActivity[]>(
                this.resourceRoute + `/${lifeHabitsInfoId}/PhysicalActivities`,
            );
            return response.data;
        }, {
            enabled: !!lifeHabitsInfoId
        }
    ) 
}

export const useLifeHabitsInfoApi = () => {
    const {headers, ...resourceApi} = useResourceAPI<LifeHabitsInfo, LifeHabitsInfoDTO>('LifeHabitsInfo');

    const usePhysicalActivities = (lifeHabitsInfoId?: number) => useQuery<PhysicalActivity[]>(
        ['LifeHabitsInfo.PhysicalActivitiess'],
        async () => {
            const response = await axios.get<PhysicalActivity[]>(
                resourceApi.resourceUrl + `/${lifeHabitsInfoId}/PhysicalActivities`,
                {
                    headers
                }
            );
            return response.data;
        }, {
            enabled: !!lifeHabitsInfoId
        }
    );

    const useContraceptiveMethods = (lifeHabitsInfoId?: number) => useQuery<ContraceptiveMethod[]>(
        ['LifeHabitsInfo.ContraceptiveMethods'],
        async () => {
            const response = await axios.get<ContraceptiveMethod[]>(
                resourceApi.resourceUrl + `/${lifeHabitsInfoId}/ContraceptiveMethods`,
                {
                    headers
                }
            );
            return response.data;
        }, {
            enabled: !!lifeHabitsInfoId
        }
    )
    return { ...resourceApi, usePhysicalActivities, useContraceptiveMethods }
}