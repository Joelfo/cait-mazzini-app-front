import { ClinicalHistory } from "types/Api/ClinicalHistory";
import { ResourceAPI } from "./Base/ResourceAPI";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Immunization } from "types/Api/Immunization";
import { ClinicalHistoryHasDatedImmunization } from "types/Api/ClinicalHistoryHasDatedImmunization";
import { Desease } from "types/Api/Desease";

export class ClinicalHistoryAPi extends ResourceAPI<ClinicalHistory>{
    constructor(){
        super('ClinicalHistories');
    }

    public useImmunizations = (clinicalHistoryId?: number) => useQuery(
        ['ClincalHistories.Immunizations', clinicalHistoryId],
        async () => {
            const response = await axios.get<Immunization[]>(
                `${this.resourceRoute}/${clinicalHistoryId}/Immunizations`
            );
            return response.data;
        }, {
            enabled: !!clinicalHistoryId
        }
    );

    public useDatedImmunizations = (clinicalHistoryId?: number) => useQuery(
        ['ClinicalHistories.DatedImmunizations', clinicalHistoryId],
        async () => {
            const response = await axios.get<ClinicalHistoryHasDatedImmunization[]>(
                `${this.resourceRoute}/${clinicalHistoryId}/DatedImmunizations`
            );
            return response.data;
        }, {
            enabled: !!clinicalHistoryId
        }
    );

    public usePreviousDeseases = (clinicalHistoryId?: number) => useQuery(
        ['ClinicalHistories.PreviousDeseases', clinicalHistoryId],
        async () => {
            const response = await axios.get<Desease[]>(
                `${this.resourceRoute}/${clinicalHistoryId}/PreviousDeseases`
            );
            return response.data;
        }, {
            enabled: !!clinicalHistoryId
        }
    )
}