import { ObjectFactory } from 'objectSpecs'
import { WireFactory } from 'Canvas/wireFactory'
import { CCInspect } from 'components/inspectors/CCInspect'
import { ItemSelectorGrid } from 'components/ItemSelectorGrid'
import { Dialog } from 'Dialogs'
import { gameReducer } from 'gameReducer/gameReducer'
import { pick } from 'lodash'
import { useCallback, useEffect, useReducer } from 'react'
import { useKeyboard } from 'useKeyboard'
import { KeyboardCapture } from 'useKeyboard'
import './App.css'
import { Canvas } from './Canvas'
import { ShowGridToggle } from './components/ShowGridToggle'
import { CCGameObjectType } from 'objectSpecs/objects/constantCombinator'
import { ACInspect } from 'components/inspectors/ACInspect'
import { ACGameObjectType } from 'objectSpecs/objects/arithmeticCombinator'

export const INITIAL_STATE: GameState = {
  view: {
    x: 0,
    y: 0,
    zoom: 1,
    isGridShown: false,
  },
  game: {
    objects: [
      ObjectFactory['decider-combinator'](120, 40, 0),
      ObjectFactory['arithmetic-combinator'](160, 120, 1),
      ObjectFactory['decider-combinator'](120, 160, 2),
      ObjectFactory['arithmetic-combinator'](40, 120, 3),
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
  dialogStack: [],
}

const objs = INITIAL_STATE.game.objects
INITIAL_STATE.game.wires.push(WireFactory({
  color: 'green-wire',
  targets: [
    { objectId: objs[1].id, knobIndex: 1 },
    { objectId: objs[3].id, knobIndex: 0 },
  ]
}))
INITIAL_STATE.game.wires.push(WireFactory({
  color: 'red-wire',
  targets: [
    { objectId: objs[1].id, knobIndex: 1 },
    { objectId: objs[3].id, knobIndex: 0 },
  ]
}))

const useGameLoop = () => {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE)

  const onZoom = useCallback((zSpecs: ZoomSpecs) => { dispatch({ type: 'zoom', ...zSpecs }) }, [])

  useKeyboard({
    onKeyDown: (ev: KeyboardEvent) => { dispatch({ type: 'keydown', code: ev.code, ev }) },
    onKeyUp: (ev: KeyboardEvent) => { dispatch({ type: 'keyup', code: ev.code, ev }) },
  })

  useEffect(() => {
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
  const io = state.game.objects.find(go => go.id === state.game.inspectedObject)
  // window.statez = state

  return (
    <KeyboardCapture>
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
          <div>
            <ItemSelectorGrid value={state.game.tool} onChange={(toolId) => dispatch({ type: 'selectTool', toolId })}/>
          </div>
          {io?.type === 'constant-combinator' && (
            <Dialog
              title="Constant Combinator"
              onClose={() => dispatch({ type: 'setState', path: 'game.inspectedObject', value: null })}
              body={
                <CCInspect
                  obj={io as CCGameObjectType}
                  onSubmit={(partial) => {
                    dispatch({
                      type: 'updateObject',
                      partial: partial as GameObjectType,
                    })
                  }}
                />
              }
            />
          )}
          {io?.type === 'arithmetic-combinator' && (
            <Dialog
              title="Arithmetic Combinator"
              onClose={() => dispatch({ type: 'setState', path: 'game.inspectedObject', value: null })}
              body={
                <ACInspect
                  obj={io as ACGameObjectType}
                  onSubmit={(partial) => {
                    dispatch({
                      type: 'updateObject',
                      partial: partial,
                    })
                  }}
                />
              }
            />
          )}
        </div>
      </div>
    </KeyboardCapture>
  )
}

export default App
