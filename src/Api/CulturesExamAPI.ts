import { CulturesExam } from "types/Api/Exams/CulturesExam";
import { ComplementaryExamAPI } from "./Base/ComplementaryExamAPI";

export class CulturesExamAPI extends ComplementaryExamAPI<CulturesExam> {
    constructor(){
        super("CulturesExams");
    }
}