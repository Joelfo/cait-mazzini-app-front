import { ArrivalType } from "Api/Types/enums/ArrivalType";
import { EAddressZone } from "Api/Types/enums/EAddressZone";
import { EBiologicalGender } from "Api/Types/enums/EBiologicalGender";
import { PatientType } from "Api/Types/enums/PatientType";
import { SpecialPopulationType } from "Api/Types/enums/SpecialPopulationType";
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
    healthUnityId: number,
    _links: LaravelLink[];
}