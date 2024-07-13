import React, { Fragment, useCallback, useEffect, useRef, useState } from "react"
import _ from 'lodash'
import { Focus } from './Focus'
import { GameObject } from './GameObject'
import { gameCoordsToClampedObjectCoords, getSvgCoords, svgCoordsToGameCoords } from './mathUtils'
import { ObjectFactory, PLACEABLE_OBJECT_SPECS } from 'objectSpecs'
import { GRID_SQUARE_SIZE } from 'consts'
import { Wire } from './Wire'
import { CenterCorssHair } from './CenterCorssHair'
import { Grid } from './Grid'


const GHOSTS = {
  'constant-combinator': ObjectFactory['constant-combinator'](0, 0, 0),
  'arithmetic-combinator': ObjectFactory['arithmetic-combinator'](0, 0, 0),
  'decider-combinator': ObjectFactory['decider-combinator'](0, 0, 0),
} as const

const useToolObject = (state: GameState, mouseXY: Coords) => {
  const { tool } = state.game
  const gc = svgCoordsToGameCoords(mouseXY, state)
  const oc = gameCoordsToClampedObjectCoords(gc)

  const ghost: GameObjectType | null = tool && tool in GHOSTS
    ? {
      // Fix after TS version is fixed
      ...GHOSTS[tool as unknown as keyof typeof GHOSTS],
      ...oc,
      rotation: state.game.toolRotation,
    }
    : null

  return { ghost }
}

interface CanvasProps {
  state: GameState
  onZoom: (specs: ZoomSpecs) => void
  dispatch: React.Dispatch<GameActions>
}
export const Canvas = ({ state, onZoom, dispatch }: CanvasProps) => {
  const {
    x,
    y,
    zoom,
    size: canvasSize,
  } = state.view
  const scaledGridSize = GRID_SQUARE_SIZE * zoom

  const svgRef = useRef<SVGSVGElement>(null)

  const mouseWheelHandler = useCallback((ev: WheelEvent) => {
    ev.preventDefault()
    if (svgRef.current) {
      const { x, y } = getSvgCoords(ev, ev.currentTarget as SVGSVGElement)
      onZoom({ dz: Math.sign(ev.deltaY) * 0.1, svgX: x, svgY: y })
    }
  }, [onZoom])

  useEffect(() => {
    if (svgRef.current) {
      const svg = svgRef.current
      svg.addEventListener('wheel', mouseWheelHandler, { passive: false })
      return () => { svg.removeEventListener('wheel', mouseWheelHandler) }
    }
  }, [svgRef.current, mouseWheelHandler])

  const [mouseXY, setMouseXY] = useState<Coords>({ x: 0, y: 0 })
  const { ghost } = useToolObject(state, mouseXY)

  return (
    <div style={{ border: '1px solid red', display: 'inline-flex' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${canvasSize.w} ${canvasSize.h}`}
        style={{ width: canvasSize.w, height: canvasSize.h }}
        onMouseMove={(ev) => {
          const svgCoords = getSvgCoords(ev, ev.currentTarget)

          setMouseXY(svgCoords)

          // FOCUS OBJECT
          const gameCoords = svgCoordsToGameCoords(svgCoords, state)
          const obj = state.game.objects.find(obj => PLACEABLE_OBJECT_SPECS[obj.type].placeable.behaviour.checkHit(obj, gameCoords))
          if (obj?.id !== state.game.focusedObject && !ghost) {
            dispatch({ type: 'hoverObject', objId: obj?.id })
          }
        }}
        onClick={ev => {
          const svgCoords = getSvgCoords(ev, ev.currentTarget)
          const gameCoords = svgCoordsToGameCoords(svgCoords, state)
          dispatch({ type: 'onClick', gameCoords })
        }}
      >
        <Grid
          scaledGridSize={scaledGridSize}
          view={state.view}
          viewbox={canvasSize}
        />
        <CenterCorssHair {...{ x, y, zoom }} />
        <g className="game-objects">
          {_.sortBy(state.game.objects, (obj) => obj.y).map((obj, i) =>
            <GameObject
              key={i}
              gridSize={scaledGridSize}
              view={state.view}
              gameObject={obj}
            />
          )}
        </g>
        <g className="wires">
          {state.game.wires.map(w =>
            <Wire
              key={w.id}
              wire={w}
              state={state}
            />
          )}
        </g>
        <g className="focus">
          {state.game.objects
            .filter(obj => obj.id === state.game.focusedObject)
            .map(obj => <Focus key="focus" {...{ scaledGridSize, state, obj }} />)
          }
        </g>
        {ghost && (
          <GameObject
            view={state.view}
            gameObject={ghost}
            gridSize={scaledGridSize}
            type="tool"
          />
        )}
        {state.game.toolObject && (
          <Wire
            wire={state.game.toolObject}
            state={state}
            mouseCoords={mouseXY}
          />
        )}
      </svg>
    </div>
  )
}
