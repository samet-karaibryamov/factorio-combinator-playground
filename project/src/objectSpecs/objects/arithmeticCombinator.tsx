import arithmeticCombinatorImg from 'assets/combinator/hr-arithmetic-combinator.png'
import iconUrl from 'assets/icons/Arithmetic_combinator.png';
import { DEFAULT_BEHAVIOUR } from '../consts';
import { SignalBundle } from 'circuitProcessing';
import { ObjectFactory } from 'objectSpecs';

const transformSignals = (obj: { circuit: ACCircuitProps }, inputs: SignalBundle) => {
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

  return { [crc.returnSignal]: OPER_MAP[crc.oper](leftAmount, rightAmount) }
}

const SPRITE: GameObjectType['sprite'] = {
  href: arithmeticCombinatorImg,
  unit: { w: 144, h: 124 },
  scale: 2,
  rotationOffset: [
    { x: -23, y: 10 },
    { x: -4, y: -8.5 },
  ],
  lcdOffsets: [
    { x: 14, y: 27 },
    { x: 33, y: 1 },
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

const base = () => ({
  width: 1,
  height: 2,
  sprite: SPRITE,
  currentOutput: {} as SignalBundle,
  currentInput: { red: {} as SignalBundle, green: {} as SignalBundle },
  circuit: {
    leftSignal: null,
    oper: '+',
    rightSignal: null,
    returnSignal: null,
  } as ACCircuitProps
})

export const arithmeticCombinator = {
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


export type ACInputSignalType = 
  | { amount: number, prototype?: null }
  | { amount?: null, prototype: ToolType }
  | null

export type ACCircuitProps = {
  leftSignal?: ACInputSignalType | null
  oper: Operator
  rightSignal?: ACInputSignalType | null
  returnSignal?: ToolType | null
}

// export type ACGameObjectType = GameObjectType & ReturnType<typeof base>
export type ACGameObjectType = ReturnType<typeof ObjectFactory['arithmetic-combinator']>

const OPER_MAP = {
  '+': (left: number, right: number) => left + right,
  '-': (left: number, right: number) => left - right,
  '*': (left: number, right: number) => left * right,
  '/': (left: number, right: number) => left / right,
  '%': (left: number, right: number) => left % right,
  '**': (left: number, right: number) => left ** right,
  '<<': (left: number, right: number) => left << right,
  '>>': (left: number, right: number) => left >> right,
  '&': (left: number, right: number) => left & right,
  '|': (left: number, right: number) => left | right,
  '^': (left: number, right: number) => left ^ right,
} as const

type Operator = keyof typeof OPER_MAP
