import React from 'react'

const HighlightFocusedBlockPlugin = backgroundColor => (
  {
    renderBlock: (props, editor, next) => {
      return props.isFocused ? (
        <div style={{ backgroundColor }}>
          {next()}
        </div>) : next()
    }
  }
)
export default HighlightFocusedBlockPlugin
