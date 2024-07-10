import { ChangeEventHandler } from 'react'
import { Except } from 'type-fest'

type TypedHTMLInputElement<T extends string> = Except<HTMLSelectElement, 'value'> & {
  value: T
}

export const TypedSelect = <T extends { label: string, value: string }>({
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
  return (
    <select
      value={value || ''}
      onChange={onChange}
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  )
}
