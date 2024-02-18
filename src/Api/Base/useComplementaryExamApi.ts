import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useResourceAPI } from "./useResourceAPI";

export const useComplementaryExamApi= <TComplementaryExam, >(routeName: string) => {

    const resourceApi = useResourceAPI(routeName);
    
    const useAllByPatient = (patientId: number | undefined) => useQuery(
        [resourceApi.resourceName + '.getAllByPatient', patientId],
        async () => {
            const response = await axios.get<TComplementaryExam[]>(
                resourceApi.resourceUrl + '/ByPatient/' + patientId
            );
            return response.data;
        }, {
            enabled: !!patientId,
            refetchOnWindowFocus: false
        }
    )

    return { ...resourceApi, useAllByPatient }
}