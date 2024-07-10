import deciderCombinatorImg from 'assets/combinator/hr-decider-combinator.png'
import iconUrl from 'assets/icons/Decider_combinator.png';
import { DEFAULT_BEHAVIOUR } from '../consts';
import { SignalBundle } from 'circuitProcessing';
import { ObjectFactory } from 'objectSpecs';

const transformSignals = (obj: { circuit: DCCircuitProps }, inputs: SignalBundle) => {
  const crc = obj.circuit
  if (!crc.leftSignal || !crc.oper || !crc.rightSignal || !crc.returnSignal) {
    return {}
  }

  const getAmount = (sgn: typeof crc.leftSignal) => {
    if (typeof sgn.amount === 'number') return sgn.amount

    return inputs[sgn.prototype] || 0
  }

  const leftAmount = getAmount(crc.leftSignal)
  const rightAmount = getAmount(crc.rightSignal)

  if (!OPER_MAP[crc.oper](leftAmount, rightAmount)) {
    return {}
  }

  return {
    [crc.returnSignal]: crc.returnMode === 'one'
      ? 1
      : crc.leftSignal.amount,
  }
}

const SPRITE: GameObjectType['sprite'] = {
  href: deciderCombinatorImg,
  unit: { w: 156, h: 132 },
  scale: 2,
  rotationOffset: [
    { x: -27, y: 5 },
    { x: -6, y: -8.5 },
  ],
  lcdOffsets: [
    { x: 10, y: 23 },
    { x: 32, y: -1 },
  ],
  knobs: [
    {
      rotations: [
        { red: { x: 8.5, y: 10 }, green: { x: 31, y: 10 } },
        { red: { x: 67, y: 1.5 }, green: {x: 67, y: 18} },
        { red: { x: 31, y: 57 }, green: {x: 8.5, y: 57} },
        { red: { x: 15, y: 18 }, green: { x: 15, y: 2 } }
      ]
    },
    {
      rotations: [
        { red: { x: 9, y: 54 }, green: { x: 30, y: 53 } },
        { red: { x: 10.5, y: 0 }, green: { x: 11, y: 18 } },
        { red: { x: 30, y: 12 }, green: { x: 9, y: 12 } },
        { red: { x: 71, y: 18 }, green: {x: 70, y: 0 } },
      ]
    },
  ]
}

const base = () => ({
  width: 1,
  height: 2,
  sprite: SPRITE,
  currentOutput: {} as SignalBundle,
  circuit: {
    leftSignal: null,
    oper: '>',
    rightSignal: { amount: 0 },
    returnSignal: null,
    returnMode: 'one',
  } as DCCircuitProps
})

export const deciderCombinator = {
  icon: iconUrl,
  placeable: {
    behaviour: {
      ...DEFAULT_BEHAVIOUR,
      displayArrows: true,
      transformSignals,
    },
    base,
  },
} as const

export type DCInputSignalType = 
  | { amount: number, prototype?: null }
  | { amount?: null, prototype: ToolType }
  | null

export type DCCircuitProps = {
  leftSignal?: DCInputSignalType
  oper: Operator
  rightSignal?: DCInputSignalType
  returnSignal?: ToolType | null
  returnMode: 'one' | 'input-count'
}

// export type DCGameObjectType = GameObjectType & ReturnType<typeof deciderCombinator['placeable']['base']>
export type DCGameObjectType = ReturnType<typeof ObjectFactory['decider-combinator']>

const OPER_MAP = {
  '>': (left: number, right: number) => left > right,
  '<': (left: number, right: number) => left < right,
  '>=': (left: number, right: number) => left >= right,
  '<=': (left: number, right: number) => left <= right,
  '=': (left: number, right: number) => left === right,
  '!=': (left: number, right: number) => left !== right,
} as const

type Operator = keyof typeof OPER_MAP
