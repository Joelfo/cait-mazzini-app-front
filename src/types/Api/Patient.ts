import { ArrivalType } from "./enums/ArrivalType";
import { EAddressZone } from "./enums/EAddressZone";
import { EBiologicalGender } from "./enums/EBiologicalGender";
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
    arrivalType: ArrivalType;
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
    biologicalGender: EBiologicalGender,
    districtId: number,
    birthplaceId: number,
    birthCountryId: number,
    healthUnityId: number,
    _links: LaravelLink[];
}