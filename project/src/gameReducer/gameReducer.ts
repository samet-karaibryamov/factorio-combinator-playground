import { ObjectFactory, PLACEABLE_OBJECT_SPECS, tagObject, WIRE_SPECS } from 'objectSpecs'
import { gameCoordsToClampedObjectCoords } from 'Canvas/mathUtils'
import { WireFactory } from 'Canvas/wireFactory'
import { ActionsMapType } from 'global'
import produce, { setAutoFreeze } from 'immer'
import { WritableDraft } from 'immer/dist/internal'
import _ from 'lodash'
import { keyHandler } from './keyHandler'
import { matchWires } from 'utils/matchWires'
import { stepCircuitState } from 'circuitProcessing'

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

const handleZoom = (dState: WritableDraft<GameState>, action: ActionsMapType['Zoom']) => {
  const { dz, svgX, svgY } = action
  const { view } = dState
  const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, dState.view.zoom + dz))

  const x = svgX - (svgX - view.x) * zoom / view.zoom
  const y = svgY - (svgY - view.y) * zoom / view.zoom

  view.x = x
  view.y = y
  view.zoom = zoom
}

const isIn = <T extends object,>(obj: T, item: any): item is keyof T => {
  return item in obj
}

const handleOnClick = (dState: WritableDraft<GameState>, action: ActionsMapType['OnClick']) => {
  const { game } = dState
  const { tool, focusedObject: fo } = game

  if (isIn(PLACEABLE_OBJECT_SPECS, tool)) {
    let { x, y } = gameCoordsToClampedObjectCoords(action.gameCoords)

    const obj = ObjectFactory[tool](x, y, game.toolRotation)
    dState.game.objects.push(obj)
    return
  }

  if (isIn(WIRE_SPECS, tool) && fo) {
    const liveWire = game.toolObject as WireObjectType
    const obj = game.objects.find(obj => obj.id === fo) as GameObjectType
    const knobIndex = PLACEABLE_OBJECT_SPECS[obj?.type].placeable.behaviour.getKnobIndex(obj, action.gameCoords)

    if (liveWire) {
      const trg0 = liveWire.targets[0]
      if (trg0.objectId === fo && trg0.knobIndex === knobIndex) return

      liveWire.targets.push({ objectId: fo, knobIndex })
      const existingIndex = game.wires.findIndex(w => matchWires(w, liveWire))
      if (existingIndex > -1) {
        game.wires.splice(existingIndex, 1)
        game.toolObject = null
        return
      }
      
      game.wires.push(liveWire)
    }
    game.toolObject = WireFactory({
      color: tool,
      targets: [{ objectId: fo, knobIndex }],
    })
    return
  }

  if (fo) {
    dState.game.inspectedObject = fo
  }
}

export const _gameReducer = (state: GameState, action: GameActions) => {
  if (action.type === 'step') {
    const newGameState = { ...state.view }
    const pan = PAN_PIXELS_PS * action.dt / 300

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
      case 'zoom': handleZoom(dState, action); return
      case 'onClick': handleOnClick(dState, action); return
      case 'stepCircuits': stepCircuitState(dState); return
      case 'updateObject': {
        const obj = dState.game.objects.find(obj => obj.id === action.partial.id)
        if (!obj) {
          console.error('Object not found!', action)
          break
        }
        Object.assign(obj, action.partial)
        break
      }
    }
  })
}

export const gameReducer: typeof _gameReducer = (state, action) => {
  const newState = _gameReducer(state, action)
  return newState
}