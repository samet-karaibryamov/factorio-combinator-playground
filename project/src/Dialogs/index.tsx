import { KeyboardCapture, useKeyboard } from 'useKeyboard'
import styles from './dialog.module.css'
import { usePointerDrag } from './usePointerDrag'

export const Dialog = (props: {
  onClose: () => void
  body: JSX.Element
  title?: string
}) => {
  const {
    coords,
    dragHandleProps,
  } = usePointerDrag({ x: 200, y: 200 })
  useKeyboard({
    onKeyDown: (ev) => {
      if (['KeyE', 'Escape'].includes(ev.code)) {
        ev.stopPropagation()
        props.onClose()
      }
    }
  })

  return (
    <KeyboardCapture>
      <div className={styles.root} style={{ top: coords.y, left: coords.x }}>
        <div className={styles.header}>
          <div className={styles.title}>{props.title || ''}</div>
          <div className={styles.handle} {...dragHandleProps} />
          <div className={styles.closeButton}>
            <button onClick={props.onClose}><span>×</span></button>
          </div>
        </div>
        <div className={styles.body}>
          {props.body}
        </div>
      </div>
    </KeyboardCapture>
  )
}