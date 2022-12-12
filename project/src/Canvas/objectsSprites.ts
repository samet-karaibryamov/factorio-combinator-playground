import constantCombinatorImg from '../assets/combinator/hr-constant-combinator.png'
import arithmeticCombinatorImg from '../assets/combinator/hr-arithmetic-combinator.png'
import deciderCombinatorImg from '../assets/combinator/hr-decider-combinator.png'
import { GRID_SQUARE_SIZE } from 'consts'

type ObjectCreator = (x: number, y: number, r: ObjectRotation) => GameObjectType

const objectConstrainer = <T>(obj: { [k in keyof T]: ObjectCreator }) => obj

let objId = 0
export const tagObject = (partialObj: Omit<GameObjectType, 'id'>) => ({
  ...partialObj,
  id: String(objId++),
} as GameObjectType)

const acSprite: GameObjectType['sprite'] = {
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
        { red: { x: 9.5, y: 11 }, green: { x: 0, y: 0 } },
        { red: { x: 68, y: 4 }, green: { x: 0, y: 0 } },
        { red: { x: 32.5, y: 57 }, green: { x: 0, y: 0 } },
        { red: { x: 12, y: 21 }, green: { x: 0, y: 0 } },
      ]
    },
    {
      rotations: [
        { red: { x: 10, y: 55 }, green: { x: 0, y: 0 } },
        { red: { x: 8, y: 2 }, green: { x: 0, y: 0 } },
        { red: { x: 32, y: 12 }, green: { x: 0, y: 0 } },
        { red: { x: 71, y: 19 }, green: { x: 0, y: 0 } }
      ]
    },
  ]
}
const dcSprite: GameObjectType['sprite'] = {
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
        { red: { x: 8.5, y: 10 }, green: { x: 0, y: 0 } },
        { red: { x: 67, y: 1.5 }, green: { x: 0, y: 0 } },
        { red: { x: 31, y: 57 }, green: { x: 0, y: 0 } },
        { red: { x: 15, y: 18 }, green: { x: 0, y: 0 } }
      ]
    },
    {
      rotations: [
        { red: { x: 9, y: 54 }, green: { x: 0, y: 0 } },
        { red: { x: 10.5, y: 0 }, green: { x: 0, y: 0 } },
        { red: { x: 30, y: 12 }, green: { x: 0, y: 0 } },
        { red: { x: 71, y: 18 }, green: { x: 0, y: 0 } }
      ]
    }
  ]
}
const ccSprite: GameObjectType['sprite'] = {
  href: constantCombinatorImg,
  unit: { w: 114, h: 102 },
  scale: 1.6,
  rotationOffset: [{ x: -15.5, y: -6 }],
  knobs: [{
    rotations: [
      { red: { x: 10, y: 0 }, green: { x: 0, y: 0 } },
      { red: { x: 40, y: 0 }, green: { x: 0, y: 0 } },
      { red: { x: 32, y: 30 }, green: { x: 0, y: 0 } },
      { red: { x: 0, y: 19 }, green: { x: 0, y: 0 } }
    ]
  }]
}

// window.acSprite = acSprite
// window.dcSprite = dcSprite
// window.ccSprite = ccSprite

export const ObjectFactory = objectConstrainer({
  CC: (x, y, r) => tagObject({
    x,
    y,
    rotation: r,
    type: 'cc',
    width: 1,
    height: 1,
    sprite: ccSprite,
  }),
  AC: (x, y, r) => tagObject({
    x,
    y,
    rotation: r,
    type: 'ac',
    width: 1,
    height: 2,
    sprite: acSprite,
  }),
  DC: (x, y, r) => tagObject({
    x,
    y,
    rotation: r,
    type: 'dc',
    width: 1,
    height: 2,
    sprite: dcSprite,
  }),
})

const getBBox = (obj: GameObjectType) => {
  const [hor, ver] = obj.rotation % 2
    ? [obj.height, obj.width]
    : [obj.width, obj.height]
  return {
    left: obj.x,
    top: obj.y,
    right: obj.x + hor * GRID_SQUARE_SIZE,
    bottom: obj.y + ver * GRID_SQUARE_SIZE,
    w: hor,
    h: ver,
  }
}
interface Specs {
  getBBox: typeof getBBox
}

export const ObjectTypeSpecs: { [k in ObjectToolType]: Specs } = {
  ac: {
    getBBox,
  },
  dc: {
    getBBox,
  },
  cc: {
    getBBox,
  },
}
