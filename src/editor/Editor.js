// core
import React from 'react'
import { Editor } from 'slate-react'

// plugins
/* ------ KeyBinding ------- */
import CmdKeyPlugins from './plugins/CmdKeyPlugins'
import CtrlKeyPlugins from './plugins/CtrlKeyPlugins'
import TabIndentPlugin from './plugins/TabIndentPlugin'

/* ------ Decoration ------- */
import HighlightFocusedBlockPlugin from './plugins/HighlightFocusedBlockPlugin'

/* ------ Suggestion ------- */
import SuggestionPortalPlugin from './plugins/SuggestionPortalPlugin'

/* ---------  GUI  --------- */
import ToolbarPlugin from './plugins/ToolbarPlugin'
import TextCountPlugin from './plugins/TextCountPlugin'

/* --------- Style -------- */
import EditorStylePlugin from './plugins/EditorStylePlugin'

// save & load
import EditorContentAPI from './api/EditorContentAPI'

const plugins = [
  HighlightFocusedBlockPlugin('rgba(0,0,0,.1)'),
  ...CmdKeyPlugins,
  ...CtrlKeyPlugins,
  TabIndentPlugin,
  ToolbarPlugin,
  TextCountPlugin,
  SuggestionPortalPlugin,
  EditorStylePlugin({
    border: '1px solid lightgray',
    padding: '7px'
  })
]

const H2oEditor = props => {
  // fetch EditorContent
  React.useEffect(
    () => {
      const initVal = EditorContentAPI.importer()
      setValue(initVal)
    }, []
  )

  const [value, setValue] = React.useState(null)

  const onChange = change => {
    // export EditorContent when substantial change occurs
    if (change.value.document !== value.document) {
      EditorContentAPI.exporter(change)
    }

    // update editor
    setValue(change.value)
  }

  return value ? (
    <Editor
      onChange={onChange}
      value={value}
      plugins={plugins}
      autoFocus
    />
  ) : null
}

export default H2oEditor
