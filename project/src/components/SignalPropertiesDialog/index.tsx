import { PrototypeName } from 'assets/icons'
import { useKeyboard } from 'useKeyboard'

export const SignalPropertiesDialog = ({
  prototype,
}: {
  prototype: PrototypeName
}) => {
  useKeyboard({
    onKeyDown: (ev) => ev.stopPropagation()
  })
  return (
    <div>
      Key
    </div>
  )
}
