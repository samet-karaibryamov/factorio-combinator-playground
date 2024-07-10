import { times } from 'lodash'
import styles from './styles.module.css'
import { SignalSelectorButton } from 'components/SignalSelectorButton'

export type Signal = {
  prototype: ToolType
  index?: number
  amount: number
}

export type SignalGridType = Partial<Record<ToolType, Signal>>

export const SignalGrid = ({
  signals,
  onSubmit,
}: {
  signals: SignalGridType
  onSubmit: (signals: SignalGridType) => void
}) => {
  return (
    <div className={styles.grid}>
      {times(32, (i) => {
        const sgn = Object.values(signals).find(s => s.index === i)

        return (
          <SignalSelectorButton
            key={i}
            mode="combined"
            {...(sgn ? sgn : { amount: null, prototype: null })}
            onSubmit={(value) => {
              if (!value) {
                if (!sgn) return

                const { [sgn.prototype]: oldSgn, ...newSignals } = signals
                onSubmit(newSignals)

                return
              }

              const { amount, item } = value

              const newSignals = { ...signals }
              newSignals[value.item] = { amount, prototype: item, index: i }
              
              onSubmit(newSignals)
            }}
          />
        )
      })}
    </div>
  )
}
