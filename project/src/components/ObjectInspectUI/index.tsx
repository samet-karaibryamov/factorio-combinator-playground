import { times } from 'lodash'
import { PrototypeName } from 'assets/icons'
import { Icon } from 'components/Icon'
import { Dialog } from 'Dialogs'
import { SignalGrid } from '../SignalGrid'
import { useState } from 'react'
import { SignalPropertiesDialog } from 'components/SignalPropertiesDialog'

type CProps = {
  signals: Array<{
    prototype: PrototypeName
    index: number
    amount: number
  }>
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

  return <>
    <SignalGrid
      signals={propz.signals}
      onSelect={(i) => {
        setSelectedIndex(i)
      }}
    />
    {selectedIndex > -1 &&
      <Dialog
        onClose={() => setSelectedIndex(-1)}
        body={
          <SignalPropertiesDialog prototype="constant-combinator" />
        }
      />
    }
  </>
}
