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

if (import.meta.env.DEV) {
  Object.assign(window, {
    acSprite,
    dcSprite,
    ccSprite,
  })
}

export const ObjectFactory: Record<ObjectToolType, ObjectCreator> = {
  cc: (x, y, r) => tagObject({
    x,
    y,
    rotation: r,
    type: 'cc',
    width: 1,
    height: 1,
    sprite: ccSprite,
  }),
  ac: (x, y, r) => tagObject({
    x,
    y,
    rotation: r,
    type: 'ac',
    width: 1,
    height: 2,
    sprite: acSprite,
  }),
  dc: (x, y, r) => tagObject({
    x,
    y,
    rotation: r,
    type: 'dc',
    width: 1,
    height: 2,
    sprite: dcSprite,
  }),
}

const getBBox = (obj: GameObjectType) => {
  const [hor, ver] = obj.rotation % 2
    ? [obj.height, obj.width]
    : [obj.width, obj.height]

  const left = obj.x
  const top = obj.y
  const w = hor * GRID_SQUARE_SIZE
  const h = ver * GRID_SQUARE_SIZE

  return { left, top, right: left + w, bottom: top + h, w, h }
}

const checkHit = (obj: GameObjectType, { x, y }: Coords) => {
  const bbox = getBBox(obj)
  return (
    bbox.left <= x && x <= bbox.right &&
    bbox.top <= y && y <= bbox.bottom
  )
}

const getCombinatorKnobClickBoxes = (obj: GameObjectType) => {

  const [dirX, dirY] = obj.rotation % 2 ? [1, 0] : [0, 1]
  const isInverted = [1, 2].includes(obj.rotation)
  const { knobs } = obj.sprite
  const clickBoxes = knobs.map((k, i) => {
    const offset = isInverted ? knobs.length - i - 1: i
    const left = obj.x + offset * dirX * GRID_SQUARE_SIZE
    const top = obj.y + offset * dirY * GRID_SQUARE_SIZE
    const w = GRID_SQUARE_SIZE
    const h = GRID_SQUARE_SIZE

    return { left, top, right: left + w, bottom: top + h, w, h }
  })
  return clickBoxes
}

const getCombinatorKnobIndex = (obj: GameObjectType, gameCoord: Coords) => {
  const { x, y } = gameCoord
  return getCombinatorKnobClickBoxes(obj).findIndex(cbox => {
    return (
      cbox.left <= x && x <= cbox.right
      && cbox.top <= y && y <= cbox.bottom
    )
  })
}

interface Specs {
  getBBox: typeof getBBox,
  getKnobClickBoxes: typeof getCombinatorKnobClickBoxes,
  checkHit: typeof checkHit,
  getKnobIndex: typeof getCombinatorKnobIndex,
}

export const ObjectTypeSpecs: { [k in ObjectToolType]: Specs } = {
  ac: {
    getBBox,
    checkHit,
    getKnobClickBoxes: getCombinatorKnobClickBoxes,
    getKnobIndex: getCombinatorKnobIndex,
  },
  dc: {
    getBBox,
    checkHit,
    getKnobClickBoxes: getCombinatorKnobClickBoxes,
    getKnobIndex: getCombinatorKnobIndex,
  },
  cc: {
    getBBox,
    checkHit,
    getKnobClickBoxes: getCombinatorKnobClickBoxes,
    getKnobIndex: getCombinatorKnobIndex,
  },
}
