import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react"
import { API_URL } from "util/requests"

export const useResourceAPI = <TResource, TDto = TResource>(resourceName: string) => {
    const resourceUrl = useMemo(() => `${API_URL}/${resourceName}`, [API_URL, resourceName]);

    const useAll = () => useQuery<TResource[]>(
        [resourceName, '.All'],
        async () => {
            const response = await axios.get(
                resourceUrl
            )
            return response.data
        }
    );

    const useAllPaginated = (skip: number, take: number) => useQuery<TResource[]>(
        [resourceName + '.AllPaginated' + skip],
        async () => {
            const response = await axios.get(
                resourceUrl,
                {
                    params: {
                        skip: skip,
                        take: take
                    }
                }
            );
            return response.data;
        }
    );

    const useShow = (resourceId: number | undefined) => {
        console.log([resourceName + '.Show', resourceId]);
        return useQuery<TResource>(
            [resourceName + '.Show', resourceId],
            async () => {
                const response = await axios.get(
                    resourceUrl + "/" + resourceId
                );
                return response.data;
            },
            {
                enabled: !!resourceId,
                
            }
        );
    };

    const useCreate = () => useMutation({
        mutationFn: async (resource: TDto) => {
            const response = await axios.post<number>(
                resourceUrl,
                resource
            );
            return response.data;
        },
        retry: 999999,
    });

    const useUpdate = () => useMutation({
        mutationFn: async ({id, resource} : { id:number, resource: TDto }) => {
            const response = await axios.put(
                `${resourceUrl}/${id}`,
                {
                    ...resource
                }
            )
            return response.data;
        },
        retry: 99999,
    });

    const useDelete = () => useMutation({
        mutationFn: async ({ id } : { id: number }) => {
            console.log(id);
            const response = await axios.delete(`${resourceUrl}/${id}`);
            return response.data;
        }
    })

    return {
        useAll,
        useShow,
        useCreate,
        useUpdate,
        useDelete
    }
}