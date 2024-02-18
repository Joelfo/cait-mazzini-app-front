import { PhysicalExam } from "types/Api/PhysicalExam";
import { ResourceAPI } from "./Base/ResourceAPI";
import { useResourceAPI } from "./Base/useResourceAPI";

export class PhysicalExamAPI extends ResourceAPI<PhysicalExam> {
    constructor(){
        super('PhysicalExams');
    }
}

export const usePhysicalExamApi = () => useResourceAPI<PhysicalExam>('PhysicalExams')