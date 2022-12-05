import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react"
import _ from 'lodash'
import { Focus } from './Focus'
import { GameObject } from './GameObject'
import { clampNumberTo, getSvgCoords, svgCoordsToGameCoords } from './utils'
import { ObjectFactory, ObjectTypeSpecs } from './objectsSprites'
import { GRID_SQUARE_SIZE } from 'consts'


const VIEWBOX = { w: 600, h: 600 }

const GHOSTS = {
  cc: ObjectFactory.CC(0, 0, 0),
  ac: ObjectFactory.AC(0, 0, 0),
  dc: ObjectFactory.DC(0, 0, 0),
} as const

const useToolObject = (state: GameState) => {
  const [ghostXY, setGhostXY] = useState({ x: 0, y: 0 })

  const { tool } = state.game
  const gc = svgCoordsToGameCoords(ghostXY, state)
  gc.x = Math.floor(gc.x / GRID_SQUARE_SIZE) * GRID_SQUARE_SIZE
  gc.y = Math.floor(gc.y / GRID_SQUARE_SIZE) * GRID_SQUARE_SIZE
  const ghost = tool && tool in GHOSTS
    ? {
      // Fix after TS version is fixed
      ...GHOSTS[tool as unknown as keyof typeof GHOSTS],
      ...gc,
      rotation: state.game.toolRotation,
    }
    : null

  return { ghost, setGhostXY }
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

  const { ghost, setGhostXY } = useToolObject(state)

  return (
    <div style={{ border: '1px solid red', display: 'inline-flex' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        style={{ width: VIEWBOX.w, height: VIEWBOX.h }}
        onMouseMove={(ev) => {
          const svgCoords = getSvgCoords(ev, ev.currentTarget)

          setGhostXY(svgCoords)

          // FOCUS OBJECT
          const { x, y } = svgCoordsToGameCoords(svgCoords, state)
          const obj = state.game.objects.find(obj => {
            const bbox = ObjectTypeSpecs[obj.type].getBBox(obj)
            return (
              bbox.left <= x && x <= bbox.right &&
              bbox.top <= y && y <= bbox.bottom
            )
          })
          if (obj?.id !== state.game.focusedObject && !ghost) {
            dispatch({ type: 'hoverObject', objId: obj?.id })
          }
        }}
        onClick={ev => {
          console.log(getSvgCoords(ev, ev.currentTarget))

          if (ghost) {
            dispatch({ type: 'placeObject', instance: ghost })
          }
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
        <circle cx={x} cy={y} r={5 * zoom} fill="red" />
        {_.sortBy(state.game.objects, (obj) => obj.y).map((obj, i) =>
          <GameObject
            key={i}
            gridSize={scaledGridSize}
            view={state.view}
            gameObject={obj}
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
      </svg>
    </div>
  )
}
