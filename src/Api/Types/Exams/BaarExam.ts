import { EBaarResult } from "../enums/EBaarResult"
import { ESputumAspect } from "../enums/ESputumAspect"
import { ComplementaryExam } from "./ComplementaryExam"

export type BaarExam = ComplementaryExam & {
    monthNumber: number,
    sampleNumber: number,
    isSputumMaterial: boolean,
    otherMaterial: number,
    sputumAspect?: ESputumAspect,
    result: EBaarResult
}