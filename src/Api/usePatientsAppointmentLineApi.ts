import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "Stores/useAuthStore";
import { PatientsAppointmentLineEntry } from "./Types/PatientsAppointmentLineEntry";
import axios from "axios";
import { API_URL } from "util/requests";
import { PatientsAppointmentLineEntryDTO } from "./Types/DTOs/PatientsAppointmentLineEntryDTO";

export const usePatientsAppointmentLineApi = () => {
    const jwt = useAuthStore(state => state.jwt);

    const useAddEntry = () => useMutation({
        mutationFn: async (entry: PatientsAppointmentLineEntryDTO) => {
            const response = await axios.post<number>(
                API_URL + '/PatientsAppointmentLine',
                entry,
                {
                    headers: {
                        'Authorization': 'Bearer ' + jwt
                    }
                }
            )
            return response.data;
        }
    });

    const useRemoveEntry = () => useMutation({
        mutationFn: async (patientId: number) => {
            await axios.delete(
                API_URL + '/PatientsAppointmentLine/' + patientId,
                {
                    headers: {
                        'Authorization': 'Bearer ' + jwt
                    }
                }
            );
        }
    });

    const useGetLine = () => useQuery(['PatientsAppointmentLine'], async () => {
        const response = await axios.get<PatientsAppointmentLineEntry[]>(API_URL + '/PatientsAppointmentLine', {
            headers: {
                'Authorization': 'Bearer ' + jwt
            }
        });
        return response.data;
    });

    return { useAddEntry, useRemoveEntry, useGetLine };
};