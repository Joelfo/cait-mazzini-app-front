import { Desease } from "types/Api/Desease";
import { ResourceAPI } from "./Base/ResourceAPI";

export class DeseaseAPI extends ResourceAPI<Desease>{
    public constructor(){
        super('Deseases');
    }
}