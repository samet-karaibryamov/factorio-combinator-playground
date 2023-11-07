import { OBJECT_SPECS } from 'objectSpecs'
import styles from './icon.module.css'

const BREAKPOINTS = [
  [1000, 'K'],
  [1000000, 'M'],
] as const

const shortenAmount = (v: number) => {
  const bp = BREAKPOINTS.findLast(bp => bp[0] < v)
  if (!bp) return v

  return `${(v / bp[0]).toFixed(1)}${bp[1]}`
}

export const Icon = ({
  name,
  amount,
}: {
  name?: ToolType | null
  amount?: string | number | null
}) => {
  const amountDisplay = (amount || amount === 0) && shortenAmount(+amount)

  return (
    <div className={styles.icon}>
      {name
        ? (<>
          <img src={name && OBJECT_SPECS[name].icon} />
          {amountDisplay && <div className={styles.subscript}>{amountDisplay}</div>}
        </>)
        : (amountDisplay && <div className={styles.text}>{amountDisplay}</div>)
      }
    </div>
  )
}
