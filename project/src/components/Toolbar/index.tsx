import cn from 'classnames'
import cc from 'assets/toolbar/Constant_combinator.png'
import ac from 'assets/toolbar/Arithmetic_combinator.png'
import dc from 'assets/toolbar/Decider_combinator.png'
import rw from 'assets/toolbar/Red_wire.png'
import gw from 'assets/toolbar/Green_wire.png'
import styles from './toolbar.module.css'
import React from 'react'

const ICON_MAP = { cc, ac, dc, rw, gw }
const BUTTONS: [ToolType][] = [
  ['rw'],
  ['gw'],
  ['cc'],
  ['ac'],
  ['dc'],
]

export const Toolbar = (props: {
  currentTool: ToolType | null
  dispatch: React.Dispatch<GameActions>
}) => {
  return (
    <div className={styles.toolbar}>
      {BUTTONS.map(([toolId], i) =>
        <div
          key={i}
          className={cn({ [styles.active]: toolId === props.currentTool })}
          onClick={() => props.dispatch({ type: 'selectTool', toolId })}
        >
          <img src={ICON_MAP[toolId]} />
        </div>
      )}
    </div>
  )
}
