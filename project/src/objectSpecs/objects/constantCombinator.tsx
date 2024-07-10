import constantCombinatorImg from 'assets/combinator/hr-constant-combinator.png'
import iconUrl from 'assets/icons/Constant_combinator.png';
import { SignalGridType } from 'components/SignalGrid';
import { DEFAULT_BEHAVIOUR } from '../consts';

const SPRITE: GameObjectType['sprite'] = {
  href: constantCombinatorImg,
  unit: { w: 114, h: 102 },
  scale: 1.6,
  rotationOffset: [{ x: -15.5, y: -6 }],
  knobs: [{
    rotations: [
      { red: { x: 10, y: 0 }, green: { x: 29, y: -2.5 } },
      { red: { x: 40, y: 0 }, green: { x: 40, y: 15 } },
      { red: { x: 32, y: 30 }, green: { x: 12.5, y: 29 } },
      { red: { x: 0, y: 19 }, green: { x: 1, y: 2 } },
    ]
  }]
}
export const constantCombinator = {
  icon: iconUrl,
  placeable: {
    behaviour: DEFAULT_BEHAVIOUR,
    base: () => ({
      width: 1,
      height: 1,
      sprite: SPRITE,
      circuit: {
        signals: {},
      } as CCCircuitProps
    }),
  },
} as const

export type CCCircuitProps = {
  signals: SignalGridType
}

export type CCGameObjectType = GameObjectType & ReturnType<typeof constantCombinator['placeable']['base']>
