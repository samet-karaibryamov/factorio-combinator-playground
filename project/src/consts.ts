import { PrototypeName } from 'assets/icons'

export const GRID_SQUARE_SIZE = 40

export const WIRE_TOOL_TYPES = ['red-wire', 'green-wire'] as const satisfies readonly PrototypeName[]
export const OBJECT_TOOL_TYPES = ['constant-combinator', 'arithmetic-combinator', 'decider-combinator'] as const satisfies readonly PrototypeName[]
export const TOOL_TYPES = [...WIRE_TOOL_TYPES, ...OBJECT_TOOL_TYPES] as const
