import { mapValues } from 'lodash'
import { constantCombinator } from './objects/constantCombinator'
import { deciderCombinator } from './objects/deciderCombinator'
import { arithmeticCombinator } from './objects/arithmeticCombinator'
import { redWire, greenWire } from './objects/wires'
import { DEFAULT_BEHAVIOUR } from './consts'
import { Except } from 'type-fest'


export type ObjectSpecs = {
  icon: string
  placeable?: {
    behaviour: typeof DEFAULT_BEHAVIOUR,
    base: {
      width: number,
      height: number,
      sprite: GameObjectType['sprite'],
    },
  }
}

export type ObjectToolType =
  | 'constant-combinator'
  | 'decider-combinator'
  | 'arithmetic-combinator'

export const PLACEABLE_OBJECT_SPECS = {
  'constant-combinator': constantCombinator,
  'decider-combinator': deciderCombinator,
  'arithmetic-combinator': arithmeticCombinator,
} as const satisfies Record<ObjectToolType, any>

export const WIRE_SPECS = {
  'red-wire': redWire,
  'green-wire': greenWire,
} as const

export const OBJECT_SPECS = {
  ...PLACEABLE_OBJECT_SPECS,
  ...WIRE_SPECS,
} as const

let objId = 0
export const tagObject = (partialObj: Omit<GameObjectType, 'id'>) => ({
  ...partialObj,
  id: String(objId++),
} as GameObjectType)

type ObjectCreator = (x: number, y: number, r: ObjectRotation) => GameObjectType

type POSpecs = typeof PLACEABLE_OBJECT_SPECS

export const ObjectFactory = mapValues(PLACEABLE_OBJECT_SPECS, (specs, key) => {
  const res: ObjectCreator = (x, y, r) => tagObject({
    x,
    y,
    rotation: r,
    type: key as keyof typeof PLACEABLE_OBJECT_SPECS,
    ...specs.placeable.base(),
  })

  return res
}) as {
  [K in keyof POSpecs]: (x: number, y: number, r: ObjectRotation) => Id<
    & Except<GameObjectType, 'type'>
    & ReturnType<POSpecs[K]['placeable']['base']>
    & { type: K }
  >
}
