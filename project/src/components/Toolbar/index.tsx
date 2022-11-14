import cn from 'classnames'
import cc from 'assets/toolbar/Constant_combinator.png'
import ac from 'assets/toolbar/Arithmetic_combinator.png'
import dc from 'assets/toolbar/Decider_combinator.png'
import styles from './toolbar.module.css'
import React from 'react'

const ICON_MAP = { cc, ac, dc }
const BUTTONS: [ToolType][] = [
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
