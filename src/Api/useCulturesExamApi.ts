import { CulturesExam } from "Api/Types/Exams/CulturesExam";
import { ComplementaryExamAPI } from "./Base/ComplementaryExamAPI";
import { useComplementaryExamApi } from "./Base/useComplementaryExamApi";

export class CulturesExamAPI extends ComplementaryExamAPI<CulturesExam> {
    constructor(){
        super("CulturesExams");
    }
}

export const useCulturesExamApi = () => useComplementaryExamApi<CulturesExam>('CulturesExams');