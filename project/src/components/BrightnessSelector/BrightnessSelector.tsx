import { UseGameLoop } from 'App'

export const BrightnessSelector = ({
  state,
  dispatch,
}: {
  state: GameState
  dispatch: ReturnType<UseGameLoop>['dispatch']
}) => {
  return (
    <input
      type="range"
      value={state.view.brightness}
      onChange={(ev) => {
        dispatch({
          type: 'setBrightness',
          value: Number(ev.target.value),
        })
      }}
      min={1}
      max={2}
      step={0.1}
    />
  )
}
