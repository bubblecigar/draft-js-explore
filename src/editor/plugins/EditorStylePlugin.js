import React from 'react'

const EditorStylePlugin = style => ({
  renderEditor: (props, editor, next) => {
    return (
      <div style={style}>
        {next()}
      </div>
    )
  }
})

export default EditorStylePlugin
