import { SpriteDef } from 'Canvas/objectsSprites'
import { OBJECT_TOOL_TYPES, TOOL_TYPES, WIRE_TOOL_TYPES } from 'consts'
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
    type: ObjectToolType
    width: number
    height: number
    sprite: {
      href: string
      unit: {
        w: number
        h: number
      }
      scale: number
      rotationOffset: Array<{
        x: number
        y: number
      }>
      knobs: Array<{
        rotations: Array<{
          red: { x: number, y: number },
          green: { x: number, y: number },
        }>
      }>
    }
  }

  type WireObjectType = {
    id: string
    color: (typeof WIRE_TOOL_TYPES)[number]
    targets: Array<{
      objectId: string
      knobIndex: number
    }>
  }

  interface KeyboardType {
    up: boolean
    down: boolean
    left: boolean
    right: boolean
    shift: boolean
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
      wires: WireObjectType[]
      focusedObject?: string | null
      tool: ToolType | null
      toolRotation: ObjectRotation
    }
    keyboard: KeyboardType
  }

  type WireToolType = (typeof WIRE_TOOL_TYPES)[number]
  type ObjectToolType = (typeof OBJECT_TOOL_TYPES)[number]
  type ToolType = (typeof TOOL_TYPES)[number]

  interface ZoomSpecs {
    dz: number
    svgX: number
    svgY: number
  }

  interface HoverSpecs {
    svgX: number
    svgY: number

  }

  type GameActions = ActionsMapType[keyof ActionsMapType]
}

export interface ActionsMapType {
  Move: {
    type: 'move'
    dx: number
    dy: number
  }
  Key: {
    type: 'keyup' | 'keydown'
    code: string
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
  HoverObject: {
    type: 'hoverObject'
    objId?: string
  }
  SelectTool: {
    type: 'selectTool'
    toolId: ToolType
  }
  PlaceObject: {
    type: 'placeObject'
    instance: GameObjectType
  }
  SetState: {
    type: 'setState'
    path: string
    value: any
  }
}
