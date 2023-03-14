import { LaravelLink } from "./vendor/LaravelLink";

export type Patient = {
    id: Number;
    name: string;
    susCard: string;
    rg: string;
    cpf: string;
    admissionDate: string;
    type: string;
    arrival: string;
    telephone1: string;
    telephone2: string;
    cep: string;
    pregnant: boolean;
    birthDate: string;
    recordCode: string;
    motherName: string;
    address: string;
    _links: LaravelLink;
}