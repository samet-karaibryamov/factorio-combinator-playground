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

declare global {
  type ObjectRotation = 0 | 1 | 2 | 3
  type GameObjectType = {
    id: string
    x: number
    y: number
    rotation: ObjectRotation
    type: ToolType
    sprite: {
      href: string
      unit: {
        width: number
        height: number
      }
    }
  }
  type GameState = {
    view: {
      x: number
      y: number
      zoom: number
      isGridShown: boolean
    }
    game: {
      objects: GameObjectType[]
      focusedObject?: string | null
      tool: ToolType | null
    }
    keyboard: {
      up: boolean
      down: boolean
      left: boolean
      right: boolean
      shift: boolean
    }
  }

  type ToolType = 'cc' | 'ac' | 'dc'

  interface ZoomSpecs {
    dz: number
    svgX: number
    svgY: number
  }

  interface HoverSpecs {
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
    objId?: string
  }
  SelectTool: {
    type: 'selectTool',
    toolId: ToolType
  }
}
