
let objId = 0
export const tagObject = <T>(partialObj: T) => ({
  ...partialObj,
  id: String(objId++),
} as T & { id: string })

export const WireFactory = (specs: Omit<WireObjectType, 'id'>): WireObjectType => tagObject(specs)
