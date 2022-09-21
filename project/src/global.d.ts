import { INITIAL_STATE } from './App'

export {}

type _GameState = typeof INITIAL_STATE & {
  game: {
    objects: {
      x: number
      y: number
      rotation: 0 | 1 | 2 | 3
    }[]
  }
}
declare global {
  type GameState = Omit<_GameState, never>
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