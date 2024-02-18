import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios"
import { Patient } from "types/Api/Patient";
import { API_URL } from "util/requests"
import { ResourceAPI } from "./Base/ResourceAPI";
import { ClinicalHistory } from "types/Api/ClinicalHistory";
import { LifeHabitsInfoDTO } from "types/Api/LifeHabitsInfoDTO";
import { PatientBasicInfo } from "types/Api/BasicInfo/PatientBasicInfo";
import { PatientRelationshipsInfo } from "types/Api/BasicInfo/PatientRelationshipsInfo";

export class PatientAPI extends ResourceAPI<Patient> {
    public constructor(){
        super('Patients');
    }

    public useShowBasicInfo = (id: string) => useQuery(
        ['Patients.ShowBasicInfo', id],
        async () => {
            const response = await axios.get<PatientBasicInfo>(
                `${this.resourceRoute}/${id}/BasicInfo`
            );
            return response.data;
        }
    )

    public useAllByName = (name: string | undefined) => useQuery(
        ['Patients.AllByName', name],
        async () => {
            const response = await axios.get<Patient[]>(
                this.resourceRoute + '/ByName',
                {
                    params: {
                        name: name
                    }
                }
            );
            return response.data;
        }, 
        {
            enabled: !!name
        }
    );

    public useClincalHistory = (patientId?: number) => useQuery(
        ['Patients.ClinicalHistory', patientId],
        async () => {
            const response = await axios.get<ClinicalHistory>(
                this.resourceRoute + `/${patientId}/ClinicalHistory`,
                {
                    params: {
                        patientId: patientId
                    }
                }
            );
            return response.data;
        },
        {
            enabled: !!patientId
        }
    );

    public useLifeHabitsInfo = (patientId?: number) => useQuery(
        ['Patients.LifeHabitsInfo', patientId],
        async () => {
            const response = await axios.get<LifeHabitsInfoDTO>(
                this.resourceRoute + `/${patientId}/LifeHabitsInfo`,
                {
                    params: {
                        patientId: patientId
                    }
                }
            );
            return response.data
        }, {
            enabled: !!patientId
        }
    );

    public useShowRelationshipsInfo = (patientId: number | undefined) => useQuery(
        ['Patients.Relationships', patientId],
        async () => {
            const response = await axios.get<PatientRelationshipsInfo>(
                `${this.resourceRoute}/${patientId}/Relationships`
            );
            return response.data;
        }, {
            enabled: !!patientId
        }
    );
    
}