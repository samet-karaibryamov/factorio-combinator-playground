import { INITIAL_STATE } from './App'

export {}

declare global {
  type GameState = typeof INITIAL_STATE
  type MoveAction = {
    type: 'move'
    dx: number
    dy: number
  }
  type KeyAction = {
    type: 'keyup' | 'keydown'
    key: string
  }
  type StepAction = {
    type: 'step'
    dt: number
  }
  interface ZoomSpecs {
    dz: number
    svgX: number
    svgY: number
  }
  type ZoomAction = ZoomSpecs & {
    type: 'zoom'
  }
  type GameActions = MoveAction | KeyAction | StepAction | ZoomAction
}