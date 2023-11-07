import { SignalGrid } from '../../SignalGrid'
import { useState } from 'react'
import { KeyboardCapture, useKeyboard } from 'useKeyboard'
import { CCGameObjectType } from 'objectSpecs/objects/constantCombinator'

export const CCInspect = ({
  onSubmit,
  obj,
}: {
  onSubmit: (partial: Partial<CCGameObjectType>) => void
  obj: CCGameObjectType
}) => {
  const [signals, setSignals] = useState(obj.circuit.signals)

  useKeyboard({
    debugValue: 'CCInspect',
    onKeyDown: (ev) => {
      switch (ev.code) {
        case 'KeyE':
        case 'Enter': {
          onSubmit({
            id: obj.id,
            circuit: { ...obj.circuit, signals },
          })
          break
        }
      }
    },
  })

  return <>
    <KeyboardCapture>
      <SignalGrid
        signals={signals}
        onSubmit={(newSignals) => setSignals(newSignals)}
        onClear={(i) => { setSignals(signals.filter(s => s.index !== i)) }}
      />
    </KeyboardCapture>
  </>
}
