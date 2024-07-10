import { KeyboardCapture, useKeyboard } from 'useKeyboard'
import { ACGameObjectType, ACInputSignalType } from 'objectSpecs/objects/arithmeticCombinator'
import { SignalSelectorButton } from 'components/SignalSelectorButton'
import styles from './index.module.css'
import { TypedSelect } from 'components/TypedRadioGroup/TypedSelect'

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
        if (!opts) {
          onChange(null)
          return
        }

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
  useKeyboard({
    debugValue: 'ACInspect',
  })

  const onChange = (circuit: Partial<typeof obj.circuit>) => {
    onSubmit({
      id: obj.id,
      circuit: {
        ...obj.circuit,
        ...circuit,
      },
    })
  }

  return <>
    <KeyboardCapture>
      <div className={styles.root}>
        <label>Input</label>
        <div className={styles.row1}>
          <InputSignalSelectorButton
            sgn={obj.circuit.leftSignal}
            onChange={(newSignal) => onChange({ leftSignal: newSignal })}
          />
          <TypedSelect
            value={obj.circuit.oper}
            onChange={(ev) => onChange({ oper: ev.target.value })}
            options={(['+', '-', '*', '/', '%', '**', '<<', '>>', '&', '|', '^'] as const)
              .map(oper => ({
                value: oper,
                label: oper === '**' ? '^' : oper,
              }))
            }
          />
          <InputSignalSelectorButton
            sgn={obj.circuit.rightSignal}
            onChange={(newSignal) => onChange({ rightSignal: newSignal })}
          />
        </div>
        <hr />
        <label>Output</label>
        <SignalSelectorButton
          mode="item-only"
          prototype={obj.circuit.returnSignal ?? null}
          onSubmit={(signal) => onChange({ returnSignal: signal?.item })}
        />
      </div>
    </KeyboardCapture>
  </>
}
