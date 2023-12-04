import { PCRExam } from "types/Api/PCRExam";
import { ComplementaryExamAPI } from "./Base/ComplementaryExamAPI";

export class PCRExamAPI extends ComplementaryExamAPI<PCRExam> {
    constructor() {
        super("PCRExams");
    }
}