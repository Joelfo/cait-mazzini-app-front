import { LaravelLink } from "./vendor/LaravelLink"

export type HealthUnity = {
    id: number,
    name: string,
    _links: LaravelLink[]
}