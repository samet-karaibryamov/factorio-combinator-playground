import { GRID_SQUARE_SIZE } from 'consts'
import { ActionsMapType } from 'global'
import { WritableDraft } from 'immer/dist/internal'

const KEY_MAP = {
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
} as const

export const keyHandler = (dState: WritableDraft<GameState>, action: ActionsMapType['Key']) => {
  const { code, ev: { shiftKey } } = action
  const canPan = !shiftKey
  const mapped = KEY_MAP[code as keyof typeof KEY_MAP]
  if (mapped in dState.keyboard && canPan) {
    dState.keyboard[mapped] = action.type === 'keydown'
    return
  }

  if (action.type === 'keydown') {
    const { game } = dState
    const { focusedObject: fo } = game
    switch (code) {
      case 'KeyW':
      case 'KeyA':
      case 'KeyS':
      case 'KeyD': {
        if (!fo) return
        if (!shiftKey) return
        const [dx, dy] = { KeyW: [0, -1], KeyA: [-1, 0], KeyS: [0, 1], KeyD: [1, 0] }[code]
        dState.game.objects.some(obj => {
          if (fo !== obj.id) return

          obj.x += dx * GRID_SQUARE_SIZE
          obj.y += dy * GRID_SQUARE_SIZE
          return true
        })
        return
      }
      case 'KeyR': {
        const dir = dState.keyboard.shift ? -1 : 1
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
      case 'KeyQ': {
        const { tool, objects: objs } = dState.game
        if (tool) {
          if (dState.game.toolObject) {
            dState.game.toolObject = null
          } else {
            dState.game.tool = null
          }
          return
        }
        if (fo) {
          const obj = objs.find(o => o.id === fo) as GameObjectType
          dState.game.tool = obj.type
          dState.game.focusedObject = null
          dState.game.toolRotation = obj.rotation
          return
        }
      }
    }
  }
}