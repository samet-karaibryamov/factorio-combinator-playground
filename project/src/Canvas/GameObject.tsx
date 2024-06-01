import combinatorDisplaysImg from 'assets/combinator/hr-combinator-displays.png'
import { GRID_SQUARE_SIZE } from 'consts'
import { DCGameObjectType } from 'objectSpecs/objects/deciderCombinator'

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

  const { lcdOffsets } = sprite

  return <>
    <svg
      x={x + (gameObject.x + rotationOffset.x) * zoom}
      y={y + (gameObject.y + rotationOffset.y) * zoom}
      viewBox={`0 0 ${sprite.unit.w} ${sprite.unit.h}`}
      width={gridSize * sprite.scale * ratio}
      height={gridSize * sprite.scale}
      preserveAspectRatio="none"
      className="game-object"
      style={type === 'tool' ? { filter: 'hue-rotate(90deg)' } : {}}
    >
      <image transform={`translate(${spriteOffsetX} 0)`} href={gameObject.sprite.href} />
    </svg>
    {lcdOffsets && (
      <LCD
        {...{
          gameObject,
          gridSize,
          view,
          lcdOffsets,
        }}
      />
    )}
  </>
}

const LCD = ({
  lcdOffsets,
  gameObject,
  gridSize,
  view,
}: {
  lcdOffsets: Exclude<GameObjectType['sprite']['lcdOffsets'], undefined>
  gameObject: GameObjectType
  gridSize: number
  view: GameState['view']
}) => {
  if (!lcdOffsets) return null

  const { x, y, zoom } = view

  const ro = gameObject.rotation
  const lcdOffset = lcdOffsets[ro] || lcdOffsets[ro % 2] || lcdOffsets[0]
  const lcdScale = 18 / GRID_SQUARE_SIZE
  const lcdAspectRatio = 22 / 30

  const oper = (gameObject as DCGameObjectType).circuit.oper
  const [col, row] = LCD_MAP[oper] || [0, 0]

  return (
    <svg
      x={x + (gameObject.x + lcdOffset.x) * zoom}
      y={y + (gameObject.y + lcdOffset.y) * zoom}
      viewBox={`0 0 30 22`}
      width={gridSize * lcdScale}
      height={gridSize * lcdScale * lcdAspectRatio}
      preserveAspectRatio="none"
    >
      <image transform={`translate(${-30 * col} ${-22 * row})`} href={combinatorDisplaysImg} />
    </svg>
  )
}

const LCD_MAP: Record<string, readonly [number, number]> = {
  '+': [1, 0],
  '-': [2, 0],
  '*': [3, 0],
  '/': [4, 0],
  '%': [5, 0],
  '^': [0, 1],
  '<<': [1, 1],
  '>>': [2, 1],
  '&': [3, 1],
  '|': [4, 1],
  '^^': [5, 1],
  '>': [0, 2],
  '<': [1, 2],
  '=': [2, 2],
  '!=': [3, 2],
  '<=': [4, 2],
  '>=': [5, 2],
} as const
