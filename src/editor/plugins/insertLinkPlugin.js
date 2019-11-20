import React from 'react'
import { Editor } from 'slate-react'
import { Value, Inline, Text } from 'slate'

const insertLinkPlugin = {
  schema: {
    inlines: {
      link: {
        isVoid: false,
        nodes: [{
          match: { object: 'text' }
        }],
        text: /^link$/
      }
    }
  },
  onKeyDown: (e, editor, next) => {
    if (!e.shiftKey || !(e.keyCode === 66)) {
      return next()
    }
    e.preventDefault()
    const link = Inline.fromJSON({
      type: 'link',
      nodes: [
        Text.create('link')
      ]
    })
    editor.insertInline(link)
  },
  renderInline: (props, editor, next) => {
    const { attributes, node: { type }, children } = props
    return (
      type === 'link' ? (
        <a
          href='https://www.google.com/'
          rel='noopener noreferrer'
          target='_BLANK' {...attributes}
        >
          {children}
        </a>
      ) : next()
    )
  }
}

export default insertLinkPlugin
