import { ComplementaryExam } from "./Exams/ComplementaryExam";

export type IgraExam = ComplementaryExam & {
    isPositiveResult: boolean,
    material: string,
    kit: string,
    method: string
}