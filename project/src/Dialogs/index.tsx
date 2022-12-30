import { KeyboardCapture, useKeyboard } from 'useKeyboard'
import styles from './dialog.module.css'
import { usePointerDrag } from './usePointerDrag'

export const Dialog = ({
  onClose,
  body,
}: {
  onClose: () => void
  body: JSX.Element
}) => {
  const {
    coords,
    dragHandleProps,
  } = usePointerDrag({ x: 200, y: 200 })
  useKeyboard({
    onKeyDown: (ev) => {
      if (ev.code == 'KeyE') {
        ev.stopPropagation()
        onClose()
      }
    }
  })

  return (
    <KeyboardCapture>
      <div className={styles.root} style={{ top: coords.y, left: coords.x }}>
        <div className={styles.header}>
          <div className={styles.title}>Constant combinator</div>
          <div className={styles.handle} {...dragHandleProps} />
          <div className={styles.closeButton}>
            <button onClick={onClose}><span>×</span></button>
          </div>
        </div>
        <div className={styles.body}>
          {body}
        </div>
      </div>
    </KeyboardCapture>
  )
}