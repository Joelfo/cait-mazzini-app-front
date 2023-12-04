import { ComplementaryExam } from "./Exams/ComplementaryExam";

export type PCRExam = ComplementaryExam & {
    isPositiveResult: boolean
}