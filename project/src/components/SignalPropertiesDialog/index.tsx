import { Button } from 'components/Button'
import { Row } from 'components/Flex'
import { ItemSelectorGrid } from 'components/ItemSelectorGrid'
import { useRef, useState } from 'react'
import { useKeyboard } from 'useKeyboard'
import styles from './index.module.css'

export const SignalPropertiesDialog = (props: {
  prototype?: ToolType | null
  amount?: number | null
  onSubmit: (p: { amount: number, item?: ToolType | null }) => void
  allowConstant?: boolean
}) => {
  const [prototype, setPrototype] = useState(props.prototype)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    props.onSubmit({
      amount: Number(inputRef.current?.value),
      item: prototype,
    })
  }

  useKeyboard({
    onKeyDown: (ev) => {
      if (ev.code === 'KeyE') {
        ev.stopPropagation()
        handleSubmit()
      }
    }
  })

  return (
    <Row column between>
      <ItemSelectorGrid
        value={prototype}
        onChange={(value) => setPrototype(value)}
      />
      <Row end gap={5} style={{ padding: 5 }}>
        <input
          ref={inputRef}
          type="text"
          defaultValue={props.amount || ''}
          className={styles.input}
        />
        <Button
          isTick
          isConfirm
          onClick={handleSubmit}
        />
      </Row>
    </Row>
  )
}
