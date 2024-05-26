import { SignalGrid } from '../../SignalGrid'
import { KeyboardCapture, useKeyboard } from 'useKeyboard'
import { CCGameObjectType } from 'objectSpecs/objects/constantCombinator'

export const CCInspect = ({
  onSubmit,
  obj,
}: {
  onSubmit: (partial: Partial<CCGameObjectType>) => void
  obj: CCGameObjectType
}) => {
  useKeyboard({
    debugValue: 'CCInspect',
  })

  const onChange = (newSignals: typeof obj.circuit.signals) => {
    onSubmit({
      id: obj.id,
      circuit: { ...obj.circuit, signals: newSignals },
    })
  }

  return <>
    <KeyboardCapture>
      <SignalGrid
        signals={obj.circuit.signals}
        onSubmit={(newSignals) => onChange(newSignals)}
      />
    </KeyboardCapture>
  </>
}
