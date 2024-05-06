import { PhysicalExam } from "Api/Types/PhysicalExam";
import { ResourceAPI } from "./Base/ResourceAPI";
import { useResourceAPI } from "./Base/useResourceAPI";

import axios from "axios";
import { API_URL } from "util/requests";
import { useQuery } from "@tanstack/react-query";

export const usePhysicalExamApi = () => {
    const { headers, resourceUrl, ...resourceApi } = useResourceAPI<PhysicalExam>('PhysicalExams');
    
    const useAllByPatient = (patientId: number | undefined) => {
        return useQuery<PhysicalExam[]>(
        ['PhysicalExams.AllByPatient'],
        async () => {
            const response = await axios.get<PhysicalExam[]>(API_URL + `/Patients/${patientId}/PhysicalExams`, {
                headers
            });
            return response.data;
        },
        {
            enabled: !!patientId
        }
    );};
    
    return { ...resourceApi, useAllByPatient };
}