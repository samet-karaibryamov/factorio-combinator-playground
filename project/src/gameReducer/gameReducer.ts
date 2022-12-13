import { tagObject } from 'Canvas/objectsSprites'
import produce, { setAutoFreeze } from 'immer'
import _ from 'lodash'
import { keyHandler } from './keyHandler'

if (import.meta.env.DEV) {
  setAutoFreeze(false)
}

const MAX_ZOOM = 2
const MIN_ZOOM = 0.5
const PAN_PIXELS_PS = 80

const DIR_MAP = {
  up: { dx: 0, dy: 1 },
  down: { dx: 0, dy: -1 },
  left: { dx: 1, dy: 0 },
  right: { dx: -1, dy: 0 },
}

export const _gameReducer = (state: GameState, action: GameActions) => {
  if (action.type === 'step') {
    const newGameState = { ...state.view }
    const pan = PAN_PIXELS_PS * action.dt / 400

    let isUpdated = false
    ;(['up', 'down', 'left', 'right'] as Array<keyof typeof DIR_MAP>).forEach((dir) => {
      if (state.keyboard[dir]) {
        isUpdated = true
        newGameState.x += DIR_MAP[dir].dx * pan
        newGameState.y += DIR_MAP[dir].dy * pan
      }
    })
    // if (!isUpdated) return state

    return { ...state, view: newGameState }
  }

  return produce(state, (dState) => {
    switch (action.type) {
      case 'setState': _.set(dState, action.path, action.value); return
      case 'keyup':
      case 'keydown': keyHandler(dState, action); return
      case 'showGrid': dState.view.isGridShown = action.isShown; return
      case 'hoverObject': dState.game.focusedObject = action.objId; return
      case 'selectTool': dState.game.tool = action.toolId; return
      case 'placeObject': dState.game.objects.push(tagObject(action.instance)); return
      case 'zoom': {
        const { dz, svgX, svgY } = action
        const { view } = dState
        const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, state.view.zoom + dz))

        const x = svgX - (svgX - view.x) * zoom / view.zoom
        const y = svgY - (svgY - view.y) * zoom / view.zoom

        view.x = x
        view.y = y
        view.zoom = zoom
        return
      }
    }
  })
}

export const gameReducer: typeof _gameReducer = (state, action) => {
  const newState = _gameReducer(state, action)
  return newState
}