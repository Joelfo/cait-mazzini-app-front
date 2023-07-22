import { IdModelDTO } from "./vendor/IdModelDTO"
import { LaravelLink } from "./vendor/LaravelLink"

export type District = {
    id: number,
    name: string,
    city: IdModelDTO
    _links: LaravelLink[]
}