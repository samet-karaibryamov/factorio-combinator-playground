import React, { Fragment, useCallback, useEffect, useRef, useState } from "react"
import _ from 'lodash'
import { Focus } from './Focus'
import { GameObject } from './GameObject'
import { clampNumberTo, gameCoordsToClampedObjectCoords, getSvgCoords, svgCoordsToGameCoords } from './mathUtils'
import { ObjectFactory, PLACEABLE_OBJECT_SPECS } from 'objectSpecs'
import { GRID_SQUARE_SIZE } from 'consts'
import { Wire } from './Wire'
import { CenterCorssHair } from './CenterCorssHair'


const VIEWBOX = { w: 600, h: 600 }

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
  } = state.view
  const scaledGridSize = GRID_SQUARE_SIZE * zoom
  const minX = clampNumberTo(x, scaledGridSize)
  const countX = Math.trunc((VIEWBOX.w - minX) / scaledGridSize) + 1
  const minY = clampNumberTo(y, scaledGridSize)
  const countY = Math.trunc((VIEWBOX.h - minY) / scaledGridSize) + 1

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
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        style={{ width: VIEWBOX.w, height: VIEWBOX.h }}
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
          // if (ghost) {
          //   dispatch({ type: 'placeObject', instance: ghost })
          // }
          const svgCoords = getSvgCoords(ev, ev.currentTarget)
          const gameCoords = svgCoordsToGameCoords(svgCoords, state)
          dispatch({ type: 'onClick', gameCoords })
        }}
      >
        <g>
          <rect x="0" y="0" width="100%" height="100%" fill="#313031"></rect>
          {_.times(countX + 1, (ix) => {
            const xx = minX + (ix - 1) * scaledGridSize

            return _.times(countY + 1, (iy) => {
              const yy = minY + (iy - 1) * scaledGridSize
              const ox = clampNumberTo(Math.round((xx - x) / scaledGridSize), 2)
              const oy = clampNumberTo(Math.round((yy - y) / scaledGridSize), 2)
              if (ox === oy) return null

              return (
                <rect
                  key={`${ix}:${iy}`}
                  x={xx}
                  y={yy}
                  width={scaledGridSize}
                  height={scaledGridSize}
                  fill="#1b1b1b"
                />
              )
            })
          })}
        </g>
        {state.view.isGridShown && <>
          <g style={{ stroke: 'black', strokeWidth: .5, fontSize: 10, fontWeight: 100 }}>
            {_.times(countX, (i) => {
              const xx = minX + i * scaledGridSize
              const label = Math.round((xx - x) / zoom)
              return (
                <Fragment key={i}>
                  <line x1={xx} y1={0} x2={xx} y2="100%" />
                  <text x={xx} y={0} dominantBaseline="text-before-edge" stroke="white">{label}</text>
                </Fragment>
              )
            })}
            {_.times(countY, (i) => {
              const yy = minY + i * scaledGridSize
              const label = Math.round((yy - y) / zoom)
              return (
                <Fragment key={label}>
                  <line x1={0} y1={yy} x2="100%" y2={yy} />
                  <text x={0} y={yy} dominantBaseline="text-before-edge" stroke="white">{label}</text>
                </Fragment>
              )
            })}
          </g>
        </>}
        <CenterCorssHair {...{ x, y, zoom }} />
        {_.sortBy(state.game.objects, (obj) => obj.y).map((obj, i) =>
          <GameObject
            key={i}
            gridSize={scaledGridSize}
            view={state.view}
            gameObject={obj}
          />
        )}
        {state.game.wires.map(w =>
          <Wire
            key={w.id}
            wire={w}
            state={state}
          />
        )}
        {state.game.objects
          .filter(obj => obj.id === state.game.focusedObject)
          .map(obj => <Focus key="focus" {...{ scaledGridSize, state, obj }} />)
        }
        {!ghost
          ? null
          : (
            <GameObject
              view={state.view}
              gameObject={ghost}
              gridSize={scaledGridSize}
              type="tool"
            />
          )
        }
        {state.game.toolObject
          ? (
            <Wire
              wire={state.game.toolObject as WireObjectType}
              state={state}
              mouseCoords={mouseXY}
            />
          )
          : null
        }
      </svg>
    </div>
  )
}
