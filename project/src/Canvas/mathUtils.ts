import { GRID_SQUARE_SIZE } from 'consts'

export const clampNumberTo = (n: number, clamp: number) => {
  return (n % clamp + clamp) % clamp
}

export const getSvgCoords = (ev: React.MouseEvent | MouseEvent, svg: SVGSVGElement) => {
  const bcr = svg.getBoundingClientRect()
  return {
    x: ev.clientX - bcr.x,
    y: ev.clientY - bcr.y,
  }
}

export const svgCoordsToGameCoords = (
  svgCoords: { x: number, y: number },
  { view }: GameState,
) => {
  return {
    x: (svgCoords.x - view.x) / view.zoom,
    y: (svgCoords.y - view.y) / view.zoom,
  }
}

export const gameCoordsToSvgCoords = (
  gameCoords: { x: number, y: number },
  { view }: GameState,
) => {
  return {
    x: view.x + gameCoords.x * view.zoom,
    y: view.y + gameCoords.y * view.zoom,
  }
}

export const gameCoordsToClampedObjectCoords = (gameCoords: Coords): Coords => {
  let { x, y } = gameCoords
  x = Math.floor(x / GRID_SQUARE_SIZE) * GRID_SQUARE_SIZE
  y = Math.floor(y / GRID_SQUARE_SIZE) * GRID_SQUARE_SIZE
  return { x, y }
}
