declare const idBrand: unique symbol
export type Id<K extends string> = string & { readonly [idBrand]: K }
export type ProjectId = Id<'project'>
export type BookId = Id<'book'>
export type ChapterId = Id<'chapter'>
export type TokenId = Id<'token'>
export type OccurrenceId = Id<'occurrence'>
export type MediaId = Id<'media'>
export const isId = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0
