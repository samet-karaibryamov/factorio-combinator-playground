import 'react'

declare module 'react' {
  interface CSSProperties {
    '--brightness'?: string | number
  }
}
