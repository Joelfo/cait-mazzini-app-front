import { ArrivalType } from "./enums/ArrivalType";
import { EAddressZone } from "./enums/EAddressZone";
import { PatientType } from "./enums/PatientType";
import { SpecialPopulationType } from "./enums/SpecialPopulationType";
import { IdModelDTO } from "./vendor/IdModelDTO";
import { LaravelLink } from "./vendor/LaravelLink";

export type Patient = {
    id: number;
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
    addressStreet: string,
    addressNumber: number,
    addressComplement: string | null,
    addressZone: EAddressZone,
    specialPopulation: SpecialPopulationType,
    otherSpecialPopulation: string | null,
    biologicalGender: string,
    districtId: number,
    birthplace: string,
    birthCountryId: number,
    healthUnityId: number,
    _links: LaravelLink[];
}