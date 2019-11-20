import React from 'react'
import SuggestionPlugin from './SuggestionPlugin'

const portalStyle = ({ open, xOffset, yOffset }) => ({
  display: open ? 'flex' : 'none',
  flexFlow: 'column',
  overflow: 'scroll',
  maxHeight: '136px',
  minWidth: '100px',

  position: 'fixed',
  left: xOffset,
  top: yOffset,
  transform: 'translate3d(-5px,5px,0)',

  border: '1px dashed gray'
})

const optionStyle = ({ select, firstChild, lastChild }) => {
  const baseStyle = {
    backgroundColor: 'white',
    color: 'gray',
    padding: '7px 14px 7px 7px',
    fontWeight: 'bold',
    border: '1px solid transparent',
    cursor: 'pointer'
  }
  const selectStyle = {
    backgroundColor: 'gray',
    color: 'white',
    borderTop: '1px dashed white',
    borderBottom: '1px dashed white'
  }
  const lastStyle = {
    borderBottom: '1px solid transparent'
  }
  const firstStyle = {
    borderTop: '1px solid transparent'
  }
  return Object.assign(
    {},
    baseStyle,
    select ? selectStyle : {},
    firstChild ? firstStyle : {},
    lastChild ? lastStyle : {}
  )
}

const Portal = ({ editor }) => {
  // portal state, listen to editor
  const [open, setOpen] = React.useState(true)
  const [index, setIndex] = React.useState(0)

  // portal position
  const [xOffset, setXOffset] = React.useState(0)
  const [yOffset, setYOffset] = React.useState(0)
  const portalRef = React.useRef(null)

  // computed suggestion list
  const [suggestionList, setSuggestionList] = React.useState([])

  const lastWord = editor.getLastWord()
  React.useEffect(() => {
    setSuggestionList(editor.getSuggestionList())
    try {
      const rect = window.getSelection().getRangeAt(0).getBoundingClientRect()
      setXOffset(rect.left)
      setYOffset(rect.bottom)
    } catch {
      console.log('uncaught caret position')
    }
  }, [editor, lastWord])

  const editorEventHandler = e => {
    switch (e.detail.instruction) {
      case 'open': {
        setIndex(0)
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
        portalRef.current && portalRef.current.children[newIndex].scrollIntoView({
          block: 'nearest',
          inline: 'nearest'
        })
        break
      }
      case 'decre': {
        const newIndex = (index - 1 + suggestionList.length) % suggestionList.length || 0
        setIndex(newIndex)
        portalRef.current && portalRef.current.children[newIndex].scrollIntoView({
          block: 'nearest',
          inline: 'nearest'
        })
        break
      }
      case 'enter': {
        const suggestion = suggestionList[index]
        if (suggestion) {
          editor && editor.replaceLastWord(suggestionList[index]).insertText(' ')
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

  const onMouseDown = index => e => {
    e.preventDefault()
    setIndex(index)
    setOpen(false)
    editor.replaceLastWord(suggestionList[index])
  }
  const onMouseOver = index => e => {
    e.preventDefault()
    setIndex(index)
  }

  return (
    suggestionList.length
      ? (
        <div
          ref={portalRef}
          style={portalStyle({
            open,
            xOffset,
            yOffset
          })}
        >
          {
            suggestionList.map(
              (option, i) => (
                <div
                  key={i}
                  onMouseOver={onMouseOver(i)}
                  onMouseDown={onMouseDown(i)}
                  style={optionStyle({
                    select: index === i,
                    firstChild: i === 0,
                    lastChild: i === suggestionList.length - 1
                  })}
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

const PortalPlugin = {
  ...SuggestionPlugin,
  renderEditor: (props, editor, next) => (
    <>
      {next()}
      <Portal editor={editor} />
    </>
  )
}

export default PortalPlugin
