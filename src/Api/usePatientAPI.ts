import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Patient } from "types/Api/DTOs/Patient";
import { API_URL } from "util/requests";

export const useShowPatient = (resourceId: number | undefined) => {
    console.log(['Patient' + '.Show', resourceId]);
    return useQuery<Patient>(
        ['Patient' + '.Show', resourceId],
        async () => {
            const response = await axios.get(
                API_URL + '/Patients' + "/" + resourceId
            );
            return response.data;
        },
        {
            enabled: !!resourceId,
            
        }
    );
}