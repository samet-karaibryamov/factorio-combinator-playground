import arithmeticCombinatorImg from 'assets/combinator/hr-arithmetic-combinator.png'
import iconUrl from 'assets/icons/Arithmetic_combinator.png';
import { DEFAULT_BEHAVIOUR } from '../consts';

const SPRITE: GameObjectType['sprite'] = {
  href: arithmeticCombinatorImg,
  unit: { w: 144, h: 124 },
  scale: 1.9,
  rotationOffset: [
    { x: -23, y: 10 },
    { x: -4, y: -8.5 },
  ],
  knobs: [
    {
      rotations: [
        { red: { x: 9.5, y: 11 }, green: { x: 32, y: 11.5 } },
        { red: { x: 68, y: 4 }, green: { x: 67, y: 21 } },
        { red: { x: 32.5, y: 57 }, green: { x: 9, y: 58 } },
        { red: { x: 12, y: 21 }, green: { x: 12, y: 5 } },
      ]
    },
    {
      rotations: [
        { red: { x: 10, y: 55 }, green: { x: 32, y: 55.5 } },
        { red: { x: 8, y: 2 }, green: { x: 8, y: 18 } },
        { red: { x: 32, y: 12 }, green: {x: 9.5, y: 11} },
        { red: { x: 71, y: 19 }, green: { x: 71, y: 2 } }
      ]
    },
  ]
}

export const arithmeticCombinator = {
  icon: iconUrl,
  placeable: {
    behaviour: {
      ...DEFAULT_BEHAVIOUR,
      displayArrows: true,
    } as typeof DEFAULT_BEHAVIOUR,
    base: () => ({
      width: 1,
      height: 2,
      sprite: SPRITE,
      circuit: {
        leftSignal: null,
        oper: '+',
        rightSignal: null,
        returnSignal: null,
      } as ACCircuitProps
    }),
  },
} as const


export type ACInputSignalType = 
  | { amount: number, prototype?: ToolType | null }
  | { amount?: number | null, prototype: ToolType }
  | null

export type ACCircuitProps = {
  leftSignal?: ACInputSignalType
  oper: string
  rightSignal?: ACInputSignalType
  returnSignal?: ToolType | null
}

export type ACGameObjectType = GameObjectType & { circuit: ACCircuitProps }
