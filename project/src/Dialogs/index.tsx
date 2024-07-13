import { KeyboardCapture, useKeyboard } from 'useKeyboard'
import styles from './dialog.module.css'
import { usePointerDrag } from './usePointerDrag'
import { DependencyList, useEffect, useRef } from 'react'

export const Dialog = ({
  onClose,
  body,
  title,
  cacheKey,
}: {
  onClose: () => void
  body: JSX.Element
  title?: string
  cacheKey?: string
}) => {
  const {
    coords,
    dragHandleProps,
  } = usePointerDrag(() => {
    const cached = localStorage.getItem(`dlg-cache:${cacheKey}`)
    let parsed: any

    try {
      parsed = JSON.parse(cached || '')
    } catch (err) {}

    return { x: Number(parsed?.x) || 200, y: Number(parsed?.y) || 200 }
  })

  useLocalStorage(
    `dlg-cache:${cacheKey}`,
    () => JSON.stringify(coords),
    true,
    [coords]
  )

  useKeyboard({
    debugValue: 'Dlg',
    onKeyDown: (ev) => {
      if (['KeyE', 'Enter', 'Escape'].includes(ev.code)) {
        ev.stopPropagation()
        onClose()
      }
    }
  })

  const style = {
    left: `max(min(${coords.x}px, 100% - 60px), 0px)`
  }

  return (
    <KeyboardCapture>
      <div className={styles.root} style={{ top: coords.y, left: style.left }}>
        <div className={styles.header}>
          <div className={styles.title}>{title || ''}</div>
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

const useLocalStorage = (
  key: string,
  fn: () => string,
  noClear: boolean,
  deps: DependencyList,
) => {
  const callback = useRef(fn)
  const noClearRef = useRef(noClear)

  useEffect(() => {
    callback.current = fn
  }, [fn])

  useEffect(() => {
    if (!key) return

    const tid = setTimeout(() => {
      localStorage.setItem(key, callback.current())
    }, 300)

    return () => {
      if (noClearRef.current) return

      clearTimeout(tid)
    }
  }, deps)
}
