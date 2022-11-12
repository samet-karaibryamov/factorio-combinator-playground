import { SpriteDef } from 'Canvas/objectsSprites'
import { INITIAL_STATE } from './App'

export {}

type Primitive = string | number | boolean | any[]
type DeepMerge<T, U> = U extends Primitive
  ? U
  : (
    Omit<{
      [k in Exclude<keyof T, keyof U>]: T[k]
    } & {
      [k in keyof U]: k extends keyof T ? DeepMerge<T[k],U[k]> : U[k]
    }, never>
  )

type PartialPartial<T, Keys extends keyof T> = Omit<
{ [P in keyof T]?: T[P] }
& { [P in keyof T]?: T[P] }
, never>

type _GameState = DeepMerge<typeof INITIAL_STATE, {
  game: {
    objects: GameObjectType[]
  }
}>
declare global {
  type ObjectRotation = 0 | 1 | 2 | 3
  type GameObjectType = {
    id: number | string
    x: number
    y: number
    rotation: ObjectRotation
    sprite: {
      href: string
      unit: {
        width: number
        height: number
      }
    }
  }
  type GameState = Omit<_GameState, never>

  interface ZoomSpecs {
    dz: number
    svgX: number
    svgY: number
  }

  type GameActions = Actions[keyof Actions]
}

interface Actions {
  Move: {
    type: 'move'
    dx: number
    dy: number
  }
  Key: {
    type: 'keyup' | 'keydown'
    key: string
  }
  Step: {
    type: 'step'
    dt: number
  }
  Zoom: ZoomSpecs & {
    type: 'zoom'
  }
  ShowGrid: {
    type: 'showGrid'
    isShown: boolean
  }
  RotateObject: {
    type: 'rotateObject'
    isCW: boolean
  }
  HoverObject: {
    type: 'hoverObject'
    objId: string
  }
}
