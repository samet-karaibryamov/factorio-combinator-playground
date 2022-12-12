import { gameCoordsToSvgCoords } from './utils'

export const Wire = ({
  wire,
  state,
}: {
  wire: WireObjectType
  state: GameState
}) => {
  const colorName = wire.color === 'rw' ? 'red' : 'green'
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
  const d = `M${anchors[0].x},${anchors[0].y} L${anchors[1].x},${anchors[1].y}`
  return <path d={d} fill="none" stroke={colorName} />
}
