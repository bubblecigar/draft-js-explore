import React from 'react'

const CmdKeyMark = options => {
  const { type, key } = options
  return {
    onKeyDown: (e, editor, next) => {
      if (!e.metaKey || !(e.key === key)) {
        return next()
      }
      e.preventDefault()
      editor.toggleMark(type)
    }
  }
}
const RenderMark = options => {
  return {
    renderMark: (props, editor, next) => {
      if (props.mark.type === options.type) {
        return options.component(props)
      } else {
        return next()
      }
    }
  }
}
const CmdMarkPlugin = options => [
  CmdKeyMark(options),
  RenderMark(options)
]

const CmdKeyPlugins = [
  ...CmdMarkPlugin({
    type: 'bold',
    key: 'b',
    component: props => (
      <strong {...props.attribute}>{props.children}</strong>
    )
  }),
  ...CmdMarkPlugin({
    type: 'strikethrough',
    key: 's',
    component: props => (
      <s {...props.attribute}>{props.children}</s>
    )
  }),
  ...CmdMarkPlugin({
    type: 'underline',
    key: 'u',
    component: props => (
      <u {...props.attribute}>{props.children}</u>
    )
  }),
  ...CmdMarkPlugin({
    type: 'italic',
    key: 'i',
    component: props => (
      <i {...props.attribute}>{props.children}</i>
    )
  }),
  ...CmdMarkPlugin({
    type: 'highlight',
    key: 'h',
    component: props => (
      <span {...props.attribute} style={{ background: 'gold' }}>{props.children}</span>
    )
  })
]

export default CmdKeyPlugins
