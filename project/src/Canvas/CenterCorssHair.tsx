
export const CenterCorssHair = ({
  x,
  y,
  zoom,
}: {
  x: number
  y: number
  zoom: number
}) => {
  return <g>
    {/* <circle cx={x} cy={y} r={5 * zoom} fill="red" /> */}
    <line
      x1={x - 10 * zoom}
      x2={x + 10 * zoom}
      y1={y}
      y2={y}
      stroke="red"
      strokeWidth={2 * zoom}
    />
    <line
      x1={x}
      x2={x}
      y1={y - 10 * zoom}
      y2={y + 10 * zoom}
      stroke="red"
      strokeWidth={2 * zoom}
    />
  </g>
}
