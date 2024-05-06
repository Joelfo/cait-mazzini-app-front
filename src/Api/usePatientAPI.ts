import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Patient } from "Api/Types/Patient";
import { API_URL } from "util/requests";
import { useResourceAPI } from "./Base/useResourceAPI";
import { PatientBasicInfo } from "Api/Types/BasicInfo/PatientBasicInfo";
import { ClinicalHistory } from "Api/Types/ClinicalHistory";
import { LifeHabitsInfoDTO } from "Api/Types/LifeHabitsInfoDTO";
import { PatientRelationshipsInfo } from "Api/Types/BasicInfo/PatientRelationshipsInfo";
import { LifeHabitsInfo } from "Api/Types/LifeHabitsInfo";

export const usePatientApi = () => {
    const { headers, resourceUrl, ...resourceApi  } = useResourceAPI<Patient>('Patients');
    
    const useShowPatient = (resourceId: number | undefined) => {
        console.log(['Patient' + '.Show', resourceId]);
        return useQuery<Patient>(
            ['Patient' + '.Show', resourceId],
            async () => {
                const response = await axios.get(
                    API_URL + '/Patients' + "/" + resourceId,
                    {
                        headers
                    }
                );
                return response.data;
            },
            {
                enabled: !!resourceId,
                
            }
        );
    };

    const useShowBasicInfo = (id: string) => useQuery(
        ['Patients.ShowBasicInfo', id],
        async () => {
            const response = await axios.get<PatientBasicInfo>(
                `${resourceUrl}/${id}/BasicInfo`,
                {headers}
            );
            return response.data;
        }
    )

    const useAllByName = (name: string | undefined) => useQuery(
        ['Patients.AllByName', name],
        async () => {
            const response = await axios.get<Patient[]>(
                resourceUrl + '/ByName',
                {
                    params: {
                        name: name
                    },
                    headers
                }
            );
            return response.data;
        }, 
        {
            enabled: !!name
        }
    );

    const useClincalHistory = (patientId?: number) => useQuery(
        ['Patients.ClinicalHistory', patientId],
        async () => {
            const response = await axios.get<ClinicalHistory>(
                resourceUrl + `/${patientId}/ClinicalHistory`,
                {
                    params: {
                        patientId: patientId
                    },
                    headers
                }
            );
            return response.data;
        },
        {
            enabled: !!patientId
        }
    );

    const useLifeHabitsInfo = (patientId?: number) => useQuery(
        ['Patients.LifeHabitsInfo', patientId],
        async () => {
            const response = await axios.get<LifeHabitsInfo>(
                resourceUrl + `/${patientId}/LifeHabitsInfo`,
                {
                    params: {
                        patientId: patientId
                    },
                    headers
                }
            );
            return response.data
        }, {
            enabled: !!patientId
        }
    );

    const useShowRelationshipsInfo = (patientId: number | undefined) => useQuery(
        ['Patients.Relationships', patientId],
        async () => {
            const response = await axios.get<PatientRelationshipsInfo>(
                `${resourceUrl}/${patientId}/Relationships`,
                {
                    headers
                }
            );
            return response.data;
        }, {
            enabled: !!patientId
        }
    );

    return { ...resourceApi, useShowPatient, useShowBasicInfo, useLifeHabitsInfo, useClincalHistory, useAllByName, useShowRelationshipsInfo }

}