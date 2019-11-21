import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import Editor from './editor/Editor.js'
import KeyMapTable from './editor/KeyMapTable'
import { Divider } from '@material-ui/core'

function App () {
  return (
    <>
      <div style={{
        padding: '30px'
      }}
      >
        <Editor />
      </div>
      <Divider />
      <div style={{
        padding: '30px'
      }}
      >
        <KeyMapTable />
      </div>
    </>
  )
}
export default App
