import { PropsWithChildren } from 'react'
import cn from 'classnames'
import classes from './index.module.css'

export const Row = ({
  start,
  end,
  center,
  around,
  between,
  top,
  bottom,
  middle,
  column,
  gap,
  ...rest
}: PropsWithChildren<React.HTMLAttributes<HTMLDivElement> & {
  start?: boolean
  end?: boolean
  center?: boolean
  around?: boolean
  between?: boolean
  top?: boolean
  bottom?: boolean
  middle?: boolean
  column?: boolean
  gap?: number
}>) => {
  const cName = cn(rest.className, classes.row, {
    [classes['row-start']]: start,
    [classes['row-end']]: end,
    [classes['row-center']]: center,
    [classes['row-around']]: around,
    [classes['row-between']]: between,
    [classes['row-top']]: top,
    [classes['row-bottom']]: bottom,
    [classes['row-middle']]: middle,
    [classes['row-column']]: column,
  })

  const style = { ...rest.style }
  if (gap) style.gap = gap

  return <div className={cName} {...rest} style={style}/>
}
