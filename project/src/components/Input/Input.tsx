import { forwardRef, InputHTMLAttributes, useEffect, useImperativeHandle, useRef } from 'react'

export const Input = forwardRef<
  HTMLInputElement | null,
  InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

  return (
    <input
      type="text"
      ref={inputRef}
      {...props}
    />
  )
})
