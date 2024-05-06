import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "Stores/useAuthStore";
import axios from "axios";
import { useMemo } from "react"
import { API_URL } from "util/requests"

export const useResourceAPI = <TResource, TDto = TResource>(resourceName: string) => {
    const resourceUrl = useMemo(() => `${API_URL}/${resourceName}`, [API_URL, resourceName]);

    const jwtToken = useAuthStore(state => state.bearerJwt);

    const headers = useMemo(() => ({
        'Content-Type': 'application/json',
        Authorization: jwtToken
    }), [jwtToken]);

    const useAll = () => useQuery<TResource[]>(
        [resourceName, '.All'],
        async () => {
            const response = await axios.get<TResource[]>(
                resourceUrl,
                {
                    headers
                }
            )
            return response.data
        },{
            refetchOnWindowFocus: false,
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
                    },
                    headers
                },
            );
            return response.data;
        }, {
            refetchOnWindowFocus: false
        }
    );

    const useShow = (resourceId: number | undefined) => {
        console.log([resourceName + '.Show', resourceId]);
        return useQuery<TResource>(
            [resourceName + '.Show', resourceId],
            async () => {
                const response = await axios.get(
                    resourceUrl + "/" + resourceId,
                    {
                        headers
                    }
                );
                return response.data;
            },
            {
                enabled: !!resourceId,
                refetchOnWindowFocus: false,
            }
        );
    };

    const useCreate = () => useMutation({
        mutationFn: async (resource: TDto) => {
            const response = await axios.post<number>(
                resourceUrl,
                resource,
                {
                    headers
                }
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
                },
                {
                    headers
                }
            )
            return response.data;
        },
        retry: 99999,
    });

    const useRemove = () => useMutation({
        mutationFn: async ({ id } : { id: number }) => {
            console.log(id);
            const response = await axios.delete(`${resourceUrl}/${id}`, {
                headers
            });
            return response.data;
        }
    })

    return {
        useAll,
        useAllPaginated,
        useShow,
        useCreate,
        useUpdate,
        useRemove,
        headers,
        resourceName,
        resourceUrl
    }
}