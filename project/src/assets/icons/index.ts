import cc from './Constant_combinator.png'
import ac from './Arithmetic_combinator.png'
import dc from './Decider_combinator.png'
import rw from './Red_wire.png'
import gw from './Green_wire.png'

export const ICONS_MAP = {
  'constant-combinator': cc,
  'arithmetic-combinator': ac,
  'decider-combinator': dc,
  'red-wire': rw,
  'green-wire': gw,
} as const

export type PrototypeName = keyof typeof ICONS_MAP
