import deciderCombinatorImg from 'assets/combinator/hr-decider-combinator.png'
import iconUrl from 'assets/icons/Decider_combinator.png';
import { DEFAULT_BEHAVIOUR } from '../consts';

const SPRITE: GameObjectType['sprite'] = {
  href: deciderCombinatorImg,
  unit: { w: 156, h: 132 },
  scale: 2,
  rotationOffset: [
    { x: -27, y: 5 },
    { x: -6, y: -8.5 },
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
    }
  ]
}

export const deciderCombinator = {
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
    }),
  },
} as const
