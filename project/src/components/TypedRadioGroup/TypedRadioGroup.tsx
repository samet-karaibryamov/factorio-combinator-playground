import { ChangeEventHandler } from 'react'
import { Except } from 'type-fest'
import styles from './styles.module.css'

type TypedHTMLInputElement<T extends string> = Except<HTMLInputElement, 'value'> & {
  value: T
}

export const TypedRadioGroup = <T extends { label: string, value: string }>({
  name,
  value,
  options,
  onChange,
}: {
  name?: string
  value: T['value'] | null
  options: readonly T[]
  onChange: ChangeEventHandler<TypedHTMLInputElement<T['value']>>
}) => {
  return <>{options.map((opt, i) => (
    <label key={i} className={styles.label}>
      <input
        type="radio"
        name={name}
        value={opt.value}
        checked={opt.value === value}
        onChange={onChange}
      />
      {opt.label}
    </label>
  ))}</>
}
