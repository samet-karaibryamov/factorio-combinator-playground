import { OBJECT_SPECS } from 'objectSpecs'
import styles from './icon.module.css'

export const Icon = ({
  name,
  amount,
}: {
  name?: ToolType | null
  amount?: string | number | null
}) => {
  const hasAmount = amount || amount === 0

  return (
    <div className={styles.icon}>
      {name
        ? (<>
          <img src={name && OBJECT_SPECS[name].icon} />
          {hasAmount && <div className={styles.amount}>{amount}</div>}
        </>)
        : (hasAmount && <div className={styles.text}>{amount}</div>)
      }
    </div>
  )
}
