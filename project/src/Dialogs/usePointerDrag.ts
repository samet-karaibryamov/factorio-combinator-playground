import { PointerEventHandler, useState } from 'react'

export const usePointerDrag = (initialCoords: Coords) => {
  const [coords, setCoords] = useState(initialCoords)
  const [isDragging, setIsDragging] = useState(false)
  const [prevMouse, setPrevMouse] = useState<Coords>({ x: 0, y: 0 })

  const onDown: PointerEventHandler<HTMLDivElement> = (e) => {
    setIsDragging(true)
    ;(e.target as HTMLDivElement).setPointerCapture(e.pointerId)
    setPrevMouse({ x: e.pageX, y: e.pageY })
  }
  const onMove: PointerEventHandler<HTMLDivElement> = e => {
    if (!isDragging) return

    // console.log(pick(e, 'pageX', 'pageY'))
    const newMouse = { x: e.pageX, y: e.pageY }
    setCoords({
      x: coords.x + newMouse.x - prevMouse.x,
      y: coords.y + newMouse.y - prevMouse.y,
    })
    setPrevMouse(newMouse)

 }
 const onUp: PointerEventHandler<HTMLDivElement> = e => setIsDragging(false)

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
