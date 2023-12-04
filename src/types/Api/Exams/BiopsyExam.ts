import { ComplementaryExam } from "./ComplementaryExam";

export type BiopsyExam = ComplementaryExam & {
    analyzedTissue: string,
    result: string
}