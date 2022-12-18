import styles from './dialog.module.css'
import { usePointerDrag } from './usePointerDrag'

export const Dialog = () => {
  const {
    coords,
    dragHandleProps,
  } = usePointerDrag({ x: 200, y: 200 })
  return (
    <div className={styles.root} style={{ top: coords.y, left: coords.x }}>
      <div className={styles.header}>
        <div className={styles.title}>Constant combinator</div>
        <div className={styles.handle} {...dragHandleProps} />
        <div className={styles.closeButton} />
      </div>
      <div className={styles.body} />
    </div>
  )
}