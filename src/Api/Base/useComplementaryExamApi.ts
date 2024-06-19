import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useResourceAPI } from "./useResourceAPI";
import { ComplementaryExam } from "Api/Types/Exams/ComplementaryExam";
import { ComplementaryExamDTO } from "Api/Types/DTOs/ComplementaryExamDTO";
import { API_URL } from "util/requests";

export const useComplementaryExamApi= <TComplementaryExam extends ComplementaryExam, >(routeName: string) => {

    const resourceApi = useResourceAPI(routeName);
    
    const useAllByPatient = (patientId: number | undefined) => useQuery(
        [resourceApi.resourceName + '.getAllByPatient', patientId],
        async () => {
            const response = await axios.get<TComplementaryExam[]>(
                resourceApi.resourceUrl + '/ByPatient/' + patientId,
                {
                    headers: resourceApi.headers
                }
            );
            return response.data;
        }, {
            enabled: !!patientId,
            refetchOnWindowFocus: false
        }
    )

    const useCreate = () => useMutation({
        mutationFn: async (data: ComplementaryExamDTO<TComplementaryExam>) => {
            const formData = new FormData();
        
            for (const [key, val] of Object.entries(data))
                if (!!val && !(val instanceof File))
                    formData.append(key, val.toString());

            for (let i = 0; i < data.files.length; i++) {
                const file = data.files[i];
                formData.append('file' + i, file, file.name);
            }

            const response = await axios.post(
                resourceApi.resourceUrl,
                formData,
                {
                    headers: {
                        'Authorization': resourceApi.headers.Authorization
                    }
                }
            )

            return response.data;
        }
    })

    return { ...resourceApi, useCreate, useAllByPatient }
}