import { ObjectFactory } from 'Canvas/objectsSprites'
import { Toolbar } from 'components/Toolbar'
import { gameReducer } from 'gameReducer/gameReducer'
import { useCallback, useEffect, useReducer } from 'react'
import './App.css'
import { Canvas } from './Canvas'
import { ShowGridToggle } from './components/ShowGridToggle'

export const INITIAL_STATE: GameState = {
  view: {
    x: 0,
    y: 0,
    zoom: 1,
    isGridShown: false,
  },
  game: {
    objects: [
      ObjectFactory.CC(120, 40, 0),
      ObjectFactory.CC(160, 120, 1),
      ObjectFactory.CC(120, 160, 2),
      ObjectFactory.CC(40, 120, 3),
    ],
    focusedObject: null,
    tool: null,
    toolRotation: 0,
  },
  keyboard: {
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false,
  },
}

const useGameLoop = () => {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE)

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
    dispatch,
  }
}

export type UseGameLoop = typeof useGameLoop

function App() {
  const {
    state,
    onZoom,
    dispatch,
  } = useGameLoop()

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginLeft: 200 }}>
      <div style={{ flexGrow: 0 }}>
        <Canvas state={state} onZoom={onZoom} dispatch={dispatch} />
      </div>
      <div>
        <h1>hi</h1>
        <div>{JSON.stringify(state.view)}</div>
        <div>{JSON.stringify(state.keyboard)}</div>
        <div>Focused: {state.game.focusedObject}</div>
        <button onClick={() => dispatch({ type: 'setState', path: 'view.zoom', value: 1 })}>Set zoom=1</button>
        <ShowGridToggle dispatch={dispatch} state={state} />
        <Toolbar currentTool={state.game.tool} dispatch={dispatch}/>
      </div>
    </div>
  )
}

export default App
