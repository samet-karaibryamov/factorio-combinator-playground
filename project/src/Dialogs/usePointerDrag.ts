import { PointerEventHandler, useState } from 'react'

export const usePointerDrag = (initialCoords: Coords | (() => Coords)) => {
  const [coords, setCoords] = useState(initialCoords)
  const [diff, setDiff] = useState<Coords>()

  const onDown: PointerEventHandler<HTMLDivElement> = (e) => {
    ;(e.target as HTMLDivElement).setPointerCapture(e.pointerId)
    setDiff({
      x: e.pageX - coords.x,
      y: e.pageY - coords.y,
    })
  }
  const onMove: PointerEventHandler<HTMLDivElement> = e => {
    if (!diff) return

    setCoords({
      x: e.pageX - diff.x,
      y: e.pageY - diff.y,
    })

 }
 const onUp: PointerEventHandler<HTMLDivElement> = () => setDiff(undefined)

  const props = {
    onPointerDown: onDown,
    onPointerMove: onMove,
    onPointerUp: onUp,
    onPointerCancel: onUp,
  }
  return {
    dragHandleProps: props,
    coords,
  }
}
