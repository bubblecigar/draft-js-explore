import React from 'react'
import SuggestionMapAPI from './api/SuggestionMapAPI'

const tableStyle = {
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'center'
}
const pairStyle = {
  display: 'flex',
  flexFlow: 'row',
  margin: '10px',
  border: '1px solid black'
}

const Input = ({ value, setState }) => {
  const [v, setV] = React.useState(value)
  const inputRef = React.useRef()

  const onChange = e => setV(e.target.value)
  const onFocus = e => inputRef.current.select()
  const onBlur = e => value === v ? 0 : setState(v)

  return (
    <input
      ref={inputRef}
      value={v}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
}

const KeyMapTable = () => {
  // fetch keyMapTable
  React.useEffect(
    () => {
      const table = SuggestionMapAPI.importer()
      setKeys(Object.keys(table))
      setVals(Object.keys(table).map(key => table[key]))
      setUids(Object.keys(table).map((key, i) => i))
      setNextId(Object.keys(table).length)
    }, []
  )

  // flatten table to keys[] : vals[] pair
  const [keys, setKeys] = React.useState([])
  const [vals, setVals] = React.useState([])
  // dynamic generate unique keyId for new pair
  const [uids, setUids] = React.useState([])
  const [nextId, setNextId] = React.useState(0)

  const setStateBy = (index, field, setter) => newVal => {
    setter([...field.slice(0, index), newVal, ...field.slice(index + 1)])
  }

  const deletePair = index => e => {
    setKeys([...keys.slice(0, index), ...keys.slice(index + 1)])
    setVals([...vals.slice(0, index), ...vals.slice(index + 1)])
    setUids([...uids.slice(0, index), ...uids.slice(index + 1)])
  }

  const addPair = () => {
    setKeys(['', ...keys])
    setVals(['', ...vals])
    setUids([nextId, ...uids])
    setNextId(nextId + 1)
  }

  // bind keys[] : vals[] pair to generate suggestion table
  const bind = (keys, vals) => keys.reduce(
    (acc, key, i) => (
      key ? { ...acc, [key]: vals[i] } : { ...acc }
    ), {}
  )
  const exportData = () => {
    SuggestionMapAPI.exporter(bind(keys, vals))
    document.dispatchEvent(new window.CustomEvent('suggestionMapUpdated'))
  }

  React.useEffect(
    () => {
      exportData()
    }
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={addPair} style={{ width: '50%' }}>add new shortcut</button>
      </div>
      <div style={tableStyle}>
        {uids.map(
          (uid, i) => (
            <div key={uid} style={pairStyle}>
              <button onClick={deletePair(i)}>x</button>
              <Input
                value={keys[i]}
                setState={setStateBy(i, keys, setKeys)}
              />
              <Input
                value={vals[i]}
                setState={setStateBy(i, vals, setVals)}
              />
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default KeyMapTable
