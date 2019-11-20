import React from 'react'

const style = {
  padding: '5px',
  textAlign: 'right'
}

const TextCountPlugin = {
  renderEditor: (props, editor, next) => {
    const totalText = editor.value.document.text.split(' ').join('').split('\n').join('').length
    const selectedText = editor.value.fragment.text.length
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
