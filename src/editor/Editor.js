// core
import React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'

// save & load
import store from 'store-js'

// plugins
/* -------KeyBinding ------- */
import CmdKeyPlugins from './plugins/CmdKeyPlugins'
import CtrlKeyPlugins from './plugins/CtrlKeyPlugins'
// -------Decoration ------- */
import HighlightFocusedBlockPlugin from './plugins/HighlightFocusedBlockPlugin'
import styleQueryPlugin from './plugins/styleQueryPlugin'
// -------AutoReplace ------- */
import triggerReplacePlugin from './plugins/triggerReplacePlugin'

// GUI
// import Toolbar from './Toolbar'

// CSS
import './editor.css'

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
            text: 'A line of text in a paragraph.'
          }
        ]
      }
    ]
  }
})

const plugins = [
  styleQueryPlugin,
  triggerReplacePlugin,
  HighlightFocusedBlockPlugin,
  ...CmdKeyPlugins,
  ...CtrlKeyPlugins
]

const Hint = ({ editorRef, xOffset, yOffset }) => {
  const [open, setOpen] = React.useState(true)
  const [index, setIndex] = React.useState(0)

  // Array
  const suggestionList = editorRef.current ? editorRef.current.getSuggestionList() : []

  const editorEventHandler = e => {
    switch (e.detail.instruction) {
      case 'open': {
        setOpen(true)
        break
      }
      case 'close': {
        setOpen(false)
        setIndex(0)
        break
      }
      case 'incre': {
        setIndex((index + 1) % suggestionList.length || 0)
        break
      }
      case 'decre': {
        setIndex((index - 1 + suggestionList.length) % suggestionList.length || 0)
        break
      }
      case 'enter': {
        const suggestion = suggestionList[index]
        if (suggestion) {
          editorRef.current && editorRef.current.replaceLastWord(suggestionList[index]).insertText(' ')
        } else {
          if (editorRef.current) {
            const currentType = editorRef.current.value.endBlock.type
            editorRef.current.insertBlock(currentType)
          }
        }
        break
      }
      default: {
        console.log('unhandled event:', e)
        break
      }
    }
  }
  React.useEffect(
    () => {
      document.addEventListener('editorEmittedEvent', editorEventHandler)
      return () => { document.removeEventListener('editorEmittedEvent', editorEventHandler) }
    }
  )

  const onMouseDown = option => (e, editor, next) => {
    e.preventDefault()
    editorRef.current && editorRef.current.replaceLastWord(option)
  }
  return (
    suggestionList.length
      ? (
        <div
          id='hint'
          style={{
            display: open ? 'flex' : 'none',
            position: 'fixed',
            left: xOffset,
            top: yOffset
          }}
        >
          {
            suggestionList.map(
              (option, i) => (
                <div
                  key={option}
                  onMouseDown={onMouseDown(option)}
                  className={index === i ? 'selected option' : 'option'}
                >
                  {option}
                </div>
              )
            )
          }
        </div>
      )
      : null
  )
}

const MyEditor = props => {
  const [value, setValue] = React.useState(initialValue)
  const [xOffset, setXOffset] = React.useState(0)
  const [yOffset, setYOffset] = React.useState(0)
  const editorRef = React.useRef()
  const suggestionListStateRef = React.useRef(false) // useRef to handle keydown closure problem

  const onChange = (change) => {
    // save change to localStorage
    const jsonStr = JSON.stringify(change.value.toJSON())
    store.set('slateJs-demo', jsonStr)
    // update editor
    setValue(change.value)

    // update caret position
    try {
      const rect = window.getSelection().getRangeAt(0).getBoundingClientRect()
      setXOffset(rect.left)
      setYOffset(rect.bottom)
    } catch {
      console.log('hello')
    }
  }

  const editorEmittedEvent = instruction => (
    new window.CustomEvent('editorEmittedEvent', { detail: { instruction } })
  )
  const onKeyDown = (e, editor, next) => {
    if (e.keyCode >= 65 && e.keyCode <= 90) { // a-65 z-90
      document.dispatchEvent(editorEmittedEvent('open'))
      suggestionListStateRef.current = true
    } else if (e.keyCode === 38) { // up
      if (suggestionListStateRef.current === true) {
        document.dispatchEvent(editorEmittedEvent('decre'))
        e.preventDefault()
      }
    } else if (e.keyCode === 40) { // down
      if (suggestionListStateRef.current === true) {
        document.dispatchEvent(editorEmittedEvent('incre'))
        e.preventDefault()
      }
    } else if (e.keyCode === 13) { // enter
      if (suggestionListStateRef.current === true) {
        document.dispatchEvent(editorEmittedEvent('enter'))
        e.preventDefault()

        // terminate change line behavior
        return
      }
    } else {
      document.dispatchEvent(editorEmittedEvent('close'))
      suggestionListStateRef.current = false
    }
    return next()
  }

  const onMouseDown = (e, editor, next) => {
    document.dispatchEvent(editorEmittedEvent('close'))
    return next()
  }

  return (
    <div>
      <Editor
        id='editor'
        ref={editorRef}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
        value={value}
        plugins={plugins}
        autoFocus
        placeholder='Type something here...'
      />
      <Hint
        editorRef={editorRef}
        xOffset={xOffset}
        yOffset={yOffset}
      />
    </div>
  )
}

export default MyEditor
