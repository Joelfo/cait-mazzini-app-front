import { PhysicalExam } from "types/Api/PhysicalExam";
import { ResourceAPI } from "./Base/ResourceAPI";

export class PhysicalExamAPI extends ResourceAPI<PhysicalExam> {
    constructor(){
        super('PhysicalExams');
    }
}