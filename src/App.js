import React from 'react'
import editorCreator from './editor/Editor.js'
import KeyMapTable from './editor/KeyMapTable'

// store
import store from 'store-js'

function App () {
  const suggestionMapExporter = data => { store.set('client-suggestionMap', data) }
  const suggestionMapImporter = () => store.get('client-suggestionMap')
  const Editor = editorCreator({ suggestionMapImporter })
  return (
    <>
      <Editor />
      <KeyMapTable table={suggestionMapImporter()} suggestionMapExporter={suggestionMapExporter} />
    </>
  )
}
export default App
