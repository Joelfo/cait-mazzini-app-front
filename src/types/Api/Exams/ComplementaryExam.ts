import { ExamFile } from "./ExamFile";

export type ComplementaryExam = {
    id: number,
    patientId: number,
    date: string,
    observations: string,
    examFiles: ExamFile[],
}