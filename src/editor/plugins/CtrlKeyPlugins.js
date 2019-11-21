import React from 'react'

const CtrlKeyBlock = options => {
  const { type, key } = options
  return {
    onKeyDown: (e, editor, next) => {
      if (!e.ctrlKey || !(e.key === key)) {
        return next()
      }
      e.preventDefault()
      const isType = editor.value.blocks.some(block => block.type === type)
      editor.setBlocks({ type: isType ? 'paragraph' : type })
    }
  }
}

const RenderBlock = options => {
  const { type, component } = options
  return {
    renderBlock: (props, editor, next) => {
      if (props.node.type === type) {
        return component({ ...props })
      } else {
        return next()
      }
    }
  }
}
const ctrlKeyPlugin = ({ type, key, component }) => {
  return [
    CtrlKeyBlock({ type, key }),
    RenderBlock({ type, component })
  ]
}

const CtrlKeyPlugins = [
  ...ctrlKeyPlugin({
    type: 'code',
    key: 'c',
    component: props => (
      <pre {...props.attribute}>
        <code>{props.children}</code>
      </pre>
    )
  }),
  ...ctrlKeyPlugin({
    type: 'header1',
    key: '1',
    component: props => (
      <h1 {...props.attribute}>
        {props.children}
      </h1>
    )
  }),
  ...ctrlKeyPlugin({
    type: 'header2',
    key: '2',
    component: props => (
      <h2 {...props.attribute}>
        {props.children}
      </h2>
    )
  }),
  ...ctrlKeyPlugin({
    type: 'header3',
    key: '3',
    component: props => (
      <h3 {...props.attribute}>
        {props.children}
      </h3>
    )
  }),
  ...ctrlKeyPlugin({
    type: 'header4',
    key: '4',
    component: props => (
      <h4 {...props.attribute}>
        {props.children}
      </h4>
    )
  }),
  ...ctrlKeyPlugin({
    type: 'header5',
    key: '5',
    component: props => (
      <h5 {...props.attribute}>
        {props.children}
      </h5>
    )
  }),
  ...ctrlKeyPlugin({
    type: 'header6',
    key: '6',
    component: props => (
      <h6 {...props.attribute}>
        {props.children}
      </h6>
    )
  }),
  ...ctrlKeyPlugin({
    type: 'quotation',
    key: 'q',
    component: props => (
      <blockquote {...props.attribute}>
        {props.children}
      </blockquote>
    )
  })
]

export default CtrlKeyPlugins
