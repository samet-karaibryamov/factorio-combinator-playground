// Your code
type Primitives = number | string | boolean
type Helper<T, Trg> =
  // check for `any`
  0 extends (1 & Trg)
    ? ''
    : Equal<T, Trg> extends true
      ? ''
      : never
export type PathsOfType<T, Trg, Dth extends readonly any[] = [], K = keyof T> =
  Dth['length'] extends 3
    ? never
    : K extends Primitives
      ? K extends keyof T
        ? `${K}${
          Helper<T[K], Trg> | (
            T[K] extends Primitives
              ? never
              : T[K] extends any[]
                ? `[${number}]${Helper<T[K][number], Trg> | `.${PathsOfType<T[K][number], Trg, [...Dth, 1]>}`}`
                : `.${PathsOfType<T[K], Trg, [...Dth, 1]>}`
          )}`
        : never
      : never