import React from 'react'
import SuggestionMapAPI from './api/SuggestionMapAPI'

const tableStyle = {
  display: 'flex',
  flexFlow: 'column wrap',
  height: '500px',
  alignItems: 'center',
  margin: '10px 0px',
  overflow: 'scroll',
  border: '1px solid lightgray'
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
  cursor: 'pointer',
  fontWeight: 'bold'
}

const Input = ({ value, setState, style }) => {
  const [v, setV] = React.useState(value)
  const [isFocused, setIsFocused] = React.useState(false)
  const inputRef = React.useRef()

  const onChange = e => setV(e.target.value)
  const onFocus = e => {
    inputRef.current.select()
    setIsFocused(true)
  }
  const onBlur = e => {
    if (value !== v) {
      setState(v)
    }
    setIsFocused(false)
  }

  return (
    <input
      style={{
        ...style,
        backgroundColor: isFocused ? 'rgba(0,0,0,.05)' : 'white'
      }}
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
      SuggestionMapAPI.importer()
        .then(
          data => {
          // flatten table to keys[] : vals[] pair
            setKeys(Object.keys(data))
            setVals(Object.keys(data).map(key => data[key]))
            // dynamic generate unique keyId for new pair
            setUids(Object.keys(data).map((key, i) => i))
            setNextId(Object.keys(data).length)
          }
        )
        .then(
          () => {
            ready.current = true
          }
        )
        .catch(
          err => console.log('Fail to fetch suggestion map:', err)
        )
    }, []
  )

  const [keys, setKeys] = React.useState(null)
  const [vals, setVals] = React.useState(null)
  const [uids, setUids] = React.useState(null)
  const [nextId, setNextId] = React.useState(null)
  const ready = React.useRef(false)

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

  React.useEffect(
    () => {
      if (ready.current && keys && vals) {
        SuggestionMapAPI.exporter(bind(keys, vals))
        // send to SuggestionPortalPlugin.js
        document.dispatchEvent(new window.CustomEvent('suggestionMapUpdated'))
      }
    }, [keys, vals]
  )

  return uids ? (
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
  ) : null
}

export default KeyMapTable
