import { LaravelLink } from "./vendor/LaravelLink"

export type Nationality = {
    id: number,
    name: string,
    _links: LaravelLink[]
}