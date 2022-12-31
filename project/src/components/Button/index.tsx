import cn from 'classnames'
import { HTMLAttributes, PropsWithChildren } from 'react'
import style from './index.module.css'

export const Button = ({
  isTick,
  isConfirm,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLButtonElement> & {
  isTick?: boolean
  isConfirm?: boolean
}>) => {
  const cName = cn(rest.className, style['action-button'], {
    [style['is-tick-button']]: isTick,
    [style['is-confirm-button']]: isConfirm,
  })
  return (
    <button {...rest} className={cName}>
      {isTick ? <>&nbsp;</> : rest.children}
    </button>
  )
}
