import { gameCoordsToSvgCoords } from './utils'

export const Focus = ({
  scaledGridSize,
  state,
  obj,
}: {
  scaledGridSize: number
  state: GameState
  obj: GameObjectType
}) => {
  const { zoom } = state.view
  const SQ_EXPAND = 10 * zoom
  const len = (scaledGridSize + SQ_EXPAND) / 3
  const anchor = gameCoordsToSvgCoords(obj, state)
  const d= [
    `M ${anchor.x - SQ_EXPAND / 2},${anchor.y - SQ_EXPAND / 2 + len}`,
    `v ${-len}`, `h ${len}`, `m ${len},0`,
    `h ${len}`, `v ${len}`, `m 0,${len}`,
    `v ${len}`, `h ${-len}`, `m ${-len},0`,
    `h ${-len}`, `v ${-len}`,
  ].join(' ')

  return <path d={d} stroke="gold" strokeWidth={3 * zoom} fill="none" />
}