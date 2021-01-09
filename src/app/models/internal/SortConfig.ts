export enum SortBy {
    DATE,
    VALUE
}
export enum SortOrder {
    ASC,
    DESC
}
export interface SortConfig {
    by: SortBy,
    order: SortOrder,
}