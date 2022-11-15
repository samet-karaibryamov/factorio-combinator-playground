import immUpdate from 'immutability-helper'
import { keyHandler } from './keyHandler'

const MAX_ZOOM = 2
const MIN_ZOOM = 0.5
const PAN_PIXELS_PS = 80

const DIR_MAP = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
}

export const gameReducer = (state: GameState, action: GameActions) => {
  switch (action.type) {
    case 'keyup':
    case 'keydown': return keyHandler(state, action)
    case 'step':
      const newGameState = { ...state.view }
      const pan = PAN_PIXELS_PS * action.dt / 500

      let isUpdated = false
      ;(['up', 'down', 'left', 'right'] as Array<keyof typeof DIR_MAP>).forEach((dir) => {
        if (state.keyboard[dir]) {
          isUpdated = true
          newGameState.x += DIR_MAP[dir].dx * pan
          newGameState.y += DIR_MAP[dir].dy * pan
        }
      })
      if (!isUpdated) return state

      return { ...state, view: newGameState }
    case 'zoom': {
      const { dz, svgX, svgY } = action
      const { view } = state
      const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, state.view.zoom + dz))

      const x = svgX - (svgX - view.x) * zoom / view.zoom
      const y = svgY - (svgY - view.y) * zoom / view.zoom

      return {
        ...state,
        view: {
          ...state.view,
          x,
          y,
          zoom,
        }
      }
    }
    case 'showGrid': {
      return {
        ...state,
        view: {
          ...state.view,
          isGridShown: action.isShown
        }
      }
    }
    case 'hoverObject': {
      return {
        ...state,
        game: {
          ...state.game,
          focusedObject: action.objId,
        }
      }
    }
    case 'selectTool': {
      return immUpdate(state, { game: { tool: { $set: action.toolId } } })
    }
    default:
      break;
  }

  return state
}
