import React from 'react'
import LastWordPlugin from './LastWordPlugin'

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

// sharing data between Portal and EventDispatcher
const suggestionList = {
  value: [],
  clear: () => { suggestionList.value = [] }
}

const Portal = ({ editor }) => {
  // portal state, listen to editor
  const [open, setOpen] = React.useState(false)
  const [index, setIndex] = React.useState(0)

  // portal position
  const [xOffset, setXOffset] = React.useState(0)
  const [yOffset, setYOffset] = React.useState(0)
  const portalRef = React.useRef(null)

  const updatePortalPosition = () => {
    try {
      const rect = window.getSelection().getRangeAt(0).getBoundingClientRect()
      setXOffset(rect.left)
      setYOffset(rect.bottom)
    } catch {
      console.log('uncaught caret position')
    }
  }

  const editorEventHandler = e => {
    switch (e.detail.instruction) {
      case 'open': {
        updatePortalPosition()
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
        const newIndex = (index + 1) % suggestionList.value.length || 0
        setIndex(newIndex)
        portalRef.current && portalRef.current.children[newIndex].scrollIntoView({
          block: 'nearest',
          inline: 'nearest'
        })
        break
      }
      case 'decre': {
        const newIndex = (index - 1 + suggestionList.value.length) % suggestionList.value.length || 0
        setIndex(newIndex)
        portalRef.current && portalRef.current.children[newIndex].scrollIntoView({
          block: 'nearest',
          inline: 'nearest'
        })
        break
      }
      case 'enter': {
        const suggestion = suggestionList.value[index]
        if (suggestion) {
          editor.replaceLastWord(suggestionList.value[index]).insertText(' ')
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
    editor.replaceLastWord(suggestionList.value[index])
  }
  const onMouseOver = index => e => {
    e.preventDefault()
    setIndex(index)
  }

  return (
    suggestionList.value.length
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
            suggestionList.value.map(
              (option, i) => (
                <div
                  key={i}
                  onMouseOver={onMouseOver(i)}
                  onMouseDown={onMouseDown(i)}
                  style={optionStyle({
                    select: index === i,
                    firstChild: i === 0,
                    lastChild: i === suggestionList.value.length - 1
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

const EventDispatcher = () => {
  const editorEmittedEvent = instruction => (
    new window.CustomEvent('editorEmittedEvent', { detail: { instruction } })
  )

  const onKeyDown = (e, editor, next) => {
    if (e.keyCode >= 65 && e.keyCode <= 90 && !e.ctrlKey && !e.metaKey) {
    // a-65 z-90
      suggestionList.value = [...editor.getSuggestionListOf(e.key)]
      document.dispatchEvent(editorEmittedEvent('open'))
      return next()
    } else if (suggestionList.value.length) {
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
          suggestionList.clear()
          return
        }
        default: {
          document.dispatchEvent(editorEmittedEvent('close'))
          suggestionList.clear()
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

  return ({ onKeyDown, onMouseDown })
}

const SuggestionPortal = suggestionMap => ({
  ...LastWordPlugin(suggestionMap),
  ...EventDispatcher(),
  renderEditor: (props, editor, next) => (
    <>
      {next()}
      <Portal editor={editor} />
    </>
  )
})

export default SuggestionPortal
