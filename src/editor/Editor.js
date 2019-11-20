// core
import React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'

// plugins
/* ------ KeyBinding ------- */
import CmdKeyPlugins from './plugins/CmdKeyPlugins'
import CtrlKeyPlugins from './plugins/CtrlKeyPlugins'
import TabIndentPlugin from './plugins/TabIndentPlugin'

/* ------ Decoration ------- */
import HighlightFocusedBlockPlugin from './plugins/HighlightFocusedBlockPlugin'

/* ------ Suggestion ------- */
import SuggestionPortal from './plugins/SuggestionPortal'
import suggestionMap from './plugins/suggestionMap'

/* ---------  GUI  --------- */
import ToolbarPlugin from './plugins/ToolbarPlugin'
import TextCountPlugin from './plugins/TextCountPlugin'

// save & load
import store from 'store-js'

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
  SuggestionPortal(suggestionMap)
]

const MyEditor = props => {
  const [value, setValue] = React.useState(initialValue)

  const onChange = change => {
    // save change to localStorage
    const jsonStr = JSON.stringify(change.value.toJSON())
    store.set('slateJs-demo', jsonStr)

    // update editor
    setValue(change.value)
  }

  return (
    <Editor
      onChange={onChange}
      value={value}
      plugins={plugins}
      autoFocus
      placeholder='Type something here...'
    />
  )
}

export default MyEditor
