import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { LoginDTO } from "Api/Types/DTOs/LoginDTO"
import { User } from "Api/Types/User"
import { API_URL } from "util/requests"

export const useAuthApi = () => {
    const authUrl = API_URL + "/Auth";

    const useLogin = () => useMutation({
        mutationFn: async (params : LoginDTO) => {
            const response = await axios.post<string>(authUrl, params);
            return response.data;
        }
    })

    const useCheckToken = (bearerToken: string | undefined) => {
        return useQuery(
            ['CheckToken', bearerToken], 
            async () => {
                    const response = await axios.get(authUrl + '/CheckToken', 
                    {
                        headers: {
                            Authorization: 'Bearer ' + bearerToken
                        }
                    })
                return response.status;
            }, {
                retry: false
            }
        )
    }

    const useGetUser = (jwt: string | undefined) => useQuery(
        ['Auth.GetUser', jwt],
        async () => {
            const response = await axios.get<User>(authUrl + '/User',
            {
                headers: {
                    Authorization: 'Bearer ' + jwt
                }
            });
            return response.data;
        },
        {
            retry: 1
        }
    );

    return { useLogin, useCheckToken, useGetUser }
}