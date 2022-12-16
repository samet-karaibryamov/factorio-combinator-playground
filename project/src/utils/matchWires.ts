
export const matchWires = (wire1: WireObjectType, wire2: WireObjectType) => {
  if (wire1.color !== wire2.color) return false

  const t1 = wire1.targets
  const t2 = wire2.targets

  const matchTargets = (i1: number, i2: number) => (
    t1[i1].objectId === t2[i2].objectId
    && t1[i1].knobIndex === t2[i2].knobIndex
  )

  return (
    (matchTargets(0, 0) && matchTargets(1, 1))
    || (matchTargets(0, 1) && matchTargets(1, 0))
  )
}
