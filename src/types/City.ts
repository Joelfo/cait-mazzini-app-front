import { LaravelLink } from "./vendor/LaravelLink"

export type City = {
    id: number,
    name: string,
    _links: LaravelLink[]
}