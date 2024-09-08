import { Dictionary, keyBy } from 'lodash'
import { PLACEABLE_OBJECT_SPECS } from 'objectSpecs'
import { ACGameObjectType } from 'objectSpecs/objects/arithmeticCombinator'
import { CCGameObjectType } from 'objectSpecs/objects/constantCombinator'
import { DCGameObjectType } from 'objectSpecs/objects/deciderCombinator'
import { typedEntries } from 'tsUtils/typedEntries'

const contactToKey = (color: WireToolType, knobInfo: WireObjectType['targets'][0]) => {
  return `${color}:${knobInfo.objectId}:${knobInfo.knobIndex}`
}

export type CircuitObjectType = ACGameObjectType | DCGameObjectType | CCGameObjectType

export type IOCircuitObjectType = ACGameObjectType | DCGameObjectType

export const isCircuiObject = (obj: GameObjectType): obj is CircuitObjectType => {
  return !!obj.sprite.knobs
}

export const stepCircuitState = (state: GameState) => {
  const { wires } = state.game
  const circuitObjects = state.game.objects.filter(isCircuiObject)

  const idMap = keyBy(circuitObjects, 'id')
  const networks = [...new Set(Object.values(collectNetworks(wires, idMap)))]
    .map(ntw => {
      return {
        ...ntw,
        signals: {} as SignalBundle
      }
    })

  networks.forEach(ntw => {
    Object.values(ntw.combinators.outputs).forEach(obj => {
      if ('currentOutput' in obj) {
        typedEntries(obj.currentOutput).forEach(([k, v]) => {
          addSignal(ntw.signals, k, v)
        })
        return
      }
      Object.values(obj.circuit.signals).forEach(sgn => {
        addSignal(ntw.signals, sgn.prototype, sgn.amount)
      })
    })
  })

  const objToNtwMap: Record<string, {
    obj: IOCircuitObjectType
    networks: typeof networks
    inputSignals: SignalBundle
  }> = {}

  networks.forEach(ntw => {
    Object.values(ntw.combinators.inputs).forEach(obj => {
      if (!objToNtwMap[obj.id]) objToNtwMap[obj.id] = { obj, networks: [], inputSignals: {} }
      objToNtwMap[obj.id].networks.push(ntw)
      typedEntries(ntw.signals).forEach(([k, v]) => {
        addSignal(objToNtwMap[obj.id].inputSignals, k, v)
      })
    })
  })

  circuitObjects.forEach(obj => {
    const objNtw = objToNtwMap[obj.id]

    if ('currentOutput' in obj) {
      if (!objNtw) {
        obj.currentOutput = {}
        obj.currentInput = { red: {}, green: {} }
        return
      }

      const { behaviour } = PLACEABLE_OBJECT_SPECS[obj.type].placeable

      obj.currentOutput = behaviour.transformSignals(obj as any, objNtw.inputSignals)
      obj.currentInput = {
        red: objNtw.networks.find(ntw => ntw.color === 'red')?.signals || {},
        green: objNtw.networks.find(ntw => ntw.color === 'green')?.signals || {},
      }

      if (objNtw.networks.length > 2) {
        alert('Something wrong! More than two input networks detected!')
      }
    }
  })


  return objToNtwMap
}

const addSignal = (signals: SignalBundle, key: ToolType, amount: number) => {
  signals[key] = (signals[key] || 0) + amount
}

const collectNetworks = (
  wires: WireObjectType[],
  idMap: Dictionary<CircuitObjectType>,
) => {
  const networks: Record<string, {
    keys: Set<string>
    wires: WireObjectType[]
    combinators: {
      inputs: Record<string, IOCircuitObjectType>,
      outputs: Record<string, CircuitObjectType>,
    }
    color: 'red' | 'green',
  }> = {}

  type Network = Exclude<typeof networks[string], undefined>

  wires.forEach(wire => {
    const { color, id, targets } = wire
    const ntwKeys = [
      contactToKey(color, targets[0]),
      contactToKey(color, targets[1]),
    ]
    const ntwks = ntwKeys.map(k => networks[k]).filter((d): d is Network => !!d)

    const inputs: Record<string, IOCircuitObjectType> = {}
    const outputs: Record<string, CircuitObjectType> = {}

    targets.forEach(trg => {
      if (trg.knobIndex === 1) inputs[trg.objectId] = idMap[trg.objectId] as IOCircuitObjectType
      if (trg.knobIndex === 0) outputs[trg.objectId] = idMap[trg.objectId]
    })

    ntwks.forEach(ntw => {
      Object.assign(inputs, ntw.combinators.inputs)
      Object.assign(outputs, ntw.combinators.outputs)
    })

    const mergedNtwk: Network = {
      keys: new Set([...ntwks.flatMap(ntw => [...ntw.keys]), ...ntwKeys]),
      color: color.slice(0, -5) as 'red' | 'green',
      wires: [...ntwks.flatMap(ntw => ntw.wires), wire],
      combinators: { inputs, outputs },
    }

    mergedNtwk.keys.forEach(key => {
      networks[key] = mergedNtwk
    })
  })

  return networks
}

export type SignalBundle = { [K in ToolType]?: number }
