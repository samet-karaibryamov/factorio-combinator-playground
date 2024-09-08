import { CircuitObjectType, isCircuiObject, SignalBundle } from 'circuitProcessing'
import { Icon } from 'components/Icon'
import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { typedEntries } from 'tsUtils/typedEntries'
import style from './SignalsDisplay.module.css'
import { SignalGridType } from 'components/SignalGrid'

export const SignalsDisplay = ({
  state,
  ...divProps
}: {
  state: GameState
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <div {...divProps} className={style.root}>
      {state.game.objects.filter(isCircuiObject).map((obj, i) => {
        return <CombinatorInfo key={i} obj={obj} />
      })}
    </div>
  )
}

const CombinatorInfo = ({
  obj,
}: {
  obj: CircuitObjectType
}) => {
  const iconList = 'currentOutput' in obj
    ? <>
      <IconList bundle={obj.currentInput.red} color="red" />
      <IconList bundle={obj.currentInput.green} color="green" />
      <IconList bundle={obj.currentOutput} />
    </>
    : <IconList bundle={obj.circuit.signals} />

  const tag = obj.type.split('-').map(p => p[0]).join('').toUpperCase()

  return (
    <div className={style.combinatorInfo}>
      <div className={style.title}>
        {obj.id} - {tag}
      </div>
      {iconList}
    </div>
  )
}

const IconList = ({
  bundle,
  color,
}: {
  bundle: SignalBundle | SignalGridType
  color?: 'red' | 'green'
}) => {
  const list = typedEntries(bundle)
  if (!list.length) return null

  return (
    <div className={style.iconList} style={color && { background: color }}>
      {list.map(([signalKey, amount]) => {
        return (
          <div
            key={signalKey}
            className={style.iconWrapper}
          >
            <Icon name={signalKey} amount={typeof amount === 'number' ? amount : amount.amount} />
          </div>
        )
      })}
    </div>
  )
}
