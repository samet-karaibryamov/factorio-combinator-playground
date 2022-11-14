import immUpdate from 'immutability-helper'

const MAX_ZOOM = 2
const MIN_ZOOM = 0.5
const PAN_PIXELS_PS = 80

const KEY_MAP = {
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
}
const DIR_MAP = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
}

export const gameReducer = (state: GameState, action: GameActions) => {
  switch (action.type) {
    case 'keyup':
    case 'keydown': {
      const key = action.key.toLowerCase()
      const mapped = KEY_MAP[key as keyof typeof KEY_MAP] || key
      if (mapped in state.keyboard) {
        return {
          ...state,
          keyboard: {
            ...state.keyboard,
            [mapped]: action.type === 'keydown',
          },
        }
      }
      if (action.type === 'keyup') {
        const { game } = state
        const { focusedObject: fo } = game
        if (fo) {
          if (key === 'r') {
            return {
              ...state,
              game: {
                ...game,
                objects: game.objects.map(obj => {
                  if (fo !== obj.id) return obj

                  return {
                    ...obj,
                    rotation: (obj.rotation + (state.keyboard.shift ? -1 : 1) + 4) % 4 as ObjectRotation,
                  }
                })
              }
            }
          }
        }
        switch (key) {
          case 'q': {
            const { tool, objects: objs } = state.game
            if (tool || fo) {
              const obj = objs.find(o => o.id === fo) as GameObjectType
              return immUpdate(state, { game: { tool: { $set: tool ? null : obj.type } } })
            }
          }
        }
      }
      break;
    }
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