import React, { useContext, useDebugValue, useEffect, useRef } from 'react'

export const KeyboardContext = React.createContext(0)

type KeyHandler = (ev: KeyboardEvent) => void
type KeyHandlers = { keyDown?: KeyHandler, keyUp?: KeyHandler }

const listeners: Record<any, KeyHandlers> = {}

const callHandlers = (ev: KeyboardEvent, handlerType: keyof KeyHandlers) => {
  const max = Math.max(...Object.keys(listeners).map(k => +k))
  let isPropagationStopped = false
  const sP = ev.stopPropagation
  ev.stopPropagation = () => {
    isPropagationStopped = true
    sP.call(ev)
  }
  for (let i = max; i >= 0; i--) {
    if (isPropagationStopped) break
    listeners[i]?.[handlerType]?.(ev)
  }
}

window.addEventListener('keydown', (ev) => callHandlers(ev, 'keyDown'))
window.addEventListener('keyup', (ev) => callHandlers(ev, 'keyUp'))

export const useKeyboard = ({
  onKeyDown,
  onKeyUp,
  debugValue,
}: {
  onKeyDown?: KeyHandler
  onKeyUp?: KeyHandler
  debugValue?: string
}) => {
  const kbPriority = useContext(KeyboardContext)
  const keyHandlersRef = useRef({ onKeyDown, onKeyUp })
  useDebugValue(`useKeyboard[${kbPriority}]: ${debugValue || ''}`)

  useEffect(() => {
    keyHandlersRef.current = { onKeyDown, onKeyUp }
  })

  useEffect(() => {
    const priority = kbPriority

    if (listeners[priority]) {
      console.error('Duplicate keyboard priority ', priority, debugValue)
    }

    listeners[priority] = {
      keyDown: (ev) => keyHandlersRef.current.onKeyDown?.(ev),
      keyUp: (ev) => keyHandlersRef.current.onKeyUp?.(ev),
    }

    return () => {
      delete listeners[priority]
    }
  }, [kbPriority])
}

export const KeyboardCapture = (props: React.PropsWithChildren<{}>) => {
  const priority = useContext(KeyboardContext)
  return (
    <KeyboardContext.Provider value={priority + 1}>
      {props.children}
    </KeyboardContext.Provider>
  )
}