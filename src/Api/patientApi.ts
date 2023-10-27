import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios"
import { Patient } from "types/Api/Patient";
import { API_URL } from "util/requests"
import { ResourceAPI } from "./Base/ResourceAPI";

export class PatientAPI extends ResourceAPI<Patient> {
    public constructor(){
        super('Patients');
    }

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
    )
}