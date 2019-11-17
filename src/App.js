import React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import { Divider, Box, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import store from 'store-js'

const storedJsonStr = store.get('slateJs-demo')
const json = JSON.parse(storedJsonStr)
const initialValue = Value.fromJSON(json || {
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            text: 'A line of text in a paragraph.'
          }
        ]
      }
    ]
  }
})

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

const HighlightFocusedBlockPlugin = {
  renderBlock: (props, editor, next) => {
    return props.isFocused ? (
      <div style={{ backgroundColor: 'rgba(0,0,0,.05)' }}>
        {next()}
      </div>) : next()
  }
}

const queryPlugins = [
  {
    queries: {
      isBoldActive: editor => editor.value.activeMarks.some(mark => mark.type === 'bold'),
      isItalicActive: editor => editor.value.activeMarks.some(mark => mark.type === 'italic'),
      isStrikethroughActive: editor => editor.value.activeMarks.some(mark => mark.type === 'strikethrough'),
      isCodeBlock: editor => editor.value.blocks.some(block => block.type === 'code'),
      isParagraphBlock: editor => editor.value.blocks.some(block => block.type === 'paragraph'),
      isQuotationBlock: editor => editor.value.blocks.some(block => block.type === 'quotation')
    }
  }
]

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'space-between'
  }
})
const Toolbar = ({ editor }) => {
  const classes = useStyles()
  const toggleBold = e => {
    e.preventDefault()
    editor.toggleMark({ type: 'bold' })
  }
  const toggleItalic = e => {
    e.preventDefault()
    editor.toggleMark({ type: 'italic' })
  }
  const toggleStrikethrough = e => {
    e.preventDefault()
    editor.toggleMark({ type: 'strikethrough' })
  }
  const setCodeBlock = e => {
    e.preventDefault()
    editor.isCodeBlock() ? editor.setBlocks({ type: 'paragraph' }) : editor.setBlocks({ type: 'code' })
  }
  const setQuotationBlock = e => {
    e.preventDefault()
    editor.isQuotationBlock() ? editor.setBlocks({ type: 'paragraph' }) : editor.setBlocks({ type: 'quotation' })
  }
  const setParagraphBlock = e => {
    e.preventDefault()
    editor.setBlocks({ type: 'paragraph' })
  }
  return (
    <Box className={classes.container} p={2}>
      <div>
        <Button
          onMouseDown={toggleBold}
          color={editor.isBoldActive() ? 'secondary' : 'default'}
        >
          {'bold'}
        </Button>
        <Button
          onMouseDown={toggleItalic}
          color={editor.isItalicActive() ? 'secondary' : 'default'}
        >
          {'italic'}
        </Button>
        <Button
          onMouseDown={toggleStrikethrough}
          color={editor.isStrikethroughActive() ? 'secondary' : 'default'}
        >
          {'strike'}
        </Button>
      </div>
      <div>
        <Button
          onMouseDown={setParagraphBlock}
          color={editor.isParagraphBlock() ? 'secondary' : 'default'}
        >
          {'paragraph'}
        </Button>
        <Button
          onMouseDown={setQuotationBlock}
          color={editor.isQuotationBlock() ? 'secondary' : 'default'}
        >
          {'quote'}
        </Button>
        <Button
          onMouseDown={setCodeBlock}
          color={editor.isCodeBlock() ? 'secondary' : 'default'}
        >
          {'code'}
        </Button>
      </div>
    </Box>
  )
}
const editorPlugin = {
  renderEditor: (props, editor, next) => {
    return (
      <div>
        <Toolbar editor={editor} />
        <Divider />
        <Box p={2}>
          {next()}
        </Box>
        <Divider />
      </div>
    )
  }
}

const plugins = [
  editorPlugin,
  ...queryPlugins,
  HighlightFocusedBlockPlugin,
  ...CmdKeyPlugins,
  ...CtrlKeyPlugins
]

const MyEditor = props => {
  const [value, setValue] = React.useState(initialValue)
  const onChange = (change) => {
    const jsonStr = JSON.stringify(change.value.toJSON())
    store.set('slateJs-demo', jsonStr)
    setValue(change.value)
  }
  return (
    <Editor
      onChange={onChange}
      value={value}
      plugins={plugins}
      autoFocus
      placeholder='Type something here...'
    />
  )
}

function App () {
  return (
    <MyEditor />
  )
}

export default App
