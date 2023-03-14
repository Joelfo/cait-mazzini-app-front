import { PageMetaLink } from "./PageMetaLink";

export type LaravelPage<T> = {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string;
        next: string;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: PageMetaLink[];
        path: string;
        per_page: string;
        to: string;
        total: string;
    }
}