import { GRID_SQUARE_SIZE } from 'Canvas'
import { ActionsMapType } from 'global'
import produce from 'immer'

const KEY_MAP = {
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
} as const

export const keyHandler = (state: GameState, action: ActionsMapType['Key']) => {
  return produce(state, (dState) => {
    const key = action.key.toLowerCase()
    const canPan = !state.keyboard.shift
    const mapped = KEY_MAP[key as keyof typeof KEY_MAP] || key
    if (mapped in state.keyboard && (key === 'shift' || canPan)) {
      dState.keyboard[mapped] = action.type === 'keydown'
      return
    }

    if (action.type === 'keyup') {
      const { game } = state
      const { focusedObject: fo } = game
      switch (key) {
        case 'w':
        case 'a':
        case 's':
        case 'd': {
          if (!fo) return
          const [dx, dy] = { w: [0, -1], a: [-1, 0], s: [0, 1], d: [1, 0] }[key]
          dState.game.objects.some(obj => {
            if (fo !== obj.id) return

            obj.x += dx * GRID_SQUARE_SIZE
            obj.y += dy * GRID_SQUARE_SIZE
            return true
          })
          return
        }
        case 'r': {
          const dir = state.keyboard.shift ? -1 : 1
          if (fo) {
            dState.game.objects.some(obj => {
              if (fo !== obj.id) return

              obj.rotation = (obj.rotation + dir + 4) % 4 as ObjectRotation
              return true
            })
          } else {
            dState.game.toolRotation = (dState.game.toolRotation + dir + 4) % 4 as ObjectRotation
          }
          return
        }
        case 'q': {
          const { tool, objects: objs } = state.game
          if (tool || fo) {
            const obj = objs.find(o => o.id === fo) as GameObjectType
            dState.game.tool = tool ? null : obj.type
            dState.game.focusedObject = null
            return
          }
        }
      }
    }
  })
}