import { Fragment, useCallback, useEffect, useRef } from "react"
import _ from 'lodash'
import constantCombinatorImg from 'assets/combinator/hr-constant-combinator.png'

const clampNumberTo = (n: number, clamp: number) => {
  return (n % clamp + clamp) % clamp
}

const VIEWBOX = { w: 600, h: 600 }
const GRID_SQUARE_SIZE = 40

interface CanvasProps {
  state: GameState
  onZoom: (specs: ZoomSpecs) => void
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

export const Canvas = ({ state, onZoom }: CanvasProps) => {
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
    <div style={{ border: '1px solid red', display: 'inline-flex' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        style={{ width: VIEWBOX.w, height: VIEWBOX.h }}
      >
        <circle cx={x} cy={y} r={5 * zoom} fill="red" />
        <rect x={10} y={10} width={10} height={10} fill="green" style={{ backgroundImage: `url(${constantCombinatorImg})` }} />
        {/* <svg x={100} y={50} viewBox="0 0 114 102" width={114} height={102} onClick={console.log}>
          <image href={constantCombinatorImg} />
          <rect stroke="red" strokeWidth={5} width="100%" height="100%"></rect>
        </svg> */}
        {state.game.objects.map((obj, i) =>
          <GameObject
            key={i}
            x={x}
            y={y}
            gridSize={scaledGridSize}
            zoom={zoom}
            gameObject={obj}
          />
        )}
        {state.view.isGridShown &&
          <g style={{ stroke: 'black', strokeWidth: .5, fontSize: 10, fontWeight: 100 }}>
            {_.times(countX, (i) => {
              const xx = minX + i * scaledGridSize
              const label = Math.round((xx - x) / zoom)
              return (
                <Fragment key={i}>
                  <line x1={xx} y1={0} x2={xx} y2="100%" />
                  <text x={xx} y={0} dominantBaseline="text-before-edge">{label}</text>
                </Fragment>
              )
            })}
            {_.times(countY, (i) => {
              const yy = minY + i * scaledGridSize
              const label = Math.round((yy - y) / zoom)
              return (
                <Fragment key={label}>
                  <line x1={0} y1={yy} x2="100%" y2={yy} />
                  <text x={0} y={yy} dominantBaseline="text-before-edge">{label}</text>
                </Fragment>
              )
            })}
          </g>
        }
      </svg>
    </div>
  )
}
