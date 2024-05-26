
export type ZExclude<T, U extends T> = T extends U ? never : T
