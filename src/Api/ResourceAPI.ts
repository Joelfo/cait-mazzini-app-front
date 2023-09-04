import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "util/requests";

export class ResourceAPI<TResource> {
    protected resourceName: string;
    protected resourceRoute: string;

    public constructor (resourceName : string) {
        this.resourceName = resourceName;
        this.resourceRoute = `${API_URL}/${this.resourceName}`
    }

    public useAll = () => useQuery<TResource[]>(
        [this.resourceName + 'all'],
        async () => {
            const response = await axios.get(
                this.resourceRoute
            )
            return response.data
        }
    )

    public useShow = (resourceId: number | undefined) => useQuery<TResource>(
        [this.resourceName + 'all', resourceId],
        async () => {
            const response = await axios.get(
                this.resourceRoute + "/" + resourceId
            );
            return response.data;
        },
        {
            enabled: !!resourceId
        }
    )

    public useCreate = () => useMutation({
        mutationFn: async (resource: TResource) => {
            const response = await axios.post(
                this.resourceRoute,
                resource
            )
        }
    })
}