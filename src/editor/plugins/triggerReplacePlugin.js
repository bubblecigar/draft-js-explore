
const dictionary = {
  lt: ['left', 'light', 'lot']
}

const triggerReplacePlugin = {
  queries: {
    getLastWord: editor => {
      if (editor.value.focusText) {
        const text = editor.value.focusText.text
        const focusOffset = editor.value.selection.focus.offset
        const tail = text.slice(0, focusOffset).split(' ').reverse()[0]
        return tail
      }
      return ''
    },
    getSuggestionList: editor => {
      return dictionary[editor.getLastWord()] || []
    },
    getSuggestionListOf: (editor, key) => {
      return dictionary[editor.getLastWord() + key] || []
    }
  },
  commands: {
    replaceLastWord: (editor, newWord) => {
      const lastWord = editor.getLastWord()
      if (typeof newWord !== 'string') {
        return
      }
      editor.deleteBackward(lastWord.length).insertText(newWord)
    },
    replaceLastWordBySuggestion: editor => {
      const lastWord = editor.getLastWord()
      const suggestions = editor.getSuggestionList()
      editor.deleteBackward(lastWord.length).insertText(suggestions[0] ? suggestions[0] : lastWord)
    }
  }
  // onKeyDown: (e, editor, next) => {
  //   if (e.keyCode !== 9) {
  //     return next()
  //   }
  //   // replace last word by suggestion
  //   e.preventDefault()
  //   editor.replaceLastWordBySuggestion()
  // }
}

export default triggerReplacePlugin
