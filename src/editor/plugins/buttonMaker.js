import React from 'react'
import { toggleButtonStyle } from '../styles/buttonStyle'

const isMarkTypeActive = (editor, type) => editor.value.activeMarks.some(mark => mark.type === type)
const isBlockTypeActive = (editor, type) => editor.value.blocks.some(block => block.type === type)

const makeButton = ({ mouseDownHandler, styleHandler }) => ({ editor, label }) => (
  <button
    style={styleHandler(editor)}
    onMouseDown={mouseDownHandler(editor)}
  >
    {label}
  </button>
)
const makeToggleMarkButton = ({ type }) => makeButton({
  mouseDownHandler: editor => e => {
    e.preventDefault()
    editor.toggleMark({ type })
  },
  styleHandler: editor => isMarkTypeActive(editor, type)
    ? toggleButtonStyle({ active: true })
    : toggleButtonStyle({ active: false })
})
const createMarkButton = ({ type, label }) => editor => makeToggleMarkButton({ type })({ editor, label })

const makeSetBlockButton = ({ type }) => makeButton({
  mouseDownHandler: editor => e => {
    e.preventDefault()
    editor.setBlocks({ type })
  },
  styleHandler: editor => isBlockTypeActive(editor, type)
    ? toggleButtonStyle({ active: true })
    : toggleButtonStyle({ active: false })
})
const createBlockButton = ({ type, label }) => editor => (
  makeSetBlockButton({ type })({ editor, label })
)

export { createMarkButton, createBlockButton }
