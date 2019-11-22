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
import Place from './plugins/Place'
import { createMarkButton, createBlockButton } from './plugins/buttonMaker'
import { textCounter } from './plugins/TextCountPlugin'

/* ---------  CSS  --------- */
import EditorStylePlugin from './plugins/EditorStylePlugin'
import { toggleButtonStyle } from './styles/buttonStyle'

// global ref for plugin to access internal data of the component
const ref = { export: null }

const staticPlugins = [
  EditorStylePlugin({
    border: '1px solid lightgray',
    padding: '7px'
  }),
  HighlightFocusedBlockPlugin('rgba(0,0,0,.05)'),
  ...CmdKeyPlugins,
  ...CtrlKeyPlugins,
  TabIndentPlugin,
  Place({
    topLeftItems: [
      createMarkButton({
        type: 'bold',
        label: 'Bold'
      }),
      createMarkButton({
        type: 'italic',
        label: 'Italic'
      }),
      createMarkButton({
        type: 'strikethrough',
        label: 'Strike'
      })
    ],
    topRightItems: [
      createBlockButton({
        type: 'paragraph',
        label: 'Para...'
      }),
      createBlockButton({
        type: 'code',
        label: '<Code />'
      }),
      createBlockButton({
        type: 'quotation',
        label: '"Quate"'
      })
    ],
    bottomLeftItems: [
      editor => {
        const save = () => ref.export ? ref.export() : null
        return (
          <button
            style={toggleButtonStyle({})}
            onClick={save}
          > > Save
          </button>
        )
      }
    ],
    bottomRightItems: [
      textCounter
    ]
  })
]

const H2oEditor = ({ suggestionMap, content, setContent }) => {
  // plugins
  const [plugins, setPlugins] = React.useState(staticPlugins)
  // dynamically update suggestion plugin
  React.useEffect(
    () => {
      if (suggestionMap) {
        setPlugins([...staticPlugins, SuggestionPortalPlugin(suggestionMap)])
      }
    }, [suggestionMap]
  )

  // internal data: value, external data: content
  const [value, setValue] = React.useState(content)
  // sync internal & external data
  React.useEffect(
    () => {
      setValue(content)
    }, [content]
  )
  // export internal data
  React.useEffect(
    () => {
      // pass the hook for plugin to trigger exporting behavior
      ref.export = () => setContent(value)
    }, [value, setContent]
  )

  const onChange = change => {
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
