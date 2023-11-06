import { ArrivalType } from "types/enums/ArrivalType";
import { EAddressZone } from "types/enums/EAddressZone";
import { EBiologicalGender } from "types/enums/EBiologicalGender";
import { PatientType } from "types/enums/PatientType";
import { SpecialPopulationType } from "types/enums/SpecialPopulationType";
import { IdModelDTO } from "types/vendor/IdModelDTO";
import { LaravelLink } from "types/vendor/LaravelLink";

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