import React from 'react'

const HighlightFocusedBlockPlugin = {
  renderBlock: (props, editor, next) => {
    return props.isFocused ? (
      <div style={{ backgroundColor: 'rgba(0,0,0,.05)' }}>
        {next()}
      </div>) : next()
  }
}

export default HighlightFocusedBlockPlugin
