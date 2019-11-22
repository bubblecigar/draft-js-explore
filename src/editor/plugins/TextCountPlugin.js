import React from 'react'

const style = {
  padding: '5px',
  textAlign: 'right',
  color: 'gray',
  fontFamily: `source-code-pro, Menlo, Monaco, Consolas, "Courier New",
  monospace`,
  fontWeight: 'bold'
}

const calLength = str => str.split(' ').join('').split('\n').join('').length

const textCounter = editor => {
  const totalText = calLength(editor.value.document.text)
  const selectedText = calLength(editor.value.fragment.text)
  return (
    <div style={style}>
      <span>{selectedText} sel /</span>
      <span> {totalText} tot</span>
    </div>
  )
}

const TextCountPlugin = {
  renderEditor: (props, editor, next) => {
    const totalText = calLength(editor.value.document.text)
    const selectedText = calLength(editor.value.fragment.text)
    return (
      <>
        {next()}
        <div style={style}>
          <span>{selectedText} sel /</span>
          <span> {totalText} tot</span>
        </div>
      </>
    )
  }
}

export default TextCountPlugin
export { textCounter }
