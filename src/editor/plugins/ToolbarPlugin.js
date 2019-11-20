import React from 'react'
import styleQueryPlugin from './styleQueryPlugin'

const containerStyle = {
  padding: '10%',
  paddingBottom: '30px'
}
const toolbarStyle = {
  display: 'flex',
  justifyContent: 'space-between'
}
const moduleStyle = {}

const buttonStyle = ({ active }) => ({
  margin: '10px 5px',
  backgroundColor: active ? 'gold' : 'transparent'
})

const makeButton = ({ mouseDownHandler, styleHandler }) => ({ editor, label }) => (
  <button
    style={styleHandler(editor)}
    onMouseDown={mouseDownHandler(editor)}
  >
    {label}
  </button>
)
const makeToggleMarkButton = ({ type }) => makeButton({
  mouseDownHandler: editor => e => {
    e.preventDefault()
    editor.toggleMark({ type })
  },
  styleHandler: editor => editor.isMarkTypeActive(type)
    ? buttonStyle({ active: true })
    : buttonStyle({ active: false })
})
const ToggleMarkButton = ({ type, label, editor }) => (
  makeToggleMarkButton({ type })({ editor, label })
)

const makeSetBlockButton = ({ type }) => makeButton({
  mouseDownHandler: editor => e => {
    e.preventDefault()
    editor.setBlocks({ type })
  },
  styleHandler: editor => editor.isBlockTypeActive(type)
    ? buttonStyle({ active: true })
    : buttonStyle({ active: false })
})
const SetBlockButton = ({ type, label, editor }) => (
  makeSetBlockButton({ type })({ editor, label })
)

const Toolbar = ({ editor }) => (
  <div style={toolbarStyle}>
    <div style={moduleStyle}>
      <ToggleMarkButton
        editor={editor}
        type='bold'
        label='Bold'
      />
      <ToggleMarkButton
        editor={editor}
        type='italic'
        label='Italic'
      />
      <ToggleMarkButton
        editor={editor}
        type='strikethrough'
        label='Strike'
      />
    </div>
    <div style={moduleStyle}>
      <SetBlockButton
        editor={editor}
        type='paragraph'
        label='Para...'
      />
      <SetBlockButton
        editor={editor}
        type='quotation'
        label='Qua.'
      />
      <SetBlockButton
        editor={editor}
        type='code'
        label='<code>'
      />
    </div>
  </div>
)

const ToolbarPlugin = {
  renderEditor: (props, editor, next) => {
    return (
      <div style={containerStyle}>
        <Toolbar editor={editor} />
        {next()}
      </div>
    )
  },
  ...styleQueryPlugin
}

export { ToolbarPlugin }
