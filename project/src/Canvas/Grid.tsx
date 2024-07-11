import _ from 'lodash'
import { clampNumberTo } from './mathUtils'
import { Fragment } from 'react'


export const Grid = ({
  scaledGridSize,
  viewbox,
  view,
}: {
  scaledGridSize: number
  viewbox: { w: number, h: number }
  view: GameState['view']
}) => {
  const { x, y, zoom } = view

  const minX = clampNumberTo(x, scaledGridSize)
  const countX = Math.trunc((viewbox.w - minX) / scaledGridSize) + 1
  const minY = clampNumberTo(y, scaledGridSize)
  const countY = Math.trunc((viewbox.h - minY) / scaledGridSize) + 1

  return <>
    <g className="grid-squares" style={{ filter: `brightness(${view.brightness})` }}>
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
    {view.isGridShown && (
      <g className="grid-lines" style={{ stroke: 'black', strokeWidth: .5, fontSize: 10, fontWeight: 100 }}>
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
    )}
  </>
}
