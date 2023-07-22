import { LaravelLink } from "./vendor/LaravelLink"

export type District = {
    id: number,
    name: string,
    _links: LaravelLink[]
}