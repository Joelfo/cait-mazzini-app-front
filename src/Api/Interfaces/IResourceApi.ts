import { UseMutationResult } from "@tanstack/react-query";
import { ComplementaryExam } from "Api/Types/Exams/ComplementaryExam";

export interface IResourceApi<TViewModel, TDTO = TViewModel>{
    useCreate: () => UseMutationResult<number, unknown, TDTO, unknown>,
    useShow: (id: number | undefined) => TViewModel,
    useAll: () => TViewModel[],
    useUpdate: () => UseMutationResult<number, unknown, TDTO, unknown>,
    useRemove: () => UseMutationResult<void, unknown, number, unknown>,
}