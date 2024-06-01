import { useState } from 'react'
import cn from 'classnames'
import { Dialog } from 'Dialogs'
import { Icon } from 'components/Icon'
import styles from './index.module.css'
import { SignalPropertiesDialogProps, SignalPropertiesDialog } from 'components/SignalPropertiesDialog'

export const SignalSelectorButton = (spdProps: SignalPropertiesDialogProps) => {
  const { mode } = spdProps
  const finalAmount = mode !== 'item-only' ? spdProps.amount : null
  const [isDlgOpen, setIsDlgOpen] = useState(false)

  return (
    <div className={styles.root}>
      <div
        onClick={() => setIsDlgOpen(true)}
        onContextMenu={(ev) => { ev.preventDefault(); spdProps.onSubmit(null) }}
        className={cn('btn', { active: isDlgOpen })}
      >
        <Icon name={spdProps.prototype} amount={finalAmount} />
      </div>
      {isDlgOpen &&
        <Dialog
          onClose={() => setIsDlgOpen(false)}
          body={
            <SignalPropertiesDialog
              {...spdProps}
              onSubmit={(opts: any) => {
                spdProps.onSubmit(opts)
                setIsDlgOpen(false)
              }}
            />
          }
        />
      }
    </div>
  )
}
