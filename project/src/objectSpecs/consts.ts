import { GRID_SQUARE_SIZE } from 'consts'

const getBBox = (obj: GameObjectType) => {
  const [hor, ver] = obj.rotation % 2
    ? [obj.height, obj.width]
    : [obj.width, obj.height]

  const left = obj.x
  const top = obj.y
  const w = hor * GRID_SQUARE_SIZE
  const h = ver * GRID_SQUARE_SIZE

  return { left, top, right: left + w, bottom: top + h, w, h }
}

const checkHit = (obj: GameObjectType, { x, y }: Coords) => {
  const bbox = getBBox(obj)
  return (
    bbox.left <= x && x <= bbox.right &&
    bbox.top <= y && y <= bbox.bottom
  )
}

const getCombinatorKnobClickBoxes = (obj: GameObjectType) => {

  const [dirX, dirY] = obj.rotation % 2 ? [1, 0] : [0, 1]
  const isInverted = [1, 2].includes(obj.rotation)
  const { knobs } = obj.sprite
  const clickBoxes = knobs.map((k, i) => {
    const offset = isInverted ? knobs.length - i - 1 : i
    const left = obj.x + offset * dirX * GRID_SQUARE_SIZE
    const top = obj.y + offset * dirY * GRID_SQUARE_SIZE
    const w = GRID_SQUARE_SIZE
    const h = GRID_SQUARE_SIZE

    return { left, top, right: left + w, bottom: top + h, w, h }
  })
  return clickBoxes
}

const getCombinatorKnobIndex = (obj: GameObjectType, gameCoord: Coords) => {
  const { x, y } = gameCoord
  return getCombinatorKnobClickBoxes(obj).findIndex(cbox => {
    return (
      cbox.left <= x && x <= cbox.right
      && cbox.top <= y && y <= cbox.bottom
    )
  })
}

export const DEFAULT_BEHAVIOUR = {
  getBBox,
  checkHit,
  getKnobClickBoxes: getCombinatorKnobClickBoxes,
  getKnobIndex: getCombinatorKnobIndex,
}