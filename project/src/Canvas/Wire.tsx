import { gameCoordsToSvgCoords } from './mathUtils'

const calcArcTip = (p1: Coords, p2: Coords): Coords => {
  const AMPLITUDE_COEF = 0.2
  const AB = {
    x: p1.x - p2.x,
    y: p1.y - p2.y,
  }
  const d = Math.sqrt(AB.x * AB.x + AB.y * AB.y)

  const C = {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  }
  
  const N = {
    x: -AB.y / d,
    y: AB.x / d,
  }

  const coef = AB.x * AMPLITUDE_COEF
  const H = {
    x: C.x + N.x * coef,
    y: C.y + N.y * coef,
  }
  return H
}

export const Wire = ({
  wire,
  state,
  mouseCoords,
}: {
  wire: WireObjectType
  state: GameState
  mouseCoords?: Coords
}) => {
  const colorName = wire.color === 'red-wire' ? 'red' : 'green'
  const anchors = wire.targets.map(t => {
    const obj = state.game.objects.find(obj => obj.id === t.objectId)
    if (!obj) return { x: 0, y: 0 }

    const knob = obj.sprite.knobs[t.knobIndex].rotations[obj.rotation][colorName]
    const knobCoords = {
      x: obj.x + knob.x,
      y: obj.y + knob.y,
    }
    return gameCoordsToSvgCoords(knobCoords, state)
  })

  if (!anchors[1]) anchors.push(mouseCoords as Coords)

  const arcTip = calcArcTip(anchors[0], anchors[1])
  const d = `M${anchors[0].x},${anchors[0].y} Q${arcTip.x},${arcTip.y} ${anchors[1].x},${anchors[1].y}`
  return <path d={d} fill="none" stroke={colorName} />
}
