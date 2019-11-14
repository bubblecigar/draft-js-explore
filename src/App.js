import React from 'react'
import { Card, Divider, Button, Link, Grid, Input, Snackbar } from '@material-ui/core'
import { makeStyles, styled } from '@material-ui/core/styles'
import draft from 'draft-js'
import store from 'store-js'
import prefixMap from './prefixMap'

const DraftEditor = draft.Editor

const useStyles = makeStyles({
  read: {
    background: 'rgba(0,0,0,.15)'
  },
  edit: {
    background: 'white'
  }
})

const PaddingCard = styled(Card)({
  padding: '20px',
  border: '1px solid black',
  margin: '2px'
})

const highlightMacther = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    characterMetadata => {
      const entityKey = characterMetadata.getEntity()
      return entityKey ? contentState.getEntity(entityKey).getType() === 'HIGHLIGHT' : false
    },
    callback
  )
}
const linkMacther = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    characterMetadata => {
      const entityKey = characterMetadata.getEntity()
      return entityKey ? contentState.getEntity(entityKey).getType() === 'LINK' : false
    },
    callback
  )
}
const HighlightSpan = props => {
  return <span style={{ background: 'gold' }}>{props.children}</span>
}
const MyLink = props => {
  const { contentState, entityKey } = props
  const { url } = contentState.getEntity(entityKey).getData()
  return <Link href={url} target='_BLANK'>{props.children}</Link>
}
const compositeDecorator = new draft.CompositeDecorator([
  {
    strategy: highlightMacther,
    component: HighlightSpan
  },
  {
    strategy: linkMacther,
    component: MyLink
  }
])

