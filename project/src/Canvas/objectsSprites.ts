import constantCombinatorImg from '../assets/combinator/hr-constant-combinator.png'

type ObjectCreator = (x: number, y: number, r: ObjectRotation) => GameObjectType

const objectConstrainer = <T>(obj: { [k in keyof T]: ObjectCreator }) => obj

let objId = 0
const tagObject = (partialObj: Omit<GameObjectType, 'id'>) => ({
  id: objId++,
  ...partialObj,
} as GameObjectType)

export const ObjectFactory = objectConstrainer({
  CC: (x, y, r) => tagObject({
    x,
    y,
    rotation: r,
    sprite: {
      href: constantCombinatorImg,
      unit: {
        width: 114,
        height: 102,
      },
    },
  }),
})

