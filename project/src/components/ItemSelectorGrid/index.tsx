import cn from 'classnames'
import styles from './index.module.css'
import { Icon } from 'components/Icon'

const BUTTONS: [ToolType][] = [
  ['red-wire'],
  ['green-wire'],
  ['constant-combinator'],
  ['arithmetic-combinator'],
  ['decider-combinator'],
]

export const ItemSelectorGrid = (props: {
  value: ToolType | null | undefined
  onChange: (value: ToolType) => void
}) => {
  return (
    <div className={styles.itemSelector}>
      {BUTTONS.map(([toolId], i) =>
        <div
          key={i}
          className={cn({ [styles.active]: toolId === props.value })}
          onClick={() => props.onChange(toolId)}
        >
          <Icon name={toolId} />
        </div>
      )}
    </div>
  )
}
