import { BiopsyExam } from "types/Api/Exams/BiopsyExam";
import { ComplementaryExamAPI } from "./Base/ComplementaryExamAPI";

export class BiopsyExamAPI extends ComplementaryExamAPI<BiopsyExam> {
    constructor(){
        super("BiopsyExams");
    }
}