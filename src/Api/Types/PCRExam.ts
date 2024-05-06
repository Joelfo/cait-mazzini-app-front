import { ComplementaryExam } from "./Exams/ComplementaryExam";

export type PCRExam = ComplementaryExam & {
    isPositiveResult: boolean,
    material: string,
    kit: string,
    method: string
}