import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "Stores/useAuthStore";
import axios from "axios";
import { API_URL } from "util/requests";

export const useExamFileApi = () => {
    const jwt = useAuthStore(state => state.bearerJwt);
    
    const useUpload = () => useMutation({
        mutationFn: async (params : {examId: number, file: File }) => {
            const formData = new FormData();
            formData.append("file", params.file);

            const response = await axios.post(
                `${API_URL}/Exams/${params.examId}/File`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: jwt
                    }
                }
            );

            return response.data;
        }
    });

    const useDownload = () => useMutation({
        mutationFn: async ({ examId, fileId } : { examId : number, fileId: number }) => {
            const response = await axios.get<Blob>(`${API_URL}/Exams/${examId}/Files/${fileId}`, {
                responseType: 'blob',
                headers: {
                    Authorization: jwt
                }
            });
            return response.data
        }
    })

    return {
        useDownload,
        useUpload
    }
}