import React from 'react'

const containerStyle = {
  padding: '10%'
}
const toolbarStyle = {
  display: 'flex',
  justifyContent: 'space-between'
}
const moduleStyle = {

}
const buttonStyle = {
  margin: '10px 5px'
}

const makeButton = ({ callback }) => ({ editor, label }) => {
  return (
    <button
      style={buttonStyle}
      onMouseDown={callback(editor)}
    >
      {label}
    </button>
  )
}
const makeToggleMarkButton = ({ type }) => makeButton({
  callback: editor => e => {
    e.preventDefault()
    editor.toggleMark({ type })
  }
})
const ToggleMarkButton = ({ type, label, editor }) => (
  makeToggleMarkButton({ type })({ editor, label })
)

const makeSetBlockButton = ({ type }) => makeButton({
  callback: editor => e => {
    e.preventDefault()
    editor.setBlocks({ type })
  }
})
const SetBlockButton = ({ type, label, editor }) => (
  makeSetBlockButton({ type })({ editor, label })
)

const TopToolbar = ({ editor }) => (
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
        <TopToolbar editor={editor} />
        {next()}
      </div>
    )
  }
}

export { ToolbarPlugin }
