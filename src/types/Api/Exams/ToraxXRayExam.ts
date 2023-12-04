import { EToraxXRayResult } from "types/enums/EToraxXRayResult";
import { ComplementaryExam } from "./ComplementaryExam";

export type ToraxXRayExam = ComplementaryExam & {
    xRayResult: EToraxXRayResult,
}