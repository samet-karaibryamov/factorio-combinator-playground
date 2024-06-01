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
}: {
  signals: Signal[]
  onSubmit: (signals: Signal[]) => void
}) => {
  return (
    <div className={styles.grid}>
      {times(32, (i) => {
        const sgn = signals.find(s => s.index === i)

        return (
          <SignalSelectorButton
            key={i}
            mode="combined"
            {...(sgn ? sgn : { amount: null, prototype: null })}
            onSubmit={(value) => {
              if (!value) {
                onSubmit(signals.filter(sgn => sgn.index !== i))
                return
              }

              const { amount, item } = value

              let newSignals
              const newSignal = { amount, prototype: item, index: i } as Signal
              if (sgn) {
                newSignals = amount === 0
                  ? signals.filter(sgn => sgn.index !== i)
                  : signals.map(_sgn => _sgn.index === i ? newSignal : _sgn)
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
