import { ICONS_MAP, PrototypeName } from 'assets/icons'
import styles from './icon.module.css'

export const Icon = ({
  name,
  subscript,
}: {
  name: PrototypeName
  subscript?: string | number
}) => {
  return (
    <div className={styles.icon}>
      <img src={ICONS_MAP[name]} />
      {(subscript || subscript === 0) && <div className={styles.subscript}>{subscript}</div>}
    </div>
  )
}
