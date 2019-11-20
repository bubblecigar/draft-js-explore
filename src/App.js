import React from 'react'
import Editor from './editor/Editor.js'
import KeyMapTable from './editor/KeyMapTable'
import suggestionMap from './editor/plugins/suggestionMap'

function App () {
  return (
    <>
      <Editor />
      <KeyMapTable table={suggestionMap} />
    </>
  )
}

export default App
