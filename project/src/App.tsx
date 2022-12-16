import { ObjectFactory } from 'Canvas/objectsSprites'
import { WireFactory } from 'Canvas/wireFactory'
import { Toolbar } from 'components/Toolbar'
import { gameReducer } from 'gameReducer/gameReducer'
import { pick } from 'lodash'
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
      ObjectFactory.dc(120, 40, 0),
      ObjectFactory.ac(160, 120, 1),
      ObjectFactory.dc(120, 160, 2),
      ObjectFactory.ac(40, 120, 3),
    ],
    wires: [],
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

const objs = INITIAL_STATE.game.objects
INITIAL_STATE.game.wires.push(WireFactory({
  color: 'gw',
  targets: [
    { objectId: objs[1].id, knobIndex: 1 },
    { objectId: objs[3].id, knobIndex: 0 },
  ]
}))
INITIAL_STATE.game.wires.push(WireFactory({
  color: 'rw',
  targets: [
    { objectId: objs[1].id, knobIndex: 1 },
    { objectId: objs[3].id, knobIndex: 0 },
  ]
}))

const useGameLoop = () => {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE)

  const keyDownHandler = useCallback((ev: KeyboardEvent) => { dispatch({ type: 'keydown', code: ev.code, ev }) }, [])
  const keyUpHandler = useCallback((ev: KeyboardEvent) => { dispatch({ type: 'keyup', code: ev.code, ev }) }, [])
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
  const fo = state.game.objects.find(go => go.id === state.game.focusedObject)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginLeft: 200 }}>
      <div style={{ flexGrow: 0 }}>
        <Canvas state={state} onZoom={onZoom} dispatch={dispatch} />
      </div>
      <div>
        <h1>hi</h1>
        <div>{JSON.stringify(state.view)}</div>
        <div>{JSON.stringify(state.keyboard)}</div>
        <div>Focused: {fo && JSON.stringify(pick(fo, 'id', 'rotation'))}</div>
        <button onClick={() => dispatch({ type: 'setState', path: 'view.zoom', value: 1 })}>Set zoom=1</button>
        <ShowGridToggle dispatch={dispatch} state={state} />
        <Toolbar currentTool={state.game.tool} dispatch={dispatch}/>
      </div>
    </div>
  )
}

export default App
