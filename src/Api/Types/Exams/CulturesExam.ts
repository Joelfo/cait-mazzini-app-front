import { ComplementaryExam } from "./ComplementaryExam";

export type CulturesExam = ComplementaryExam & {
    isPositiveResult: boolean,
    site: string
}