import { Button } from 'components/Button'
import { Row } from 'components/Flex'
import { ItemSelectorGrid } from 'components/ItemSelectorGrid'
import { useRef, useState } from 'react'
import { useKeyboard } from 'useKeyboard'
import styles from './index.module.css'
import { Input } from 'components/Input'

type CombinedModeProps = {
  mode: 'combined'
  onSubmit: (p: { amount: number, item: ToolType } | null) => void
} & (
  | { prototype: ToolType, amount: number }
  | { prototype: null, amount: null }
)

type EitherOrModeProps = {
  mode: 'either-or'
  onSubmit: (p: { amount: number } | { item: ToolType } | null) => void
} & (
  | { prototype: ToolType, amount: null }
  | { prototype: null, amount: number }
  | { prototype: null, amount: null }
)

export type SignalPropertiesDialogProps =
  | {
    mode: 'item-only'
    prototype: ToolType | null
    onSubmit: (p: { item: ToolType } | null) => void
  }
  | CombinedModeProps
  | EitherOrModeProps

export const SignalPropertiesDialog = (props: SignalPropertiesDialogProps) => {
  const [prototype, setPrototype] = useState(props.prototype)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (reason: 'submit' | 'item-click', _prototype?: typeof props.prototype) => {
    if (props.mode === 'combined') {
      if (!prototype) throw new Error('Prototype null')

      props.onSubmit({
        amount: Number(inputRef.current?.value) || 0,
        item: prototype,
      })
    } else if (props.mode === 'either-or') {
      if (reason === 'submit') {
        props.onSubmit({ amount: Number(inputRef.current?.value) || 0 })
      } else {
        if (!_prototype) throw new Error('Prototype null')

        props.onSubmit({ item: _prototype })
      }
    } else if (props.mode === 'item-only') {
      if (!_prototype) throw new Error('Prototype null')

      props.onSubmit({ item: _prototype })
    }
  }

  useKeyboard({
    debugValue: 'SignalPropertiesDialog',
    onKeyDown: (ev) => {
      switch (ev.code) {
        case 'Enter':
        case 'KeyE': {
          ev.stopPropagation()
          handleSubmit('submit')
        }
      }
    }
  })

  return (
    <Row column between>
      <ItemSelectorGrid
        value={prototype}
        onChange={(value) => {
          if (props.mode !== 'combined') {
            handleSubmit('item-click', value)
            return
          }
          setPrototype(value)
        }}
      />
      <Row end gap={5} style={{ padding: 5 }}>
        {props.mode !== 'item-only' &&
          <Input
            ref={inputRef}
            type="text"
            defaultValue={props.amount ?? '1'}
            className={styles.input}
            disabled={props.mode === 'combined' && !prototype}
            onKeyDown={(ev) => {
              switch (ev.code) {
                case 'KeyE':
                case 'Enter':
                case 'Escape': break
                default: ev.stopPropagation()
              }
            }}
          />
        }
        <Button
          isTick
          isConfirm
          onClick={() => handleSubmit('submit')}
        />
      </Row>
    </Row>
  )
}
