import { ToraxXRayExam } from "Api/Types/Exams/ToraxXRayExam";
import { ResourceAPI } from "./Base/ResourceAPI";
import { ComplementaryExamAPI } from "./Base/ComplementaryExamAPI";
import { useResourceAPI } from "./Base/useResourceAPI";
import { useComplementaryExamApi } from "./Base/useComplementaryExamApi";

export class ToraxXRayExamAPI extends ComplementaryExamAPI<ToraxXRayExam> {
    constructor(){
        super('ToraxXRayExams');
    }
}

export const useToraxXRayExamApi = () => useComplementaryExamApi('ToraxXRayExams');