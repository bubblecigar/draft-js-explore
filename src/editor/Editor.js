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
import TabIndentPlugin from './plugins/TabIndentPlugin'
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
            text: ' A line of text in a paragraph.'
          }
        ]
      }
    ]
  }
})

const plugins = [
  styleQueryPlugin,
  triggerReplacePlugin,
  HighlightFocusedBlockPlugin('rgba(0,0,0,.1)'),
  ...CmdKeyPlugins,
  ...CtrlKeyPlugins,
  TabIndentPlugin
]

const Portal = ({ editorRef, suggestionListRef }) => {
  const [open, setOpen] = React.useState(true)
  const [index, setIndex] = React.useState(0)
  const [xOffset, setXOffset] = React.useState(0)
  const [yOffset, setYOffset] = React.useState(0)
  const hintRef = React.useRef()

  // Array
  const suggestionList = suggestionListRef.current || []

  const editorEventHandler = e => {
    switch (e.detail.instruction) {
      case 'open': {
        try {
          const rect = window.getSelection().getRangeAt(0).getBoundingClientRect()
          setXOffset(rect.left)
          setYOffset(rect.bottom)
        } catch {
          console.log('uncaught caret position')
        }
        setOpen(true)
        break
      }
      case 'close': {
        setOpen(false)
        setIndex(0)
        break
      }
      case 'incre': {
        const newIndex = (index + 1) % suggestionList.length || 0
        setIndex(newIndex)
        hintRef.current && hintRef.current.children[newIndex].scrollIntoView({
          block: 'nearest',
          inline: 'nearest'
        })
        break
      }
      case 'decre': {
        const newIndex = (index - 1 + suggestionList.length) % suggestionList.length || 0
        setIndex(newIndex)
        hintRef.current && hintRef.current.children[newIndex].scrollIntoView({
          block: 'nearest',
          inline: 'nearest'
        })
        break
      }
      case 'enter': {
        const suggestion = suggestionList[index]
        if (suggestion) {
          editorRef.current && editorRef.current.replaceLastWord(suggestionList[index]).insertText(' ')
        }
        setIndex(0)
        setOpen(false)
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

  const onMouseDown = index => (e, editor, next) => {
    e.preventDefault()
    setIndex(index)
    setOpen(false)
    editorRef.current && editorRef.current.replaceLastWord(suggestionList[index])
  }
  const onMouseOver = index => e => {
    e.preventDefault()
    setIndex(index)
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
          ref={hintRef}
        >
          {
            suggestionList.map(
              (option, i) => (
                <div
                  key={i}
                  onMouseOver={onMouseOver(i)}
                  onMouseDown={onMouseDown(i)}
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
    if (e.keyCode >= 65 && e.keyCode <= 90) { // a-65 z-90
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
      <Portal
        editorRef={editorRef}
        suggestionListRef={suggestionListRef}
      />
    </div>
  )
}

export default MyEditor

// class component
// class Portal extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       open: true,
//       index: 0
//     }
//     this.getSuggestionList = this.getSuggestionList.bind(this)
//     this.editorEventHandler = this.editorEventHandler.bind(this)
//     this.handleMouseDown = this.handleMouseDown.bind(this)
//   }

//   componentDidMount () {
//     document.addEventListener('editorEmittedEvent', this.editorEventHandler)
//   }

//   componentWillUnmount () {
//     document.removeEventListener('editorEmittedEvent', this.editorEventHandler)
//   }

//   getSuggestionList () {
//     return this.props.editorRef.current ? this.props.editorRef.current.getSuggestionList() : []
//   }

//   editorEventHandler (e) {
//     switch (e.detail.instruction) {
//       case 'open': {
//         this.setState({ open: true })
//         break
//       }
//       case 'close': {
//         this.setState({ open: false, index: 0 })
//         break
//       }
//       case 'incre': {
//         this.setState(
//           prevState => ({ index: (prevState.index + 1) % this.getSuggestionList().length || 0 })
//         )
//         break
//       }
//       case 'decre': {
//         this.setState(
//           prevState => ({ index: (prevState.index - 1 + this.getSuggestionList().length) % this.getSuggestionList().length || 0 })
//         )
//         break
//       }
//       case 'enter': {
//         const suggestion = this.getSuggestionList()[this.state.index]
//         if (suggestion) {
//           this.props.editorRef.current && this.props.editorRef.current.replaceLastWord(this.getSuggestionList()[this.state.index]).insertText(' ')
//         } else {
//           if (this.props.editorRef.current) {
//             const currentType = this.props.editorRef.current.value.endBlock.type
//             this.props.editorRef.current.insertBlock(currentType)
//           }
//         }
//         break
//       }
//       default: {
//         console.log('unhandled event:', e)
//         break
//       }
//     }
//   }

//   handleMouseDown (option) {
//     return (e, editor, next) => {
//       e.preventDefault()
//       this.props.editorRef.current && this.props.editorRef.current.replaceLastWord(option)
//     }
//   }

//   render () {
//     const suggestionList = this.props.editorRef.current ? this.props.editorRef.current.getSuggestionList() : []
//     const { open, index } = this.state
//     const { xOffset, yOffset } = this.props
//     return (
//       suggestionList.length
//         ? (
//           <div
//             id='hint'
//             style={{
//               display: open ? 'flex' : 'none',
//               position: 'fixed',
//               left: xOffset,
//               top: yOffset
//             }}
//           >
//             {
//               suggestionList.map(
//                 (option, i) => (
//                   <div
//                     key={option}
//                     className={index === i ? 'selected option' : 'option'}
//                     onMouseDown={this.handleMouseDown(option)}
//                   >
//                     {option}
//                   </div>
//                 )
//               )
//             }
//           </div>
//         )
//         : null
//     )
//   }
// }
