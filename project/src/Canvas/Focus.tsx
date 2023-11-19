import { PLACEABLE_OBJECT_SPECS } from 'objectSpecs'
import { gameCoordsToSvgCoords } from './mathUtils'

const getDimensions = (
  obj: GameObjectType,
  scaledGridSize: number,
) => {
  const [hor, ver] = obj.rotation % 2
    ? [obj.height, obj.width]
    : [obj.width, obj.height]

  return {
    w: hor * scaledGridSize,
    h: ver * scaledGridSize,
  }
}

const outlinePath = (
  anchor: Coords,
  { w, h }: ReturnType<typeof getDimensions>,
  zoom: number
) => {
  const SQ_EXPAND = 10 * zoom
  const hor = (w + SQ_EXPAND) / 3
  const ver = (h + SQ_EXPAND) / 3

  const d = [
    `M ${anchor.x - SQ_EXPAND / 2},${anchor.y - SQ_EXPAND / 2 + ver}`,
    `v ${-ver}`, `h ${hor}`, `m ${hor},0`,
    `h ${hor}`, `v ${ver}`, `m 0,${ver}`,
    `v ${ver}`, `h ${-hor}`, `m ${-hor},0`,
    `h ${-hor}`, `v ${-ver}`,
  ].join(' ')

  return d
}

const renderOrientation = (
  anchor: Coords,
  scaledGridSize: number,
  obj: GameObjectType,
  { w, h }: ReturnType<typeof getDimensions>,
) => {
  const sgs = scaledGridSize
  const d = [
    `M ${0},${-scaledGridSize}`,
    `l ${sgs / 4},${sgs / 4}`,
    `h ${-sgs / 2},${0}`,
    // `l ${sgs / 4},${-sgs / 4}`,
    'Z',
    `M ${0},${scaledGridSize - sgs / 4}`,
    `l ${sgs / 4},${sgs / 4}`,
    `h ${-sgs / 2},${0}`,
    // `l ${sgs / 4},${-sgs / 4}`,
    'Z',
  ].join(' ')

  const transform = [
    `translate(${anchor.x + w / 2} ${anchor.y + h / 2})`,
    `rotate(${90 * obj.rotation})`,
  ].join(' ')
  return <path d={d} stroke="none" fill="gold" transform={transform} />
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

  const anchor = gameCoordsToSvgCoords(obj, state)
  const objSize = getDimensions(obj, scaledGridSize)

  const d = outlinePath(anchor, objSize, zoom)
  const { displayArrows } = PLACEABLE_OBJECT_SPECS[obj.type].placeable.behaviour

  return <>
    <path d={d} stroke="gold" strokeWidth={3 * zoom} fill="none" />
    {displayArrows && renderOrientation(anchor, scaledGridSize, obj, objSize)}
  </>
}