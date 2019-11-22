const LastWordPlugin = {
  queries: {
    getLastWord: editor => {
      if (editor.value.focusText) {
        const text = editor.value.focusText.text
        const focusOffset = editor.value.selection.focus.offset
        const tail = text.slice(0, focusOffset).split('\n').join('').split(' ').reverse()[0]
        return tail
      }
      return ''
    }
  },
  commands: {
    replaceLastWord: (editor, newWord) => {
      const lastWord = editor.getLastWord()
      if (!lastWord) {
        return
      }
      if (typeof newWord !== 'string') {
        return
      }
      editor.deleteBackward(lastWord.length).insertText(newWord)
    }
  }
}
export default LastWordPlugin
