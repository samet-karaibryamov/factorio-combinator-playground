import { KeyboardCapture, useKeyboard } from 'useKeyboard'
import { GameDispatch } from 'App'
import { ItemSelectorGrid } from 'components/ItemSelectorGrid'

export const ToolbarDlg = ({
  state,
  dispatch,
}: {
  state: GameState
  dispatch: GameDispatch
}) => {
  useKeyboard({
    debugValue: 'ToolbarDlg',
  })


  return <>
    <KeyboardCapture>
      <ItemSelectorGrid
        value={state.game.tool}
        onChange={(toolId) => dispatch({ type: 'selectTool', toolId })}
      />
    </KeyboardCapture>
  </>
}
