import { Icon } from 'components/Icon'
import { times } from 'lodash'
import styles from './styles.module.css'

export type Signal = {
  prototype: ToolType
  index: number
  amount: number
}

export const SignalGrid = ({
  signals,
  onSelect,
}: {
  signals: Signal[]
  onSelect: (index: number) => void
}) => {
  return (
    <div className={styles.grid}>
      {times(32, (i) => {
        const signal = signals.find(s => s.index === i)
        return (
          <div
            key={i}
            onClick={() => onSelect(i)}
            className="btn"
          >
            {signal &&
              <Icon name={signal.prototype} subscript={signal.amount} />
            }
          </div>
        )
      })}
    </div>
  )
}
