import React from 'react'
import H2oEditor from './editor/Editor.js'
import KeyMapTable from './editor/KeyMapTable'
import { Divider } from '@material-ui/core'

// for importer and exporter
import store from 'store-js'
import { Value } from 'slate'
import defaultMap from './editor/static/defaultMap.js'

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

const getContent = () => {
  const storedJsonStr = store.get('slateJs-demo') // json || undefined
  const json = storedJsonStr ? JSON.parse(storedJsonStr) : ''
  const initialValue = Value.fromJSON(json || {
    document: {
      nodes: [
        {
          object: 'block',
          type: 'paragraph',
          nodes: [
            {
              object: 'text',
              text: ''
            }
          ]
        }
      ]
    }
  })
  return initialValue
}

const storedMap = defaultMap
const storedContent = getContent()

function App () {
  // map data
  const [suggestionMap, setSuggestionMap] = React.useState(null)
  // init map data
  React.useEffect(
    () => {
      const storedMap = store.get('h2O-editor-suggestionMap')
      setSuggestionMap(storedMap || {})
    }, []
  )
  // export map data
  React.useEffect(
    () => {
      if (suggestionMap !== storedMap) {
        store.set('h2O-editor-suggestionMap', suggestionMap)
      }
    }, [suggestionMap]
  )

  // content
  const [content, setContent] = React.useState(null)
  // init content
  React.useEffect(
    () => {
      setContent(storedContent)
    }, []
  )
  // export content
  React.useEffect(
    () => {
      if (content && content.document !== storedContent.document) {
        const jsonStr = JSON.stringify(content)
        store.set('slateJs-demo', jsonStr)
      }
    }, [content]
  )

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>
        {'<Editor />'}
      </h1>
      <div style={componentStyle}>
        <H2oEditor
          suggestionMap={suggestionMap}
          content={content}
          setContent={setContent}
        />
      </div>
      <Divider />
      <h1 style={headingStyle}>
        {'<KeyMapTable />'}
      </h1>
      <div style={componentStyle}>
        <KeyMapTable
          suggestionMap={suggestionMap}
          setSuggestionMap={setSuggestionMap}
        />
      </div>
    </div>
  )
}
export default App
