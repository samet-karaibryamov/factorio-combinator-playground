
export const typedEntries = <T extends Record<string, any>>(obj: T) => {
  return Object.entries(obj) as Array<[keyof T, Required<T>[keyof T]]>
}
