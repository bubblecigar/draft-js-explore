import React from 'react'

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
  // internal data: v, external data: value
  const [v, setV] = React.useState(value)
  const [isFocused, setIsFocused] = React.useState(false)
  const inputRef = React.useRef()

  const onChange = e => setV(e.target.value)
  const onFocus = e => {
    inputRef.current.select()
    setIsFocused(true)
  }
  // export internal data
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

const KeyMapTable = ({ suggestionMap, setSuggestionMap }) => {
  // internal suggestion data
  const [keys, setKeys] = React.useState(null)
  const [vals, setVals] = React.useState(null)
  const [uids, setUids] = React.useState(null)
  const [nextId, setNextId] = React.useState(null)

  // sync internal data and external data
  React.useEffect(
    () => {
      if (suggestionMap) {
        // flatten suggestionMap to keys[] : vals[] pair
        setKeys(Object.keys(suggestionMap))
        setVals(Object.keys(suggestionMap).map(key => suggestionMap[key]))
        // dynamic generate unique keyId for new pair
        setUids(Object.keys(suggestionMap).map((key, i) => i))
        setNextId(Object.keys(suggestionMap).length)
      }
    }, [suggestionMap]
  )

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

  // bind keys[] : vals[] pair to generate new suggestionMap
  const bind = (keys, vals) => keys.reduce(
    (acc, key, i) => (
      key ? { ...acc, [key]: vals[i] } : { ...acc }
    ), {}
  )

  const exportMap = () => setSuggestionMap(bind(keys, vals))

  return uids ? (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <button onClick={addPair} style={buttonStyle}>+ add new shortcut</button>
        <button onClick={exportMap} style={buttonStyle}>> save shortcuts</button>
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
