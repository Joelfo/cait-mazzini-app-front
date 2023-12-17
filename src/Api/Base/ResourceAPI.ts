import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "util/requests";

export class ResourceAPI<TResource, TDto = TResource> {
    protected resourceName: string;
    protected resourceRoute: string;

    public constructor (resourceName : string) {
        this.resourceName = resourceName;
        this.resourceRoute = `${API_URL}/${this.resourceName}`
    }

    public useAll = () => useQuery<TResource[]>(
        [this.resourceName, '.All'],
        async () => {
            const response = await axios.get(
                this.resourceRoute
            )
            return response.data
        }
    );

    public useAllPaginated = (skip: number, take: number) => useQuery<TResource[]>(
        [this.resourceName + '.AllPaginated' + skip],
        async () => {
            const response = await axios.get(
                this.resourceRoute,
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

    public useShow = (resourceId: number | undefined) => {
        console.log([this.resourceName + '.Show', resourceId]);
        return useQuery<TResource>(
            [this.resourceName + '.Show', resourceId],
            async () => {
                const response = await axios.get(
                    this.resourceRoute + "/" + resourceId
                );
                return response.data;
            },
            {
                enabled: !!resourceId,
                
            }
        );
    };

    public useCreate = () => useMutation({
        mutationFn: async (resource: TDto) => {
            const response = await axios.post<number>(
                this.resourceRoute,
                resource
            );
            return response.data;
        },
        retry: 999999,
    });

    public useUpdate = () => useMutation({
        mutationFn: async ({id, resource} : { id:number, resource: TDto }) => {
            const response = await axios.put(
                `${this.resourceRoute}/${id}`,
                {
                    ...resource
                }
            )
            return response.data;
        },
        retry: 99999,
    });

    public useDelete = () => useMutation({
        mutationFn: async ({ id } : { id: number }) => {
            console.log(id);
            const response = await axios.delete(`${this.resourceRoute}/${id}`);
            return response.data;
        }
    })
}