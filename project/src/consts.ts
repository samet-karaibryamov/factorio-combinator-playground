
export const GRID_SQUARE_SIZE = 40

export const WIRE_TOOL_TYPES = ['rw', 'gw'] as const
export const OBJECT_TOOL_TYPES = ['cc', 'ac', 'dc'] as const
export const TOOL_TYPES = [...WIRE_TOOL_TYPES, ...OBJECT_TOOL_TYPES] as const
