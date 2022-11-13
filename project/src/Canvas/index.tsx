import React, { Fragment, useCallback, useEffect, useRef } from "react"
import _ from 'lodash'
import constantCombinatorImg from 'assets/combinator/hr-constant-combinator.png'
import { objectSortCb } from "utils/objectSortCb"

const clampNumberTo = (n: number, clamp: number) => {
  return (n % clamp + clamp) % clamp
}

const getSvgCoords = (ev: React.MouseEvent | MouseEvent, svg: SVGSVGElement) => {
  const bcr = svg.getBoundingClientRect()
  return {
    x: ev.clientX - bcr.x,
    y: ev.clientY - bcr.y,
  }
}
const svgCoordsToGameCoords = (
  svgCoords: { x: number, y: number },
  { view }: GameState,
) => {
  return {
    x: (svgCoords.x - view.x) / view.zoom,
    y: (svgCoords.y - view.y) / view.zoom,
  }
}

const gameCoordsToSvgCoords = (
  gameCoords: { x: number, y: number },
  { view }: GameState,
) => {
  return {
    x: view.x + gameCoords.x * view.zoom,
    y: view.y + gameCoords.y * view.zoom,
  }
}

const VIEWBOX = { w: 600, h: 600 }
const GRID_SQUARE_SIZE = 40

interface CanvasProps {
  state: GameState
  onZoom: (specs: ZoomSpecs) => void
  dispatch: React.Dispatch<GameActions>
}

interface GameObjectProps {
  x: number
  y: number
  zoom: number
  gridSize: number
  gameObject: GameObjectType
}

const GameObject = ({ x, y, zoom, gridSize, gameObject }: GameObjectProps) => {
  const { sprite } = gameObject
  const spriteOffsetX = sprite.unit.width * gameObject.rotation
  return (
    <svg
      x={x + gameObject.x * zoom - gridSize * 3 / 8}
      y={y + gameObject.y * zoom - gridSize * 2 / 8}
      viewBox="0 0 114 102"
      width={gridSize * 1.775}
      height={gridSize * 1.625}
      preserveAspectRatio="none"
      onClick={console.log}
      className="game-object"
    >
      {/* <rect x={114} y={-6} stroke="red" strokeWidth={1} fill="none" width="100%" height="100%"></rect> */}
      <image transform={`translate(-${spriteOffsetX} 6)`} href={constantCombinatorImg} />
    </svg>
  )
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
  return (
    <div style={{ border: '1px solid red', display: 'inline-flex' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        style={{ width: VIEWBOX.w, height: VIEWBOX.h }}
        onMouseMove={(ev) => {
          const svgCoords = getSvgCoords(ev, ev.currentTarget)
          const { x, y } = svgCoordsToGameCoords(svgCoords, state)
          const obj = state.game.objects.find(obj => (
            obj.x <= x && x <= obj.x + GRID_SQUARE_SIZE &&
            obj.y <= y && y <= obj.y + GRID_SQUARE_SIZE
          ))
          if (obj?.id !== state.game.focusedObject) {
            dispatch({ type: 'hoverObject', objId: obj?.id })
          }
        }}
        onClick={ev => console.log(getSvgCoords(ev, ev.currentTarget))}
      >
        {state.view.isGridShown && <>
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
        {state.game.objects.sort(objectSortCb).map((obj, i) =>
          <GameObject
            key={i}
            x={x}
            y={y}
            gridSize={scaledGridSize}
            zoom={zoom}
            gameObject={obj}
          />
        )}
        {state.game.objects
          .filter(obj => obj.id === state.game.focusedObject)
          .map(obj => {
            const SQ_EXPAND = 10
            const len = (GRID_SQUARE_SIZE + SQ_EXPAND) * zoom / 3
            const anchor = gameCoordsToSvgCoords(obj, state)
            const d= [
              `M ${anchor.x - SQ_EXPAND / 2},${anchor.y - SQ_EXPAND / 2 + len}`,
              `v ${-len}`, `h ${len}`, `m ${len},0`,
              `h ${len}`, `v ${len}`, `m 0,${len}`,
              `v ${len}`, `h ${-len}`, `m ${-len},0`,
              `h ${-len}`, `v ${-len}`,
            ].join(' ')

            return <path key="focus" d={d} stroke="gold" strokeWidth={3} fill="none" />
          })
        }
      </svg>
    </div>
  )
}
