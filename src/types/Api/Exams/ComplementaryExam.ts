import { ExamFile } from "./ExamFile";

export type ComplementaryExam = {
    patientId: number,
    date: string,
    observations: string,
    examFiles: ExamFile[],
}