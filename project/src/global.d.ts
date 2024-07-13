import { OBJECT_SPECS, ObjectToolType, PLACEABLE_OBJECT_SPECS, WIRE_SPECS } from 'objectSpecs'
import { PathsOfType } from 'tsUtils/PathsOfType'
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

declare global {
  type Id<T> = {} & { [K in keyof T]: T[K] }
  type NullPartial<T, K extends keyof T = keyof T> = { [P in K]?: T[P] | null } & Omit<T, K>

  type Coords = { x: number, y: number }

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
      lcdOffsets?: Array<{
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
    color: WireToolType
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
      size: { w: number, h: number }
      zoom: number
      isGridShown: boolean
      brightness: number
    }
    game: {
      objects: GameObjectType[]
      wires: WireObjectType[]
      focusedObject?: string | null
      tool: ToolType | null
      toolRotation: ObjectRotation
      toolObject?: WireObjectType | null
      inspectedObject?: string | null
      isToolbarOpen: boolean
    }
    keyboard: KeyboardType
    dialogStack: Array<{
      props: any
    }>
  }

  type WireToolType = keyof typeof WIRE_SPECS
  type ToolType = WireToolType | ObjectToolType

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
    ev: KeyboardEvent
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
  SetBrightness: {
    type: 'setBrightness'
    value: number
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
    path: PathsOfType<GameState, any>
    value: any
  }
  OnClick: {
    type: 'onClick'
    gameCoords: Coords
  }
  OpenDialog: {
    type: 'openDialog'
    props: any
  }
  UpdateObject: {
    type: 'updateObject'
    partial: Id<Partial<GameObjectType> & Pick<GameObjectType, 'id'>>
  }
  StepCircuits: {
    type: 'stepCircuits'
  }
}
