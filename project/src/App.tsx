import { useCallback, useEffect, useReducer } from 'react'
import './App.css'
import { Canvas } from './Canvas'

const MAX_ZOOM = 2
const MIN_ZOOM = 0.2
const PAN_PIXELS_PS = 80

export const INITIAL_STATE = {
  view: {
    x: 0,
    y: 0,
    zoom: 1,
  },
  game: {
    objects: [],
  },
  keyboard: {
    up: false,
    down: false,
    left: false,
    right: false,
  },
}

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

const useGameLoop = () => {
  const [state, dispatch] = useReducer((state: GameState, action: GameActions) => {
    switch (action.type) {
      case 'keyup':
      case 'keydown':
        const dir = KEY_MAP[action.key as keyof typeof KEY_MAP]
        if (dir) {
          return {
            ...state,
            keyboard: {
              ...state.keyboard,
              [dir]: action.type === 'keydown',
            },
          }
        }
        break;
      case 'step':
        const newGameState = { ...state.view }
        const pan = PAN_PIXELS_PS * action.dt / 1000

        ;(['up', 'down', 'left', 'right'] as Array<keyof typeof DIR_MAP>).forEach((dir) => {
          if (state.keyboard[dir]) {
            newGameState.x += DIR_MAP[dir].dx * pan// / state.game.zoom
            newGameState.y += DIR_MAP[dir].dy * pan// / state.game.zoom
          }
        })
        const newState = { ...state, view: newGameState }
        return newState
      case 'zoom': {
        const { dz, svgX, svgY } = action
        const { view: game } = state
        const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, state.view.zoom + dz))

        const x = svgX - (svgX - game.x) * zoom / game.zoom
        const y = svgY - (svgY - game.y) * zoom / game.zoom

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
      default:
        break;
    }

    return state
  }, INITIAL_STATE)

  const keyDownHandler = useCallback((ev: KeyboardEvent) => { dispatch({ type: 'keydown', key: ev.key }) }, [])
  const keyUpHandler = useCallback((ev: KeyboardEvent) => { dispatch({ type: 'keyup', key: ev.key }) }, [])
  const onZoom = useCallback((zSpecs: ZoomSpecs) => { dispatch({ type: 'zoom', ...zSpecs }) }, [])
  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    let canceled = false
    let prevTime = 0
    const step: FrameRequestCallback = (time) => {
      if (!canceled) {
        const dt = time - (prevTime || time)
        prevTime = time
        dispatch({ type: 'step', dt })
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)

    return () => {
      document.removeEventListener('keydown', keyDownHandler)
      document.removeEventListener('keyup', keyUpHandler)
      canceled = true
    }
  }, [])

  return {
    state,
    onZoom,
  }
}

function App() {
  const {
    state,
    onZoom,
  } = useGameLoop()

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginLeft: 200 }}>
      <div style={{ flexGrow: 0 }}>
        <Canvas state={state} onZoom={onZoom} />
      </div>
      <div>
        <h1>hi</h1>
        <h1>Hello x: {state.view.x}; y: {state.view.y}</h1>
        <div>{JSON.stringify(state.keyboard)}</div>
      </div>
    </div>
  )
}

export default App
