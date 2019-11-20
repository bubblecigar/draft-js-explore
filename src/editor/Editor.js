// core
import React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'

// save & load
import store from 'store-js'

// plugins
/* ------ KeyBinding ------- */
import CmdKeyPlugins from './plugins/CmdKeyPlugins'
import CtrlKeyPlugins from './plugins/CtrlKeyPlugins'
import TabIndentPlugin from './plugins/TabIndentPlugin'
// ------ Decoration ------- */
import HighlightFocusedBlockPlugin from './plugins/HighlightFocusedBlockPlugin'
// ------ AutoReplace ------- */
import PortalPlugin from './plugins/PortalPlugin'
// ---------  GUI  --------- */
import { ToolbarPlugin } from './plugins/ToolbarPlugin'
import TextCountPlugin from './plugins/TextCountPlugin'

const storedJsonStr = store.get('slateJs-demo')
const json = JSON.parse(storedJsonStr)
const initialValue = Value.fromJSON(json || {
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            text: ' A line of text in a paragraph.'
          }
        ]
      }
    ]
  }
})

const plugins = [
  HighlightFocusedBlockPlugin('rgba(0,0,0,.1)'),
  ...CmdKeyPlugins,
  ...CtrlKeyPlugins,
  TabIndentPlugin,
  ToolbarPlugin,
  TextCountPlugin,
  PortalPlugin
]

const MyEditor = props => {
  const [value, setValue] = React.useState(initialValue)
  const editorRef = React.useRef(null)

  // useRef to handle keydown closure problem
  const suggestionListRef = React.useRef([])

  const onChange = change => {
    // save change to localStorage
    const jsonStr = JSON.stringify(change.value.toJSON())
    store.set('slateJs-demo', jsonStr)

    // update editor
    setValue(change.value)
  }

  const resetSuggestionList = () => {
    suggestionListRef.current = []
  }
  const editorEmittedEvent = instruction => (
    new window.CustomEvent('editorEmittedEvent', { detail: { instruction } })
  )
  const onKeyDown = (e, editor, next) => {
    if (e.keyCode >= 65 && e.keyCode <= 90 && !e.ctrlKey && !e.metaKey) {
      // a-65 z-90
      suggestionListRef.current = editor.getSuggestionListOf(e.key)
      document.dispatchEvent(editorEmittedEvent('open'))
      return next()
    } else if (suggestionListRef.current.length) {
      switch (e.keyCode) {
        case 38: { // up
          e.preventDefault()
          document.dispatchEvent(editorEmittedEvent('decre'))
          return
        }
        case 40: { // down
          e.preventDefault()
          document.dispatchEvent(editorEmittedEvent('incre'))
          return
        }
        case 13: { // enter
          e.preventDefault()
          document.dispatchEvent(editorEmittedEvent('enter'))
          resetSuggestionList()
          return
        }
        default: {
          document.dispatchEvent(editorEmittedEvent('close'))
          resetSuggestionList()
          return next()
        }
      }
    } else {
      return next()
    }
  }

  const onMouseDown = (e, editor, next) => {
    document.dispatchEvent(editorEmittedEvent('close'))
    return next()
  }

  return (
    <Editor
      ref={editorRef}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      value={value}
      plugins={plugins}
      autoFocus
      placeholder='Type something here...'
    />
  )
}

export default MyEditor
