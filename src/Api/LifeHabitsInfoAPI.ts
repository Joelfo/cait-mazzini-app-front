import { LifeHabitsInfoDTO } from "types/Api/LifeHabitsInfoDTO";
import { ResourceAPI } from "./Base/ResourceAPI";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LifeHabitsInfo } from "types/Api/LifeHabitsInfo";
import { PhysicalActivity } from "types/Api/PhysicalActivity";

export class LifeHabitsInfoAPI extends ResourceAPI<LifeHabitsInfo, LifeHabitsInfoDTO> {
    constructor(){
        super('LifeHabitsInfo');
    }

    public usePhysicalActivities = (lifeHabitsInfoId?: number) => useQuery(
        ['LifeHabitsInfo.PhysicalActivities'],
        async () => {
            const response = await axios.get<PhysicalActivity[]>(
                this.resourceRoute + `/${lifeHabitsInfoId}/PhysicalActivities`
            );
            return response.data;
        }, {
            enabled: !!lifeHabitsInfoId
        }
    ) 
}