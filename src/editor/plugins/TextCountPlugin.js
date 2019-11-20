import React from 'react'

const style = {
  padding: '5px',
  textAlign: 'right'
}

const TextCountPlugin = {
  renderEditor: (props, editor, next) => {
    const totalText = editor.value.document.text.split(' ').join('').split('\n').join('').length
    return (
      <>
        {next()}
        <div style={style}>{totalText}</div>
      </>
    )
  }
}

export default TextCountPlugin
