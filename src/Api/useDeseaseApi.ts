import { Desease } from "Api/Types/Desease";
import { ResourceAPI } from "./Base/ResourceAPI";
import { useResourceAPI } from "./Base/useResourceAPI";

export class DeseaseAPI extends ResourceAPI<Desease>{
    public constructor(){
        super('Deseases');
    }
}

export const useDeseaseApi = () => {
    return useResourceAPI<Desease>('Deseases');
}