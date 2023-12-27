import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react"
import { useResourceAPI } from "./useResourceAPI";

export const  useSubResourceAPI = <TSubResource, >(resourceName: string, subResourceName: string) => {
    const getSubResourceRoute = useCallback((resourceId: number) => `${resourceName}/${resourceId}/${subResourceName}`, []);

    const useCreate = () => useMutation({
        mutationFn: async ({ resourceId, data } : { resourceId: number, data: TSubResource }) => {
            const response = await axios.post(
                getSubResourceRoute(resourceId),
                data
            );
            return response.data;
        }
    });

    const useShow = (resourceId: number) => useQuery(
        [resourceName, subResourceName, 'show'],
        async () => {
            const response = await axios.get<TSubResource>(getSubResourceRoute(resourceId));
            return response.data;
        }
    );
    
    const resourceApi = useResourceAPI<TSubResource>(resourceName);

    return {
        ...resourceApi,
        useShow,
        useCreate
    }
}