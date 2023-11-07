import { times } from 'lodash'
import styles from './styles.module.css'
import { SignalSelectorButton } from 'components/SignalSelectorButton'

export type Signal = {
  prototype: ToolType
  index?: number
  amount: number
}

export const SignalGrid = ({
  signals,
  onSubmit,
  onClear,
}: {
  signals: Signal[]
  onSubmit: (signals: Signal[]) => void
  onClear: (index: number) => void
}) => {
  return (
    <div className={styles.grid}>
      {times(32, (i) => {
        const sgn = signals.find(s => s.index === i)

        return (
          <SignalSelectorButton
            mode="combined"
            {...(sgn ? sgn : { amount: null, prototype: null })}
            onClear={() => onClear(i)}
            onSubmit={({ amount, item }) => {
              let newSignals
              const newSignal = { amount, prototype: item, index: i } as Signal
              if (sgn) {
                newSignals = signals.map(_sgn => _sgn.index === i ? newSignal : _sgn)
              } else {
                newSignals = [...signals, newSignal]
              }
              onSubmit(newSignals)
            }}
          />
        )
      })}
    </div>
  )
}
