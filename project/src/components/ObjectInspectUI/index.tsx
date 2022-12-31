import { Dialog } from 'Dialogs'
import { Signal, SignalGrid } from '../SignalGrid'
import { useState } from 'react'
import { SignalPropertiesDialog } from 'components/SignalPropertiesDialog'

type CProps = {
  signals: Signal[]
}

const propz: CProps = {
  signals: [
    {
      amount: 3,
      index: 3,
      prototype: 'constant-combinator',
    },
    {
      amount: 12,
      index: 14,
      prototype: 'red-wire',
    },
  ]
}

export const CCInspect = ({
  dispatch,
}: {
  dispatch: React.Dispatch<GameActions>
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [prototype, setPrototype] = useState<ToolType>('constant-combinator')

  return <>
    <SignalGrid
      signals={propz.signals}
      onSelect={(i) => {
        setSelectedIndex(i)
      }}
    />
    {(() => {
      if (selectedIndex < 0) return null

      const signal = propz.signals.find(s => s.index === selectedIndex)
      return (
        <Dialog
          onClose={() => setSelectedIndex(-1)}
          body={
            <SignalPropertiesDialog
              prototype={signal?.prototype}
              amount={signal?.amount}
              onSubmit={({ amount, item }) => {
                const newSignal = signal || {} as Signal
                if (!signal) propz.signals.push(newSignal)

                newSignal.index = selectedIndex
                newSignal.amount = amount
                newSignal.prototype = item as ToolType
                setSelectedIndex(-1)
              }}
            />
          }
        />
      )
    })()}
  </>
}
