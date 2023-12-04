import { useQuery } from "@tanstack/react-query";
import { ResourceAPI } from "./ResourceAPI";
import axios from "axios";

export abstract class ComplementaryExamAPI<TComplementaryExam> extends ResourceAPI<TComplementaryExam> {

    public useAllByPatient = (patientId: number | undefined) => useQuery(
        [this.resourceName + '.getAllByPatient', patientId],
        async () => {
            const response = await axios.get<TComplementaryExam[]>(
                this.resourceRoute + '/ByPatient/' + patientId
            );
            return response.data;
        }, {
            enabled: !!patientId
        }
    )

} 