import { EToraxXRayResult } from "Api/Types/enums/EToraxXRayResult";
import { ComplementaryExam } from "./ComplementaryExam";

export type ToraxXRayExam = ComplementaryExam & {
    xRayResult: EToraxXRayResult,
}