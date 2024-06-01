import { KeyboardCapture, useKeyboard } from 'useKeyboard'
import { DCGameObjectType, DCInputSignalType } from 'objectSpecs/objects/deciderCombinator'
import { SignalSelectorButton } from 'components/SignalSelectorButton'
import styles from './index.module.css'
import { TypedRadioGroup } from 'components/TypedRadioGroup'
import { SignalPropertiesDialogProps } from 'components/SignalPropertiesDialog'
import { ZExclude } from 'tsUtils/ZExclude'

const InputSignalSelectorButton = ({
  mode,
  sgn,
  onChange,
}: {
  sgn?: DCInputSignalType
  onChange: (newSgn: DCInputSignalType) => void
  mode: ZExclude<SignalPropertiesDialogProps['mode'], 'combined'>
}) => {
  if (mode === 'item-only') {
    return (
      <SignalSelectorButton
        mode="item-only"
        prototype={sgn?.prototype || null}
        onSubmit={(opts) => onChange(opts && { prototype: opts.item })}
      />
    )
  }

  return (
    <SignalSelectorButton
      mode="either-or"
      {...(
        sgn?.amount || sgn?.amount === 0
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

        const newSignal: DCInputSignalType = 'amount' in opts
          ? { amount: opts.amount }
          : { prototype: opts.item }

        onChange(newSignal)
      }}
    />
  )
}

export const DCInspect = ({
  onSubmit,
  obj,
}: {
  onSubmit: (partial: Pick<DCGameObjectType, 'id' | 'circuit'>) => void
  obj: DCGameObjectType
}) => {
  useKeyboard({
    debugValue: 'DCInspect',
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
            mode="item-only"
          />
          <select
            value={obj.circuit.oper}
            onChange={(ev) => onChange({ oper: ev.target.value })}
          >
            {['>', '<', '>=', '<=', '=', '!='].map(oper => <option key={oper} value={oper}>{oper}</option>)}
          </select>
          <InputSignalSelectorButton
            sgn={obj.circuit.rightSignal}
            onChange={(newSignal) => onChange({ rightSignal: newSignal })}
            mode="either-or"
          />
        </div>
        <hr />
        <label>Output</label>
        <div style={{ display: 'flex', gap: 5 }}>
          <SignalSelectorButton
            mode="item-only"
            prototype={obj.circuit.returnSignal ?? null}
            onSubmit={(signal) => onChange({ returnSignal: signal?.item })}
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
            <TypedRadioGroup
              onChange={(ev) => onChange({ returnMode: ev.target.value })}
              value={obj.circuit.returnMode}
              options={[
                { label: '1', value: 'one'},
                { label: 'Input Count', value: 'input-count'},
              ] as const}
            />
          </div>
        </div>

      </div>
    </KeyboardCapture>
  </>
}
