import { ChangeEvent, useState } from 'react'
import { KeyboardCapture, useKeyboard } from 'useKeyboard'
import { ACGameObjectType, ACInputSignalType } from 'objectSpecs/objects/arithmeticCombinator'
import { SignalSelectorButton } from 'components/SignalSelectorButton'
import styles from './index.module.css'

const InputSignalSelectorButton = ({
  sgn,
  onChange,
}: {
  sgn?: ACInputSignalType
  onChange: (newSgn: ACInputSignalType) => void
}) => {
  return (
    <SignalSelectorButton
      mode="either-or"
      {...(
        sgn?.amount
        ? { amount: sgn?.amount, prototype: null }
        : sgn?.prototype
        ? { amount: null, prototype: sgn.prototype }
        : { amount: null, prototype: null }
      )}
      onSubmit={(opts) => {
        const newSignal: ACInputSignalType = 'amount' in opts
          ? { amount: opts.amount }
          : { prototype: opts.item }

        onChange(newSignal)
      }}
    />
  )
}

export const ACInspect = ({
  onSubmit,
  obj,
}: {
  onSubmit: (partial: Pick<ACGameObjectType, 'id' | 'circuit'>) => void
  obj: ACGameObjectType
}) => {
  const [circuit, setCircuit] = useState(obj.circuit)

  const onChange = (ev: ChangeEvent<{ name: string, value: string }>) => {
    const { name, value } = ev.target
    setCircuit({
      ...circuit,
      [name]: value,
    })
  }

  useKeyboard({
    debugValue: 'ACInspect',
    onKeyDown: (ev) => {
      if (ev.code === 'KeyE') {
        onSubmit({
          id: obj.id,
          circuit,
        })
      }
    },
  })

  const lSgn = circuit.leftSignal
  return <>
    <KeyboardCapture>
      <div className={styles.root}>
        <label>Input</label>
        <div className={styles.row1}>
          <InputSignalSelectorButton
            sgn={circuit.leftSignal}
            onChange={(newSignal) => setCircuit(c => ({ ...c, leftSignal: newSignal }))}
          />
          <select
            value={circuit.oper}
            onChange={(ev) => setCircuit(c => ({ ...c, oper: ev.target.value }))}
          >
            {['+', '-', '*', '/'].map(oper => <option key={oper} value={oper}>{oper}</option>)}
          </select>
          <InputSignalSelectorButton
            sgn={circuit.rightSignal}
            onChange={(newSignal) => setCircuit(c => ({ ...c, rightSignal: newSignal }))}
          />
        </div>
        <hr />
        <label>Output</label>
        <SignalSelectorButton
          mode="item-only"
          prototype={circuit.returnSignal ?? null}
          onSubmit={(signal) => {
            setCircuit(c => ({ ...c, returnSignal: signal.item }))
          }}
        />
      </div>
    </KeyboardCapture>
  </>
}
