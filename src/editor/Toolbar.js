import React from 'react'

const Toolbar = ({ editor }) => {
  const toggleBold = e => {
    e.preventDefault()
    editor.toggleMark({ type: 'bold' })
  }
  const toggleItalic = e => {
    e.preventDefault()
    editor.toggleMark({ type: 'italic' })
  }
  const toggleStrikethrough = e => {
    e.preventDefault()
    editor.toggleMark({ type: 'strikethrough' })
  }
  const setCodeBlock = e => {
    e.preventDefault()
    editor.isCodeBlock() ? editor.setBlocks({ type: 'paragraph' }) : editor.setBlocks({ type: 'code' })
  }
  const setQuotationBlock = e => {
    e.preventDefault()
    editor.isQuotationBlock() ? editor.setBlocks({ type: 'paragraph' }) : editor.setBlocks({ type: 'quotation' })
  }
  const setParagraphBlock = e => {
    e.preventDefault()
    editor.setBlocks({ type: 'paragraph' })
  }
  return (
    <div>
      <div>
        <button
          onMouseDown={toggleBold}
          color={editor.isBoldActive() ? 'secondary' : 'default'}
        >
          {'bold'}
        </button>
        <button
          onMouseDown={toggleItalic}
          color={editor.isItalicActive() ? 'secondary' : 'default'}
        >
          {'italic'}
        </button>
        <button
          onMouseDown={toggleStrikethrough}
          color={editor.isStrikethroughActive() ? 'secondary' : 'default'}
        >
          {'strike'}
        </button>
      </div>
      <div>
        <button
          onMouseDown={setParagraphBlock}
          color={editor.isParagraphBlock() ? 'secondary' : 'default'}
        >
          {'paragraph'}
        </button>
        <button
          onMouseDown={setQuotationBlock}
          color={editor.isQuotationBlock() ? 'secondary' : 'default'}
        >
          {'quote'}
        </button>
        <button
          onMouseDown={setCodeBlock}
          color={editor.isCodeBlock() ? 'secondary' : 'default'}
        >
          {'code'}
        </button>
      </div>
    </div>
  )
}

export default Toolbar
