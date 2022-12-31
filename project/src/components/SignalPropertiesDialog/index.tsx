import { useKeyboard } from 'useKeyboard'

export const SignalPropertiesDialog = ({
  prototype,
}: {
  prototype: ToolType
  onSubmit: (p: any) => void
}) => {
  useKeyboard({
    // onKeyDown: (ev) => ev.stopPropagation()
  })
  return (
    <div>
      Key
    </div>
  )
}
