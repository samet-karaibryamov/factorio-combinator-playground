import { UseGameLoop } from "../../App"

export const ShowGridToggle = ({
  state: { view: { isGridShown } },
  dispatch,
}: {
  state: GameState,
  dispatch: ReturnType<UseGameLoop>['dispatch']
}) => {
  return (
    <label>
      <input
        type="checkbox"
        onChange={() => dispatch({ type: 'showGrid', isShown: !isGridShown })}
        checked={isGridShown}
      />
      Show grid
    </label>
  )
}