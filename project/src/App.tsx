import { ObjectFactory } from 'objectSpecs'
import { WireFactory } from 'Canvas/wireFactory'
import { CCInspect } from 'components/inspectors/CCInspect'
import { Dialog } from 'Dialogs'
import { gameReducer } from 'gameReducer/gameReducer'
import _, { pick } from 'lodash'
import { useCallback, useEffect, useReducer } from 'react'
import { useKeyboard } from 'useKeyboard'
import { KeyboardCapture } from 'useKeyboard'
import { Canvas } from './Canvas'
import { CCGameObjectType } from 'objectSpecs/objects/constantCombinator'
import { ACInspect } from 'components/inspectors/ACInspect'
import { ACGameObjectType } from 'objectSpecs/objects/arithmeticCombinator'
import { DCGameObjectType } from 'objectSpecs/objects/deciderCombinator'
import { DCInspect } from 'components/inspectors/DCInspect'
import { CircuitObjectType, stepCircuitState } from 'circuitProcessing'
import { BrightnessSelector } from 'components/BrightnessSelector'
import { ToolbarDlg } from 'components/ToolbarDlg'
import { SignalsDisplay } from 'components/SignalsDisplay'

Object.assign(window, { stepCircuitState })

const ac = ObjectFactory['arithmetic-combinator'](160, 120, 1)
ac.circuit.leftSignal = { prototype: 'arithmetic-combinator' }
ac.circuit.oper = '-'
ac.circuit.rightSignal = { amount: 7 }
ac.circuit.returnSignal = 'decider-combinator'
ac.currentOutput = { 'constant-combinator': 63, 'decider-combinator': 14 }
ac.currentInput = { red: { 'decider-combinator': 43 }, green: {} }

const cc = ObjectFactory['constant-combinator'](200, 200, 0)
cc.circuit.signals['arithmetic-combinator'] = {
  prototype: 'arithmetic-combinator',
  amount: 13,
  index: 3,
}

const getCanvasSize = () => {
  return {
    w: window.innerWidth + 2,
    h: window.innerHeight + 2,
  }
}

export const INITIAL_STATE: GameState = {
  view: {
    x: 0,
    y: 0,
    size: getCanvasSize(),
    zoom: 1,
    isGridShown: false,
    brightness: Number(localStorage.getItem('brightness')) || 1,
  },
  game: {
    objects: [
      ObjectFactory['decider-combinator'](120, 40, 1),
      ac,
      ObjectFactory['decider-combinator'](120, 160, 2),
      ObjectFactory['arithmetic-combinator'](40, 120, 3),
      cc,
    ],
    wires: [],
    focusedObject: null,
    tool: null,
    toolRotation: 0,
    isToolbarOpen: false,
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
  color: 'red-wire',
  targets: [
    { objectId: objs[1].id, knobIndex: 1 },
    { objectId: objs[4].id, knobIndex: 0 },
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
export type GameDispatch = ReturnType<UseGameLoop>['dispatch']

function App() {
  const {
    state,
    onZoom,
    dispatch,
  } = useGameLoop()
  const fo = state.game.objects.find(go => go.id === state.game.focusedObject)
  const io = state.game.objects.find(go => go.id === state.game.inspectedObject)
  Object.assign(window, {statez: state})

  useEffect(() => {
    const handler = _.throttle(() => {
      dispatch({
        type: 'setState',
        path: 'view.size',
        value: getCanvasSize(),
      })
    })
    window.addEventListener('resize', handler)
    
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])

  return (
    <KeyboardCapture>
      <div style={{ '--brightness': state.view.brightness, height: '100%', overflow: 'hidden' }}>
        <div style={{ margin: -1 }}>
          <Canvas state={state} onZoom={onZoom} dispatch={dispatch} />
        </div>
        <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', backgroundColor: 'transparent' }}>
          <div>Press E to build</div>
          <div>Focused: {fo && JSON.stringify(pick(fo, 'id', 'rotation', 'type'))}</div>
          <div>Circuit: {fo && JSON.stringify(formatCircuits(fo as CircuitObjectType))}</div>
          <button onClick={() => dispatch({ type: 'setState', path: 'view.zoom', value: 1 })}>Set zoom=1</button>
          <button onClick={() => dispatch({ type: 'stepCircuits' })}>Step circuits ⏭</button>
          <BrightnessSelector {...{ dispatch, state }} />
        </div>
        <SignalsDisplay
          state={state}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            maxHeight: 'calc(100vh - 40px)',
          }}
        />
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
        {io?.type === 'decider-combinator' && (
          <Dialog
            title="Decider Combinator"
            onClose={() => dispatch({ type: 'setState', path: 'game.inspectedObject', value: null })}
            body={
              <DCInspect
                obj={io as DCGameObjectType}
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
        {state.game.isToolbarOpen && (
          <Dialog
            title=""
            onClose={() => dispatch({ type: 'setState', path: 'game.isToolbarOpen', value: false })}
            body={<ToolbarDlg {...{ state, dispatch }} />}
          />
        )}
      </div>
    </KeyboardCapture>
  )
}

export default App

const formatCircuits = (obj: CircuitObjectType) => {
  if ('currentOutput' in obj) {
    return obj.currentOutput
  }
  if ('signals' in obj.circuit) {
    return Object.fromEntries(
      Object
        .entries(obj.circuit.signals)
        .map(([k, v]) => [k, v.amount])
    )
  }
}
