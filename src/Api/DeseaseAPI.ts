import { Desease } from "types/Api/DTOs/Desease";
import { ResourceAPI } from "./Base/ResourceAPI";

export class DeseaseAPI extends ResourceAPI<Desease>{
    public constructor(){
        super('Deseases');
    }
}