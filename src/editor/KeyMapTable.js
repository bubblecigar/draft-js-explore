import React from 'react'

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
  const onBlur = e => setState(v)

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

const KeyMapTable = ({ table }) => {
  // flatten table to keys[] : vals[] pair
  const [keys, setKeys] = React.useState(Object.keys(table))
  const [vals, setVals] = React.useState(keys.map(key => table[key]))
  // dynamic generate unique keyId for new pair
  const [uids, setUids] = React.useState(keys.map((key, i) => i))
  const [nextId, setNextId] = React.useState(keys.length)

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

  // combine keys[] : vals[] pair back into table
  const getTable = () => {
    const table = {}
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] && vals[i]) {
        table[keys[i]] = vals[i]
      }
    }
    return table
  }

  return (
    <div style={tableStyle}>
      <button onClick={addPair}>add new shortcut</button>
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
  )
}

export default KeyMapTable
