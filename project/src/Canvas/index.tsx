import { Fragment, useCallback, useEffect, useRef } from "react"
import _, { times } from 'lodash'

const clampNumberTo = (n: number, clamp: number) => {
  return (n % clamp + clamp) % clamp
}

const VIEWBOX = { w: 600, h: 600 }
const GRID_SQUARE_SIZE = 40

interface CanvasProps {
  state: GameState
  onZoom: (specs: ZoomSpecs) => void
}

export const Canvas = ({ state, onZoom }: CanvasProps) => {
  const {
    x,
    y,
    zoom,
  } = state.game
  const scaledGridSize = GRID_SQUARE_SIZE * zoom
  const minX = clampNumberTo(x, scaledGridSize)
  const countX = Math.trunc((VIEWBOX.w - minX) / scaledGridSize) + 1
  const minY = clampNumberTo(y, scaledGridSize)
  const countY = Math.trunc((VIEWBOX.h - minY) / scaledGridSize) + 1

  const svgRef = useRef<SVGSVGElement>(null)
  const mouseWheelHandler = useCallback((ev: WheelEvent) => {
    ev.preventDefault()
    console.log(ev.deltaY, ev.deltaMode)
    if (svgRef.current) {
      const bcr = svgRef.current.getBoundingClientRect()
      const xx = ev.clientX - bcr.x
      const yy = ev.clientY - bcr.y
      onZoom({ dz: Math.sign(ev.deltaY) * 0.1, svgX: xx, svgY: yy })
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
    <div style={{ border: '1px solid red', display: 'inline-block' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        style={{ width: VIEWBOX.w, height: VIEWBOX.h }}
      >
        <circle cx={x} cy={y} r={5 * zoom} fill="red" />
        <g style={{ stroke: 'black', strokeWidth: .5, fontSize: 10, fontWeight: 100 }}>
          {_.times(countX, (i) => {
            const xx = minX + i * scaledGridSize
            return (
              <Fragment key={i}>
                <line x1={xx} y1={0} x2={xx} y2="100%" />
                <text x={xx} y={0} dominantBaseline="text-before-edge">{Math.round((xx - x) / zoom)}</text>
              </Fragment>
            )
          })}
          {_.times(countY, (i) => {
            const yy = minY + i * scaledGridSize
            return (
              <Fragment key={i}>
                <line x1={0} y1={yy} x2="100%" y2={yy} />
                <text x={0} y={yy} dominantBaseline="text-before-edge">{Math.round((yy - y) / zoom)}</text>
              </Fragment>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
