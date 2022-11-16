import constantCombinatorImg from 'assets/combinator/hr-constant-combinator.png'

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
  const spriteOffsetX = sprite.unit.width * gameObject.rotation
  const { x, y, zoom } = view
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
      style={type === 'tool' ? { filter: 'hue-rotate(90deg)' } : {}}
    >
      {/* <rect x={114} y={-6} stroke="red" strokeWidth={1} fill="none" width="100%" height="100%"></rect> */}
      <image transform={`translate(-${spriteOffsetX} 6)`} href={constantCombinatorImg} />
    </svg>
  )
}