const MyDraftEditor = ({ prefixMap, initContentState }) => {
  // core
  const [editorState, setEditorState] = React.useState(draft.EditorState.createWithContent(initContentState, compositeDecorator))

  // depends on core
  const [plainText, setPlainText] = React.useState(editorState.getCurrentContent().getPlainText())
  const [lastCommand, setLastCommand] = React.useState('')
  const [selectionState, setSelectionState] = React.useState(draft.SelectionState.createEmpty())
  const [contentRaw, setContentRaw] = React.useState(draft.convertToRaw(editorState.getCurrentContent()))
  const [readOnly, setReadOnly] = React.useState(false)
  const [linkUrl, setLinkUrl] = React.useState('')
  const [hint, setHint] = React.useState(false)
  React.useEffect(
    () => {
      getCurrentWordSelectionState()
    }
  )
  const readStyle = useStyles().read
  const editStyle = useStyles().edit

  const saveToLocal = () => {
    store.set('draftJS-demo', contentRaw)
    setHint(true)
  }

  const toggleReadOnly = () => {
    setReadOnly(!readOnly)
  }

  const handleKeyCommand = (command, editorState) => {
    setLastCommand('')
    setTimeout(() => setLastCommand(command), 100)

    // customized
    if (command === 'add-postfix') {
      const postfix = prefixMap[getCurrentWord(plainText)]
      const newContentState = draft.Modifier.insertText(editorState.getCurrentContent(), selectionState, postfix)
      const newEditorState = draft.EditorState.push(editorState, newContentState, 'insert-characters')
      onChange(newEditorState)
      return 'handled'
    }

    if (command === 'add-highlight') {
      const contentState = editorState.getCurrentContent()
      const contentStateWithEntity = contentState.createEntity(
        'HIGHLIGHT',
        'MUTABLE',
        {}
      )
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
      const contentStateWithLink = draft.Modifier.applyEntity(
        contentStateWithEntity,
        selectionState,
        entityKey)
      const newEditorState = draft.EditorState.push(editorState, contentStateWithLink, 'apply-entity')
      onChange(newEditorState)
      return 'handled'
    }

    if (command === 'add-link') {
      // deafult link
      const contentState = editorState.getCurrentContent()
      const contentStateWithEntity = contentState.createEntity(
        'LINK',
        'MUTABLE',
        { url: linkUrl }
      )
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
      const newEditorState = draft.EditorState.push(editorState, contentStateWithEntity, 'create-entity')
      const newEditorState2 = draft.RichUtils.toggleLink(newEditorState, selectionState, entityKey)
      setEditorState(newEditorState2)
      return 'handled'
    }

    // default
    const newEditorState = draft.RichUtils.handleKeyCommand(editorState, command)
    if (newEditorState) {
      setEditorState(newEditorState)
      return 'handled'
    }
    return 'not-handled'
  }

  const keyBindingFn = e => {
    // customized
    // tab to add-postfix
    if (e.keyCode === 9) {
      return 'add-postfix'
    }
    // cmd + a to add-highlight
    if (e.keyCode === 65 && draft.KeyBindingUtil.hasCommandModifier(e)) {
      return 'add-highlight'
    }
    // shift + l to add-link
    if (e.keyCode === 76 && draft.KeyBindingUtil.hasCommandModifier(e)) {
      return 'add-link'
    }

    // default
    return draft.getDefaultKeyBinding(e)
  }

  const onChange = editorState => {
    const contentState = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()

    const plainText = contentState.getPlainText()

    setPlainText(plainText)
    setSelectionState(selectionState)
    setEditorState(editorState)
    setContentRaw(draft.convertToRaw(contentState))
  }

  const getCurrentWord = () => {
    const contentState = editorState.getCurrentContent()
    const anchorKey = selectionState.getAnchorKey()
    if (!anchorKey) {
      return ''
    }
    const contentBlock = contentState.getBlockForKey(anchorKey)
    const pre = contentBlock.getText().slice(0, selectionState.getEndOffset()).split(' ').reverse()[0]
    const post = contentBlock.getText().slice(selectionState.getEndOffset()).split(' ')[0]
    return pre + post
  }

  const getCurrentWordSelectionState = () => {
    const contentState = editorState.getCurrentContent()
    const anchorKey = selectionState.getAnchorKey()
    if (!anchorKey) {
      return ''
    }
    const contentBlock = contentState.getBlockForKey(anchorKey)
    const contentText = contentBlock.getText()
    const anchorOffset = selectionState.getAnchorOffset()
    const focusOffset = selectionState.getFocusOffset()
    const backwardOffset = contentText.slice(0, anchorOffset).split(' ').reverse()[0].length
    const forwardOffset = contentText.slice(0, anchorOffset).split(' ')[0].length
    const newSelecttionState = draft.SelectionState.createEmpty(anchorKey)
    const lastWordSelectionState = newSelecttionState.merge({
      anchorOffset: anchorOffset - backwardOffset,
      focusOffset: focusOffset + forwardOffset
    })
    return lastWordSelectionState
  }

  const changeLinkUrl = e => {
    setLinkUrl(e.target.value)
  }

  return (
    <div>
      <PaddingCard>
        <Grid container>
          <Grid item xs={2}>
            <Button onClick={toggleReadOnly} color='primary' variant={readOnly ? 'contained' : 'text'}>{readOnly ? 'ReadOnly' : 'EditMode'}</Button>
          </Grid>
          <Grid item xs={2}>
            <Button onClick={saveToLocal} color='secondary'>Save</Button>
          </Grid>
          <Grid item xs={8}>
            <Input value={linkUrl} onChange={changeLinkUrl} placeholder='href' fullWidth />
          </Grid>
        </Grid>
      </PaddingCard>
      <PaddingCard className={readOnly ? readStyle : editStyle}>
        <DraftEditor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={onChange}
          keyBindingFn={keyBindingFn}
          readOnly={readOnly}
        />
      </PaddingCard>
      <Divider />
      <PaddingCard>
        Plain text: {plainText}
      </PaddingCard>
      <Divider />
      <PaddingCard>
        Select from {selectionState.getStartOffset()} to {selectionState.getEndOffset()}
      </PaddingCard>
      <Divider />
      <PaddingCard>
        Cursor word: {getCurrentWord()}
      </PaddingCard>
      <Divider />
      <PaddingCard>
        PostFix- {prefixMap[getCurrentWord()]}
      </PaddingCard>
      <Divider />
      <PaddingCard>
        prefixMap: {Object.keys(prefixMap).map(prefix => (
          <div key={prefix}>
            {prefix} - {prefixMap[prefix]}
          </div>
        ))}
      </PaddingCard>
      <Divider />
      <PaddingCard>
        Last Command: {lastCommand}
      </PaddingCard>
      <Divider />
      <PaddingCard>
        JSON: {JSON.stringify(contentRaw)}
      </PaddingCard>
      <Snackbar
        open={hint} anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        autoHideDuration={1000}
        onClose={() => setHint(false)}
        message='Saved to local'
      />
    </div>
  )
}

function App () {
  const storedRaw = store.get('draftJS-demo')
  let storedContent
  try {
    storedContent = draft.convertFromRaw(storedRaw)
  } catch (error) {
    console.log('error:', error)
  }
  const initContentState = storedContent || draft.ContentState.createFromText('')
  return (
    <div>
      <MyDraftEditor prefixMap={prefixMap} initContentState={initContentState} />
    </div>
  )
}

export default App
