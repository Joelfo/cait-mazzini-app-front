import { PPDExam } from "types/Api/Exams/PPDExam";
import { ComplementaryExamAPI } from "./Base/ComplementaryExamAPI";

export class PPDExamAPI extends ComplementaryExamAPI<PPDExam> {
    constructor(){
        super("PPDExams");
    }
}