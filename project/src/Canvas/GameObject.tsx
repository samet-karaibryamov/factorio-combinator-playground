
export const GameObject = ({
  view,
  gridSize,
  gameObject,
  type,
}: {
  view: GameState['view']
  gridSize: number
  gameObject: GameObjectType
  type?: 'normal' | 'ghost' | 'tool'
}) => {
  const { sprite } = gameObject
  const ratio = sprite.unit.w / sprite.unit.h
  const ro = gameObject.rotation
  const roff = sprite.rotationOffset
  const rotationOffset = roff[ro] || roff[ro % 2] || roff[0]
  const spriteOffsetX = -sprite.unit.w * ro

  const { x, y, zoom } = view
  return (
    <svg
      x={x + (gameObject.x + rotationOffset.x) * zoom}
      y={y + (gameObject.y + rotationOffset.y) * zoom}
      viewBox={`0 0 ${sprite.unit.w} ${sprite.unit.h}`}
      width={gridSize * sprite.scale * ratio}
      height={gridSize * sprite.scale}
      preserveAspectRatio="none"
      onClick={console.log}
      className="game-object"
      style={type === 'tool' ? { filter: 'hue-rotate(90deg)' } : {}}
    >
      {/* <rect x={0} y={0} stroke="red" strokeWidth={1} fill="none" width="100%" height="100%"></rect> */}
      <image transform={`translate(${spriteOffsetX} 0)`} href={gameObject.sprite.href} />
    </svg>
  )
}