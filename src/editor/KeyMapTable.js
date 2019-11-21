import React from 'react'
import SuggestionMapAPI from './api/SuggestionMapAPI'

const tableStyle = {
  display: 'flex',
  flexFlow: 'row nowrap',
  margin: '10px -10px'
}
const pairStyle = {
  display: 'flex',
  flexFlow: 'row',
  margin: '10px'
}
const inputStyle = type => ({
  width: type === 'key' ? '100px' : '200px',
  textAlign: 'center',
  padding: '7px',
  margin: '3px',
  fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New",monospace',
  fontWeight: 'bold',
  border: '0',
  borderBottom: '1px solid gray',
  outline: 'none'
})
const buttonStyle = {
  margin: '10px 5px',
  fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New",monospace',
  fontWeight: 'bold',
  padding: '5px',
  border: 0,
  cursor: 'pointer'
}
const deleteButtonStyle = {
  backgroundColor: 'transparent',
  border: '0',
  color: 'indianRed',
  cursor: 'pointer'

}

const Input = ({ value, setState, style }) => {
  const [v, setV] = React.useState(value)
  const inputRef = React.useRef()

  const onChange = e => setV(e.target.value)
  const onFocus = e => inputRef.current.select()
  const onBlur = e => value === v ? 0 : setState(v)

  return (
    <input
      style={style}
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
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <button onClick={addPair} style={buttonStyle}>+ add new shortcut</button>
      </div>
      <div style={tableStyle}>
        {uids.map(
          (uid, i) => (
            <div key={uid} style={pairStyle}>
              <button
                style={deleteButtonStyle}
                onClick={deletePair(i)}
              >-
              </button>
              <Input
                style={inputStyle('key')}
                value={keys[i]}
                setState={setStateBy(i, keys, setKeys)}
              />
              <Input
                style={inputStyle('val')}
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
