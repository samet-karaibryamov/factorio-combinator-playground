import cn from 'classnames'
import styles from './toolbar.module.css'
import React from 'react'
import { ICONS_MAP } from 'assets/icons/index'
import { Icon } from 'components/Icon'

const BUTTONS: [ToolType][] = [
  ['red-wire'],
  ['green-wire'],
  ['constant-combinator'],
  ['arithmetic-combinator'],
  ['decider-combinator'],
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
          <Icon name={toolId} />
        </div>
      )}
    </div>
  )
}
