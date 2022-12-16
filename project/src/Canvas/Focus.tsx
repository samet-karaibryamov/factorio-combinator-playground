import { gameCoordsToSvgCoords } from './mathUtils'

const getDimensions = (
  obj: GameObjectType,
  scaledGridSize: number,
  sqExpand: number,
) => {
  const [hor, ver] = obj.rotation % 2
    ? [obj.height, obj.width]
    : [obj.width, obj.height]

  return {
    hor: (hor * scaledGridSize + sqExpand) / 3,
    ver: (ver * scaledGridSize + sqExpand) / 3,
  }
}

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
  const anchor = gameCoordsToSvgCoords(obj, state)
  const { hor, ver } = getDimensions(obj, scaledGridSize, SQ_EXPAND)
  const d= [
    `M ${anchor.x - SQ_EXPAND / 2},${anchor.y - SQ_EXPAND / 2 + ver}`,
    `v ${-ver}`, `h ${hor}`, `m ${hor},0`,
    `h ${hor}`, `v ${ver}`, `m 0,${ver}`,
    `v ${ver}`, `h ${-hor}`, `m ${-hor},0`,
    `h ${-hor}`, `v ${-ver}`,
  ].join(' ')

  return <path d={d} stroke="gold" strokeWidth={3 * zoom} fill="none" />
}