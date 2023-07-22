import { ArrivalType } from "./enums/ArrivalType";
import { PatientType } from "./enums/PatientType";
import { SpecialPopulationType } from "./enums/SpecialPopulationType";
import { IdModelDTO } from "./vendor/IdModelDTO";
import { LaravelLink } from "./vendor/LaravelLink";

export type Patient = {
    id: Number;
    name: string;
    susCard: string;
    rg: string;
    cpf: string;
    admissionDate: string;
    type: PatientType;
    arrival: ArrivalType;
    telephone1: string;
    telephone2: string;
    cep: string;
    isPregnant: boolean;
    birthDate: string;
    recordCode: string;
    motherName: string;
    street: string,
    number: number,
    complement: string | null,
    specialPopulation: SpecialPopulationType,
    otherSpecialPopulation: string | null,
    biologicalGender: string,
    district: IdModelDTO,
    birthplace: string,
    nationality: IdModelDTO | undefined,
    healthUnity: IdModelDTO | undefined,
    _links: LaravelLink[];
}