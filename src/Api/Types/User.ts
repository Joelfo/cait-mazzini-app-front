import { EUserRole } from "Api/Types/enums/EUserRole"

export type User = {
    id: number,
    name: string,
    cpf: string,
    password: string,
    email: string,
    role: EUserRole
}