import { PCRExam } from "Api/Types/PCRExam";
import { ComplementaryExamAPI } from "./Base/ComplementaryExamAPI";
import { useComplementaryExamApi } from "./Base/useComplementaryExamApi";

export class PCRExamAPI extends ComplementaryExamAPI<PCRExam> {
    constructor() {
        super("PCRExams");
    }
}

export const usePcrExamApi = () => useComplementaryExamApi('PCRExams');