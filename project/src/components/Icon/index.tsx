import { OBJECT_SPECS } from 'objectSpecs'
import styles from './icon.module.css'

export const Icon = ({
  name,
  subscript,
}: {
  name: ToolType
  subscript?: string | number
}) => {
  return (
    <div className={styles.icon}>
      <img src={OBJECT_SPECS[name].icon} />
      {(subscript || subscript === 0) && <div className={styles.subscript}>{subscript}</div>}
    </div>
  )
}
