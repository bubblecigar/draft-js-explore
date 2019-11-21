import React from 'react'

const style = {
  padding: '5px',
  textAlign: 'right',
  backgroundColor: 'lightgray',
  color: 'white',
  fontFamily: `source-code-pro, Menlo, Monaco, Consolas, "Courier New",
  monospace`,
  fontWeight: 'bold'
}

const calLength = str => str.split(' ').join('').split('\n').join('').length

const TextCountPlugin = {
  renderEditor: (props, editor, next) => {
    const totalText = calLength(editor.value.document.text)
    const selectedText = calLength(editor.value.fragment.text)
    return (
      <>
        {next()}
        <div style={style}>{selectedText} sel.</div>
        <div style={style}>{totalText} tot.</div>
      </>
    )
  }
}

export default TextCountPlugin
