import React from 'react'
import Editor from './editor/Editor.js'
import KeyMapTable from './editor/KeyMapTable'
import { Divider } from '@material-ui/core'

const containerStyle = {
  width: '80%',
  maxWidth: '1000px',
  minWidth: '500px',
  margin: '0 auto'
}

const headingStyle = {
  textAlign: 'center',
  paddingTop: '30px',
  fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New",monospace'
}

const componentStyle = {
  padding: '30px',
  paddingBottom: '60px'
}

function App () {
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>
        {'<Editor />'}
      </h1>
      <div style={componentStyle}>
        <Editor />
      </div>
      <Divider />
      <h1 style={headingStyle}>
        {'<KeyMapTable />'}
      </h1>
      <div style={componentStyle}>
        <KeyMapTable />
      </div>
    </div>
  )
}
export default App
